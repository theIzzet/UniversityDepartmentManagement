
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityDepartmentManagement.Server.Data;
using UniversityDepartmentManagement.Server.Entities;
using UniversityDepartmentManagement.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace UniversityDepartmentManagement.Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]

    public class ExamManagementController : ControllerBase
    {
        private readonly DataApplicationContext _context;
        private readonly ILogger<ExamManagementController> _logger;
        private readonly UserManager<UniversityUser> _userManager;

        public ExamManagementController(DataApplicationContext context, ILogger<ExamManagementController> logger, UserManager<UniversityUser> userManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExamDto>>> GetExams()
        {
            try
            {
                var exams = await _context.Exams
                    .Include(e => e.Lecture)
                    .Include(e => e.Classroom)
                    .Include(e => e.User)
                    .Select(e => new ExamDto
                    {
                        Id = e.Id,
                        LectureId = e.LectureId,
                        LectureName = e.Lecture.Name,
                        LectureCode = e.Lecture.LectureCode,
                        ClassroomId = e.ClassroomId,
                        ClassroomName = e.Classroom.Name,
                        SupervisorId = e.SupervisorId,
                        SupervisorName = e.User.Name + " " + e.User.SurName,
                        ExamDate = e.ExamDate,
                        StartTime = e.StartTime.ToString(@"hh\:mm"),
                        EndTime = e.EndTime.ToString(@"hh\:mm"),
                        Grade = e.Grade,
                        Semester = e.Semester,
                        StudentCount = e.Lecture.StudentNumber
                    })
                    .ToListAsync();

                return Ok(exams);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting exams");
                return StatusCode(500, "Error retrieving exams from database");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExamDto>> GetExam(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.Lecture)
                .Include(e => e.Classroom)
                .Include(e => e.User)
                .Where(e => e.Id == id)
                .Select(e => new ExamDto
                {
                    Id = e.Id,
                    LectureId = e.LectureId,
                    LectureName = e.Lecture.Name,
                    LectureCode = e.Lecture.LectureCode,
                    ClassroomId = e.ClassroomId,
                    ClassroomName = e.Classroom.Name,
                    SupervisorId = e.SupervisorId,
                    SupervisorName = e.User.Name + " " + e.User.SurName,
                    ExamDate = e.ExamDate,
                    StartTime = e.StartTime.ToString(@"hh\:mm"),
                    EndTime = e.EndTime.ToString(@"hh\:mm"),
                    Grade = e.Grade,
                    Semester = e.Semester,
                    StudentCount = e.Lecture.StudentNumber
                })
                .FirstOrDefaultAsync();

            if (exam == null)
            {
                return NotFound();
            }

            return exam;
        }

        [HttpPost]
        public async Task<ActionResult<ExamDto>> CreateExam(ExamModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

          
            var lecture = await _context.Lectures.FindAsync(model.LectureId);
            if (lecture == null)
            {
                return BadRequest("Lecture not found");
            }

            
            var classroom = await _context.Classrooms.FindAsync(model.ClassroomId);
            if (classroom == null)
            {
                return BadRequest("Classroom not found");
            }

            if (lecture.StudentNumber > classroom.Capacity)
            {
                return BadRequest($"Classroom capacity ({classroom.Capacity}) is less than student number ({lecture.StudentNumber})");
            }


            var supervisor = await _context.Users.FindAsync(model.SupervisorId);
            if (supervisor == null)
            {
                return BadRequest("Supervisor not found");
            }

            
            if (!TimeSpan.TryParse(model.StartTime, out var startTime) ||
                !TimeSpan.TryParse(model.EndTime, out var endTime))
            {
                return BadRequest("Invalid time format");
            }

            
            var classroomConflict = await _context.Exams
                .Where(e => e.ClassroomId == model.ClassroomId)
                .Where(e => e.ExamDate.Date == model.ExamDate.Date)
                .Where(e => e.Semester == model.Semester)
                .ToListAsync(); 

            classroomConflict = classroomConflict
                .Where(e => TimeSpan.Parse(model.StartTime) < e.EndTime &&
                            TimeSpan.Parse(model.EndTime) > e.StartTime)
                .ToList();

            if (classroomConflict.Any())
            {
                return BadRequest("Classroom is already booked for another exam at this time");
            }

            // Check supervisor availability
            var supervisorConflict = await _context.Exams
                .Where(e => e.SupervisorId == model.SupervisorId)
                .Where(e => e.ExamDate.Date == model.ExamDate.Date)
                .Where(e => e.Semester == model.Semester)
                .ToListAsync(); // First get all potential conflicts

            supervisorConflict = supervisorConflict
                .Where(e => TimeSpan.Parse(model.StartTime) < e.EndTime &&
                            TimeSpan.Parse(model.EndTime) > e.StartTime)
                .ToList();

            if (supervisorConflict.Any())
            {
                return BadRequest("Supervisor is already assigned to another exam at this time");
            }

            var exam = new Exam
            {
                LectureId = model.LectureId,
                SupervisorId = model.SupervisorId,
                ClassroomId = model.ClassroomId,
                ExamDate = model.ExamDate,
                StartTime = startTime,
                EndTime = endTime,
                Grade = model.Grade,
                Semester = model.Semester
            };

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            var createdExam = await _context.Exams
                .Include(e => e.Lecture)
                .Include(e => e.Classroom)
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Id == exam.Id);

            var responseDto = new ExamDto
            {
                Id = createdExam.Id,
                LectureId = createdExam.LectureId,
                LectureName = createdExam.Lecture.Name,
                LectureCode = createdExam.Lecture.LectureCode,
                ClassroomId = createdExam.ClassroomId,
                ClassroomName = createdExam.Classroom.Name,
                SupervisorId = createdExam.SupervisorId,
                SupervisorName = createdExam.User.Name + " " + createdExam.User.SurName,
                ExamDate = createdExam.ExamDate,
                StartTime = createdExam.StartTime.ToString(@"hh\:mm"),
                EndTime = createdExam.EndTime.ToString(@"hh\:mm"),
                Grade = createdExam.Grade,
                Semester = createdExam.Semester,
                StudentCount = createdExam.Lecture.StudentNumber
            };

            return CreatedAtAction(nameof(GetExam), new { id = exam.Id }, responseDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExam(int id, ExamModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch");
            }

            var exam = await _context.Exams.FindAsync(id);
            if (exam == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var lecture = await _context.Lectures.FindAsync(model.LectureId);
            if (lecture == null)
            {
                return BadRequest("Lecture not found");
            }

            var classroom = await _context.Classrooms.FindAsync(model.ClassroomId);
            if (classroom == null)
            {
                return BadRequest("Classroom not found");
            }

            
            if (lecture.StudentNumber > classroom.Capacity)
            {
                return BadRequest($"Classroom capacity ({classroom.Capacity}) is less than student number ({lecture.StudentNumber})");
            }

           
            var supervisor = await _context.Users.FindAsync(model.SupervisorId);
            if (supervisor == null)
            {
                return BadRequest("Supervisor not found");
            }

            
            if (!TimeSpan.TryParse(model.StartTime, out var startTime) ||
                !TimeSpan.TryParse(model.EndTime, out var endTime))
            {
                return BadRequest("Invalid time format");
            }

            
            var classroomConflict = await _context.Exams
                .Where(e => e.Id != id)
                .Where(e => e.ClassroomId == model.ClassroomId)
                .Where(e => e.ExamDate.Date == model.ExamDate.Date)
                .Where(e => e.Semester == model.Semester)
                .ToListAsync();

            classroomConflict = classroomConflict
                .Where(e => TimeSpan.Parse(model.StartTime) < e.EndTime &&
                            TimeSpan.Parse(model.EndTime) > e.StartTime)
                .ToList();

            if (classroomConflict.Any())
            {
                return BadRequest("Classroom is already booked for another exam at this time");
            }

            
            var supervisorConflict = await _context.Exams
                .Where(e => e.Id != id)
                .Where(e => e.SupervisorId == model.SupervisorId)
                .Where(e => e.ExamDate.Date == model.ExamDate.Date)
                .Where(e => e.Semester == model.Semester)
                .ToListAsync();

            supervisorConflict = supervisorConflict
                .Where(e => TimeSpan.Parse(model.StartTime) < e.EndTime &&
                            TimeSpan.Parse(model.EndTime) > e.StartTime)
                .ToList();

            if (supervisorConflict.Any())
            {
                return BadRequest("Supervisor is already assigned to another exam at this time");
            }

            exam.LectureId = model.LectureId;
            exam.SupervisorId = model.SupervisorId;
            exam.ClassroomId = model.ClassroomId;
            exam.ExamDate = model.ExamDate;
            exam.StartTime = startTime;
            exam.EndTime = endTime;
            exam.Grade = model.Grade;
            exam.Semester = model.Semester;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExamExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null)
            {
                return NotFound();
            }

            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("lectures")]
        public async Task<ActionResult<IEnumerable<LectureDto>>> GetAvailableLectures()
        {
            var lectures = await _context.Lectures
                .Select(l => new LectureDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    LectureCode = l.LectureCode,
                    StudentNumber = l.StudentNumber
                })
                .ToListAsync();

            return Ok(lectures);
        }

        [HttpGet("classrooms")]
        public async Task<ActionResult<IEnumerable<ClassroomDto>>> GetAvailableClassrooms()
        {
            var classrooms = await _context.Classrooms
                .Select(c => new ClassroomDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Capacity = c.Capacity
                })
                .ToListAsync();

            return Ok(classrooms);
        }

        [HttpGet("supervisors")]
        public async Task<ActionResult<IEnumerable<SupervisorDto>>> GetAvailableSupervisors()
        {
            var supervisors = await _context.Users
                .Select(u => new SupervisorDto
                {
                    Id = u.Id,
                    Name = u.Name + " " + u.SurName,
                    SicilNo = u.SicilNo
                })
                .ToListAsync();

            return Ok(supervisors);
        }

        private bool ExamExists(int id)
        {
            return _context.Exams.Any(e => e.Id == id);
        }


        [HttpGet("{id}/comments")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetExamComments(int id)
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.ExamId == id)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    InstructorName = c.User.Name + " " + c.User.SurName,
                    InstructorId = c.InstructorId
                })
                .ToListAsync();

            return Ok(comments);
        }

        [HttpPost("{id}/comments")]

        public async Task<ActionResult<CommentDto>> AddComment(int id, CommentModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Unauthorized();
            }

           
            var examExists = await _context.Exams.AnyAsync(e => e.Id == id);
            if (!examExists)
            {
                return NotFound("Exam not found");
            }

            var comment = new Comment
            {
                Content = model.Content,
                InstructorId = userId,
                ExamId = id,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            var responseDto = new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                InstructorName = user.Name + " " + user.SurName,
                InstructorId = user.Id
            };

            return CreatedAtAction(nameof(GetExamComments), new { id }, responseDto);
        }
    }

    public class ExamDto
    {
        public int Id { get; set; }
        public int LectureId { get; set; }
        public string LectureName { get; set; }
        public string LectureCode { get; set; }
        public int ClassroomId { get; set; }
        public string ClassroomName { get; set; }
        public string SupervisorId { get; set; }
        public string SupervisorName { get; set; }
        public DateTime ExamDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int Grade { get; set; }
        public string Semester { get; set; }
        public int StudentCount { get; set; }
    }

    public class ExamModel
    {
        public int Id { get; set; }
        public int LectureId { get; set; }
        public int ClassroomId { get; set; }
        public string SupervisorId { get; set; }
        public DateTime ExamDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int Grade { get; set; }
        public string Semester { get; set; }
    }


    public class ClassroomDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }
    }

    public class SupervisorDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int SicilNo { get; set; }
    }

    public class CommentModel
    {
        [Required]
        [StringLength(500, MinimumLength = 1)]
        public string Content { get; set; }
    }

    public class CommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public string InstructorName { get; set; }
        public string InstructorId { get; set; }
        public int ExamId { get; set; }
    }
}