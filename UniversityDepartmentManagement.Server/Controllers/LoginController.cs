using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using UniversityDepartmentManagement.Server.Data;
using UniversityDepartmentManagement.Server.Models;

namespace UniversityDepartmentManagement.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {

        private readonly SignInManager<UniversityUser> _signInManager;
        private readonly UserManager<UniversityUser> _userManager;
        private readonly RoleManager<UniversityRole> _roleManager;
        private readonly ILogger<LoginController> _logger;
        private readonly IConfiguration _configuration;

        public LoginController(SignInManager<UniversityUser> signInManager, RoleManager<UniversityRole> roleManager,
           UserManager<UniversityUser> userManager, ILogger<LoginController> logger , IConfiguration configuration)
        {
            _signInManager = signInManager;
            _roleManager = roleManager;
            _userManager = userManager;
            _logger = logger;
            _configuration = configuration;
        }



        [HttpPost ("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {

            var user = await _userManager.FindByEmailAsync(model.Email);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if(user == null)
            {
                return BadRequest(new { Message = "Invalid email or password" });
            }

            var result = await _signInManager.PasswordSignInAsync(user,
                
                model.Password,
                
                model.RememberMe,
                false);

            if (result.Succeeded)
            {

                _logger.LogInformation("User logged in.");
                var token = await GenerateJwtToken(user); 
                return Ok(new { token });
                
            }

            else
            {
                return BadRequest(new { Message = "Invalid login attempt" });
            }
        }


        private async Task<string> GenerateJwtToken(UniversityUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            // Kullanıcı rollerini ekle
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JWT:ExpireMinutes"] ?? "60"));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
