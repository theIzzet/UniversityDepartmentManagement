namespace UniversityDepartmentManagement.Server.Models
{
    public class UpdateUserModel
    {
        public string Name { get; set; } = string.Empty;
        public string SurName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int SicilNo { get; set; }
    }
}
