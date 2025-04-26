using System.ComponentModel.DataAnnotations;

namespace UniversityDepartmentManagement.Server.Models
{
    public class LoginModel
    {
        [EmailAddress]
        public string Email { get; set; } = null!;

        [DataType(DataType.Password)]
        public string Password { get; set; } = null!;

        public bool RememberMe { get; set; } = true;
    }
}
