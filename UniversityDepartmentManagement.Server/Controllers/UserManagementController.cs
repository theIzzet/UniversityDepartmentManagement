using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityDepartmentManagement.Server.Data;
using UniversityDepartmentManagement.Server.Models;

namespace UniversityDepartmentManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize(Roles = "Bölüm Sekreteri")]
    public class UserManagementController : ControllerBase
    {
       


        private readonly UserManager<UniversityUser> _userManager;
        private readonly RoleManager<UniversityRole> _roleManager;
        private readonly DataApplicationContext _context;

        public UserManagementController(UserManager<UniversityUser> userManager, RoleManager<UniversityRole> roleManager , DataApplicationContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        
        //[HttpGet("users")]
        //public ActionResult<IEnumerable<object>> GetUsers()
        //{
        //    var users = _userManager.Users.Select(u => new
        //    {
        //        u.Id,
        //        u.Name,
        //        u.SurName,
        //        u.Email,
        //        u.UserName,
        //        u.SicilNo,
        //        u.AddedTime,
        //        Roles = _userManager.GetRolesAsync(u).Result

        //    }).ToList();

        //    return Ok(users);
        //}
        // UserManagementController'a ekleyin

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users
                .Select(u => new {
                    u.Id,
                    u.Name,
                    u.SurName,
                    u.Email,
                    u.SicilNo,
                    Roles = _userManager.GetRolesAsync(u).Result
                })
                .ToListAsync();
            return Ok(users);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserModel model)
        {
            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                return BadRequest("Geçersiz rol");
            }

            var newUser = new UniversityUser
            {
                UserName = model.Email,
                Email = model.Email,
                Name = model.Name,
                SurName = model.SurName,
                SicilNo = model.SicilNo,
                AddedTime = DateTime.Now
            };

            var result = await _userManager.CreateAsync(newUser, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await _userManager.AddToRoleAsync(newUser, model.Role);
            return Ok(new { Message = "Kullanıcı oluşturuldu" });
        }

        
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserModel model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("Kullanıcı bulunamadı");

            user.Name = model.Name;
            user.SurName = model.SurName;
            user.Email = model.Email;
            user.UserName = model.Email;
            user.SicilNo = model.SicilNo;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { Message = "Kullanıcı güncellendi" });
        }

        
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("Kullanıcı bulunamadı");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { Message = "Kullanıcı silindi" });
        }




        [HttpGet("instructors")]
        public async Task<ActionResult<IEnumerable<InstructorDto>>> GetInstructors()
        {
            // Get all users who are in the "Instructor" role
            var instructorRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name == "Instructor");

            if (instructorRole == null)
            {
                return Ok(new List<InstructorDto>());
            }

            var instructorUserIds = await _context.UserRoles
                .Where(ur => ur.RoleId == instructorRole.Id)
                .Select(ur => ur.UserId)
                .ToListAsync();

            var instructors = await _context.Users
                .Where(u => instructorUserIds.Contains(u.Id))
                .Select(u => new InstructorDto
                {
                    Id = u.Id,
                    FullName = $"{u.Name} {u.SurName}",
                    SicilNo = u.SicilNo
                })
                .ToListAsync();

            return Ok(instructors);
        }

        [HttpPut("update-role/{id}")]
        public async Task<IActionResult> UpdateUserRole(string id, [FromBody] UpdateUserRoleModel model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found");

            // Mevcut rolleri al
            var currentRoles = await _userManager.GetRolesAsync(user);

            // Önce tüm rolleri kaldır
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
                return BadRequest(removeResult.Errors);

            // Yeni rolü ekle
            var addResult = await _userManager.AddToRoleAsync(user, model.Role);
            if (!addResult.Succeeded)
                return BadRequest(addResult.Errors);

            return Ok(new { Message = "User role updated successfully" });
        }

        public class UpdateUserRoleModel
        {
            public string Role { get; set; }
        }

        public class InstructorDto
        {
            public string Id { get; set; }
            public string FullName { get; set; }
            public int SicilNo { get; set; }
        }
    }
}
