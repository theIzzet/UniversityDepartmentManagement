using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityDepartmentManagement.Server.Data;
using UniversityDepartmentManagement.Server.Entities;
using UniversityDepartmentManagement.Server.Models;
namespace UniversityDepartmentManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LectureScheduleManagementController : ControllerBase
    {
        private readonly DataApplicationContext _context;
        private readonly ILogger<LectureScheduleManagementController> _logger;

        public LectureScheduleManagementController (DataApplicationContext dataApplicationContext, ILogger<LectureScheduleManagementController> logger)
        {
            _context = dataApplicationContext;
            _logger = logger;
        }



        [HttpGet("all-lecture-schedules")]
        public async Task<IActionResult> GetAllLectureSchedules()
        {
            var schedules = await _context.LectureSchedules
                .Include(ls => ls.Lecture)
                    .ThenInclude(l => l.Classroom)
                .Include(ls => ls.Lecture)
                    .ThenInclude(l => l.User)
                .Select(ls => new
                {
                    Id = ls.Id,
                    Day = ls.Day,
                    StartTime = ls.StartTime,
                    EndTime = ls.EndTime,
                    Grade = ls.Grade,
                    Semester = ls.Semester,
                    Lecture = new
                    {
                        Id = ls.Lecture.Id,
                        Name = ls.Lecture.Name,
                        LectureCode = ls.Lecture.LectureCode,
                        Classroom = new
                        {
                            Id = ls.Lecture.Classroom.Id,
                            Name = ls.Lecture.Classroom.Name
                        },
                        User = new
                        {
                            Id = ls.Lecture.User.Id,
                            FullName = ls.Lecture.User.Name + " " + ls.Lecture.User.SurName
                        }
                    }
                })
                .ToListAsync();

            return Ok(schedules);
        }



        [HttpGet("filtered-lecture-schedules")]
        public async Task<IActionResult> GetFilteredLectureSchedules(int grade, string semester)
        {
            var schedules = await _context.LectureSchedules
                .Include(ls => ls.Lecture)
                    .ThenInclude(l => l.Classroom)
                .Include(ls => ls.Lecture)
                    .ThenInclude(l => l.User)
                .Where(ls => ls.Grade == grade && ls.Semester == semester)
                .Select(ls => new
                {
                    Id = ls.Id,
                    Day = ls.Day,
                    StartTime = ls.StartTime,
                    EndTime = ls.EndTime,
                    Grade = ls.Grade,
                    Semester = ls.Semester,
                    Lecture = new
                    {
                        Id = ls.Lecture.Id,
                        Name = ls.Lecture.Name,
                        LectureCode = ls.Lecture.LectureCode,
                        Classroom = new
                        {
                            Id = ls.Lecture.Classroom.Id,
                            Name = ls.Lecture.Classroom.Name
                        },
                        User = new
                        {
                            Id = ls.Lecture.User.Id,
                            FullName = ls.Lecture.User.Name + " " + ls.Lecture.User.SurName
                        }
                    }
                })
                .ToListAsync();

            return Ok(schedules);
        }


        [HttpPost("add-lecture-schedule")]
        public async Task<IActionResult> AddLectureSchedule([FromBody] LectureScheduleModel model)
        {
            try
            {
                var lecture = await _context.Lectures
                    .Include(l => l.Classroom)
                    .FirstOrDefaultAsync(l => l.Id == model.LectureId);

                if (lecture == null)
                    return NotFound("Lecture not found");

                // Convert times to TimeSpan
                var startTime = model.StartTime;
                var endTime = model.EndTime;

                // Get all schedules for the same day and semester
                var existingSchedules = await _context.LectureSchedules
                    .Include(ls => ls.Lecture)
                    .Where(ls => ls.Day == model.Day && ls.Semester == model.Semester)
                    .ToListAsync();

                // Check for classroom conflicts
                var classroomConflicts = existingSchedules
                    .Where(ls => ls.Lecture.ClassroomId == lecture.ClassroomId &&
                                startTime < ls.EndTime && endTime > ls.StartTime)
                    .ToList();

                if (classroomConflicts.Any())
                {
                    var conflictDetails = classroomConflicts
                        .Select(cs => $"{cs.Lecture.Name} (Grade {cs.Grade}) - {cs.StartTime:hh\\:mm} to {cs.EndTime:hh\\:mm}")
                        .ToList();

                    return BadRequest(new
                    {
                        Message = "The classroom is already occupied during the requested time slot.",
                        Conflicts = conflictDetails,
                        ClassroomName = lecture.Classroom.Name
                    });
                }

                var newSchedule = new LectureSchedule
                {
                    LectureId = model.LectureId,
                    Day = model.Day,
                    StartTime = startTime,
                    EndTime = endTime,
                    Grade = model.Grade,
                    Semester = model.Semester
                };

                _context.LectureSchedules.Add(newSchedule);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Id = newSchedule.Id,
                    Day = newSchedule.Day,
                    StartTime = newSchedule.StartTime,
                    EndTime = newSchedule.EndTime,
                    LectureId = newSchedule.LectureId,
                    Grade = newSchedule.Grade,
                    Semester = newSchedule.Semester,
                    ClassroomName = lecture.Classroom.Name
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding lecture schedule");
                return BadRequest( "An error occurred while processing your request");
            }
        }

        [HttpPut("update-lecture-schedule/{id}")]
        public async Task<IActionResult> UpdateLectureSchedule(int id, [FromBody] LectureScheduleModel model)
        {
            var existingSchedule = await _context.LectureSchedules.FindAsync(id);
            if (existingSchedule == null)
                return NotFound("Schedule not found");

            var lecture = await _context.Lectures.FindAsync(model.LectureId);
            if (lecture == null)
                return NotFound("Lecture not found");

            // Çakışma kontrolü (kendisi hariç)
            bool conflict = await _context.LectureSchedules
                .Include(ls => ls.Lecture)
                .Where(ls => ls.Id != id &&
                            ls.Day == model.Day 
                            && ls.Grade == model.Grade &&
                    ls.Semester == model.Semester && ((model.StartTime < ls.EndTime && model.EndTime > ls.StartTime)) &&
                            (ls.Lecture.ClassroomId == lecture.ClassroomId || ls.Lecture.InstructorId == lecture.InstructorId))
                .AnyAsync();

            if (conflict)
                return BadRequest("The updated schedule conflicts with another class or instructor.");

            existingSchedule.Day = model.Day;
            existingSchedule.StartTime = model.StartTime;
            existingSchedule.EndTime = model.EndTime;
            existingSchedule.LectureId = model.LectureId;
            existingSchedule.Semester=model.Semester;
            existingSchedule.Grade= model.Grade;

            await _context.SaveChangesAsync();
            return Ok(existingSchedule);
        }

       

        [HttpDelete("delete-lecture-schedule/{id}")]
        public async Task<IActionResult> DeleteLectureSchedule(int id)
        {
            var schedule = await _context.LectureSchedules.FindAsync(id);
            if (schedule == null)
                return NotFound("Schedule not found");

            _context.LectureSchedules.Remove(schedule);
            await _context.SaveChangesAsync();
            return Ok("Schedule deleted");
        }
    }
}
