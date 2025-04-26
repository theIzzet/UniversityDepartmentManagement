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

        public LectureScheduleManagementController (DataApplicationContext dataApplicationContext)
        {
            _context = dataApplicationContext;
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
            var lecture = await _context.Lectures
                .Include(l => l.Classroom)
                .FirstOrDefaultAsync(l => l.Id == model.LectureId);

            if (lecture == null)
                return NotFound("Lecture not found");

            // Çakışma kontrolü - daha basit ve çevrilebilir bir formatta
            var conflictingSchedules = await _context.LectureSchedules
                .Include(ls => ls.Lecture)
                .Where(ls => ls.Day == model.Day)
                .ToListAsync();

            bool hasConflict = conflictingSchedules.Any(ls =>
                model.StartTime < ls.EndTime &&
                model.EndTime > ls.StartTime &&
                (ls.Lecture.ClassroomId == lecture.ClassroomId ||
                 ls.Lecture.InstructorId == lecture.InstructorId));

            if (hasConflict)
                return BadRequest("The schedule conflicts with another class or instructor.");

            var newSchedule = new LectureSchedule
            {
                LectureId = model.LectureId,
                Day = model.Day,
                StartTime = model.StartTime,
                EndTime = model.EndTime
            };

            _context.LectureSchedules.Add(newSchedule);

            await _context.SaveChangesAsync();

            // Yeni oluşturulan schedule'ı dönerken de döngüsel referansı önleyelim
            return Ok(new
            {
                Id = newSchedule.Id,
                Day = newSchedule.Day,
                StartTime = newSchedule.StartTime,
                EndTime = newSchedule.EndTime,
                LectureId = newSchedule.LectureId
            });
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
                            ls.Day == model.Day &&
                            ((model.StartTime < ls.EndTime && model.EndTime > ls.StartTime)) &&
                            (ls.Lecture.ClassroomId == lecture.ClassroomId || ls.Lecture.InstructorId == lecture.InstructorId))
                .AnyAsync();

            if (conflict)
                return BadRequest("The updated schedule conflicts with another class or instructor.");

            existingSchedule.Day = model.Day;
            existingSchedule.StartTime = model.StartTime;
            existingSchedule.EndTime = model.EndTime;
            existingSchedule.LectureId = model.LectureId;

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
