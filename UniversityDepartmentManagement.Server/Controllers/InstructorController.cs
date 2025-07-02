using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityDepartmentManagement.Server.Data;
using UniversityDepartmentManagement.Server.Entities;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace UniversityDepartmentManagement.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorController : ControllerBase
    {
        private readonly DataApplicationContext _context;
        private readonly ILogger<InstructorController> _logger;
        private readonly UserManager<UniversityUser> _userManager;

        public InstructorController(
            DataApplicationContext context,
            ILogger<InstructorController> logger,
            UserManager<UniversityUser> userManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }

        [HttpGet("my-schedule")]
        public async Task<IActionResult> GetMySchedule(string semester)
        {
            try
            {
                // Get current user ID
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                // Validate semester
                if (string.IsNullOrEmpty(semester) ||
                    (semester != "Fall" && semester != "Spring"))
                {
                    return BadRequest("Valid semester (Fall/Spring) is required");
                }

                var schedules = await _context.LectureSchedules
                    .Include(ls => ls.Lecture)
                        .ThenInclude(l => l.Classroom)
                    .Where(ls => ls.Lecture.InstructorId == userId && ls.Semester == semester)
                    .Select(ls => new InstructorScheduleDto
                    {
                        Id = ls.Id,
                        Day = ls.Day,
                        StartTime = ls.StartTime,
                        EndTime = ls.EndTime,
                        Grade = ls.Grade,
                        Semester = ls.Semester,
                        Lecture = new LectureInstructorDto
                        {
                            Id = ls.Lecture.Id,
                            Name = ls.Lecture.Name,
                            LectureCode = ls.Lecture.LectureCode,
                            ClassroomName = ls.Lecture.Classroom.Name
                        }
                    })
                    .ToListAsync();

                return Ok(schedules);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting instructor schedule");
                return StatusCode(500, "Error retrieving schedule");
            }
        }
    }

    public class InstructorScheduleDto
    {
        public int Id { get; set; }
        public DayOfWeek Day { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int Grade { get; set; }
        public string Semester { get; set; }
        public LectureInstructorDto Lecture { get; set; }
    }

    public class LectureInstructorDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LectureCode { get; set; }
        public string ClassroomName { get; set; }
    }
}