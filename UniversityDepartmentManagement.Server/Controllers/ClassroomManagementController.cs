using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityDepartmentManagement.Server.Data;
using UniversityDepartmentManagement.Server.Entities;
using UniversityDepartmentManagement.Server.Models;

namespace UniversityDepartmentManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassroomManagementController : ControllerBase
    {
        private readonly DataApplicationContext _context;
        private readonly ILogger<ClassroomManagementController> _logger;


        public ClassroomManagementController(DataApplicationContext context, ILogger<ClassroomManagementController> logger)
        {
            _context = context;
            _logger = logger;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Classroom>>> GetClassrooms()
        {
            try
            {
                var classrooms = await _context.Classrooms
                    .Select(c => new ClassroomModel
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Capacity = c.Capacity,
                        Columns = c.Columns,
                        SeatsPerColumn = c.SeatsPerColumn,
                        LectureCount = c.Lectures.Count
                    })
                    .ToListAsync();

                return Ok(classrooms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting classrooms");
                return StatusCode(500, "Error retrieving classrooms from database");
            }


            
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Classroom>> GetClassroom(int id)
        {
            var classroom = await _context.Classrooms.FindAsync(id);

            if (classroom == null)
            {
                return NotFound();
            }

            return classroom;
        }


        [HttpPost]
        public async Task<ActionResult<Classroom>> PostClassroom(ClassroomModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Name))
            {
                return BadRequest("Classroom name is required.");
            }

            if (model.Capacity <= 0)
            {
                return BadRequest("Capacity must be greater than 0.");
            }
            var newClassRoom = new Classroom()
            {
                Name = model.Name,
                Capacity = model.Capacity,
                Columns = model.Columns,
                SeatsPerColumn = model.SeatsPerColumn,

            };
            _context.Classrooms.Add(newClassRoom);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClassroom), new { id = model.Id }, model);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutClassroom(int id, ClassroomModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (string.IsNullOrWhiteSpace(model.Name))
            {
                return BadRequest("Classroom name is required.");
            }

            if (model.Capacity <= 0)
            {
                return BadRequest("Capacity must be greater than 0.");
            }

            var existingClassroom = await _context.Classrooms.FindAsync(id);
            if (existingClassroom == null)
            {
                return NotFound();
            }

            // Map the model to the existing entity
            existingClassroom.Name = model.Name;
            existingClassroom.Capacity = model.Capacity;
            existingClassroom.Columns = model.Columns;
            existingClassroom.SeatsPerColumn = model.SeatsPerColumn;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassroomExists(id))
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
        public async Task<IActionResult> DeleteClassroom(int id)
        {
            var classroom = await _context.Classrooms.FindAsync(id);
            if (classroom == null)
            {
                return NotFound();
            }

            // Check if the classroom has any lectures assigned
            if (classroom.Lectures?.Any() == true)
            {
                return BadRequest("Cannot delete classroom as it has assigned lectures.");
            }

            _context.Classrooms.Remove(classroom);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClassroomExists(int id)
        {
            return _context.Classrooms.Any(e => e.Id == id);
        }

        

        [HttpGet("{id}/lectures")]
        public async Task<ActionResult<IEnumerable<LectureDto>>> GetClassroomLectures(int id)
        {
            var lectures = await _context.Lectures
                .Where(l => l.ClassroomId == id)
                .Select(l => new LectureDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    LectureCode = l.LectureCode,
                    Language = l.Language,
                    StudentNumber = l.StudentNumber,
                    InstructorName = l.User.Name + " " + l.User.SurName
                })
                .ToListAsync();

            return Ok(lectures);
        }

        
    }

    public class LectureDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LectureCode { get; set; }
        public string Language { get; set; }
        public int StudentNumber { get; set; }
        public string InstructorName { get; set; }
    }
}

