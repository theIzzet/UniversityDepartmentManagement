using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityDepartmentManagement.Server.Data;
using UniversityDepartmentManagement.Server.Entities;
using UniversityDepartmentManagement.Server.Models;

namespace UniversityDepartmentManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LectureController : ControllerBase
    {
        private readonly DataApplicationContext _context;
        public LectureController(DataApplicationContext context)
        {
            _context = context;
        }



        [HttpGet]
        public async Task<ActionResult<IEnumerable<LectureList>>> GetLectures()
        {
            try
            {
                var lectures = await _context.Lectures
                    .Include(l => l.Classroom)
                    .Include(l => l.User)
                    .Select(l => new LectureList
                    {
                        Id = l.Id,
                        Name = l.Name,
                        LectureCode=l.LectureCode,
                        Language = l.Language,
                        StudentNumber = l.StudentNumber,
                        ClassroomId = l.ClassroomId,
                        InstructorId = l.InstructorId,
                        InstructorName = l.User.Name + " " + l.User.SurName,
                         Classroom = new ClassroomModel
                         {
                             Id = l.Classroom.Id,
                             Name = l.Classroom.Name,
                             Capacity = l.Classroom.Capacity
                         }
                    })
                    .ToListAsync();

                return Ok(lectures);
            }
            catch (Exception ex)
            {
                
                Console.WriteLine($"Error getting lectures: {ex.Message}");
                return StatusCode(500, "Dersler getirilirken bir hata oluştu");
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<LectureList>> GetLecture(int id)
        {
            var lecture = await _context.Lectures
                .Include(l => l.Classroom)
                .Include(l => l.User)
                .Include(l => l.Schedules)
                .Select(l => new LectureList
                {
                    Id = l.Id,
                    Name = l.Name,
                    LectureCode = l.LectureCode,
                    Language = l.Language,
                    StudentNumber = l.StudentNumber,
                    ClassroomId = l.ClassroomId,
                    InstructorId = l.InstructorId,
                })
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lecture == null)
            {
                return NotFound();
            }

            return lecture;
        }
        
        [HttpPost]
        public async Task<ActionResult<Lecture>> PostLecture(LectureModel model)
        {
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

           
            var classroomExists = await _context.Classrooms.AnyAsync(c => c.Id == model.ClassroomId);
            if (!classroomExists)
            {
                return BadRequest("Classroom does not exist.");

            }
            var classroom = await _context.Classrooms.FindAsync(model.ClassroomId);
            if (model.StudentNumber > classroom.Capacity)
            {
                return BadRequest($"Classroom capacity ({classroom.Capacity}) is less than student number ({model.StudentNumber})");
            }

            var instructorExists = await _context.Users.AnyAsync(u => u.Id == model.InstructorId);
            if (!instructorExists)
            {
                return BadRequest("Instructor does not exist.");
            }


            var lecture = new Lecture
            {
                Name = model.Name,
                LectureCode = model.LectureCode,
                Language = model.Language,
                StudentNumber=model.StudentNumber,
                ClassroomId = model.ClassroomId,
                InstructorId = model.InstructorId
            };

            _context.Lectures.Add(lecture);
            await _context.SaveChangesAsync();



            var createdLecture = await _context.Lectures
        .Include(l => l.Classroom)
        .Include(l => l.User)
        .FirstOrDefaultAsync(l => l.Id == lecture.Id);

            var responseDto = new LectureList
            {
                Id = createdLecture.Id,
                Name = createdLecture.Name,
                LectureCode = createdLecture.LectureCode,
                Language = createdLecture.Language,
                StudentNumber = createdLecture.StudentNumber,
                ClassroomId = createdLecture.ClassroomId,
                InstructorId = createdLecture.InstructorId,
                InstructorName = createdLecture.User.Name + " " + createdLecture.User.SurName,
                Classroom = new ClassroomModel
                {
                    Id = createdLecture.Classroom.Id,
                    Name = createdLecture.Classroom.Name,
                    Capacity = createdLecture.Classroom.Capacity
                }
            };

            return CreatedAtAction(nameof(GetLecture), new { id = lecture.Id }, responseDto);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLecture(int id, LectureModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch");
            }

            var lecture = await _context.Lectures.FindAsync(id);
            if (lecture == null)
            {
                return NotFound();
            }

            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            
            if (model.ClassroomId != lecture.ClassroomId)
            {
                var classroomExists = await _context.Classrooms.AnyAsync(c => c.Id == model.ClassroomId);
                if (!classroomExists)
                {
                    return BadRequest("Classroom does not exist.");
                }
            }


            var classroom = await _context.Classrooms.FindAsync(model.ClassroomId);
            if (model.StudentNumber > classroom.Capacity)
            {
                return BadRequest($"Classroom capacity ({classroom.Capacity}) is less than student number ({model.StudentNumber})");
            }

            if (model.InstructorId != lecture.InstructorId)
            {
                var instructorExists = await _context.Users.AnyAsync(u => u.Id == model.InstructorId);
                if (!instructorExists)
                {
                    return BadRequest("Instructor does not exist.");
                }
            }

            
            lecture.Name = model.Name;
            lecture.LectureCode = model.LectureCode;
            lecture.Language = model.Language;
            lecture.StudentNumber = model.StudentNumber;
            lecture.ClassroomId = model.ClassroomId;
            lecture.InstructorId = model.InstructorId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LectureExists(id))
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
        public async Task<IActionResult> DeleteLecture(int id)
        {
            var lecture = await _context.Lectures
                .Include(l => l.Schedules)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lecture == null)
            {
                return NotFound();
            }

            
            if (lecture.Schedules?.Any() == true)
            {
                return BadRequest("Cannot delete lecture as it has assigned schedules.");
            }

            _context.Lectures.Remove(lecture);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LectureExists(int id)
        {
            return _context.Lectures.Any(e => e.Id == id);
        }
    }
}
