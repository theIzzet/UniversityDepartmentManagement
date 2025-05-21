using Microsoft.AspNetCore.Identity;
using UniversityDepartmentManagement.Server.Entities;

namespace UniversityDepartmentManagement.Server.Data

{
    public class UniversityUser: IdentityUser
    {
        
        public string Name { get; set; } = string.Empty;

        public string SurName { get; set; } = string.Empty;

        public int SicilNo { get; set; }
        public DateTime AddedTime { get; set; }

        public ICollection<Lecture> Lectures { get; set; } = new List<Lecture>();

        public ICollection<Exam> Exam { get; set; } = new List<Exam>();

        public ICollection<Comment> Comments { get; set; }= new List<Comment>();
    }
}
