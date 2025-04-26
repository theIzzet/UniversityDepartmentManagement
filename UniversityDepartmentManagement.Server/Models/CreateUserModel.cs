namespace UniversityDepartmentManagement.Server.Models
{
    public class CreateUserModel
    {
        public string Name { get; set; } = string.Empty;
        public string SurName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int SicilNo { get; set; }
        public string Role { get; set; } = string.Empty;

    }
}
