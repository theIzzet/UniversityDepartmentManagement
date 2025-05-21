using System.ComponentModel.DataAnnotations.Schema;
using UniversityDepartmentManagement.Server.Data;

namespace UniversityDepartmentManagement.Server.Entities
{
    public class Comment
    {
        public int Id { get; set; }

        [ForeignKey(nameof(User))]
        public string InstructorId { get; set; } = string.Empty;

        public UniversityUser User { get; set; }
        public string Content { get; set; }=string.Empty;

        [ForeignKey(nameof(Exam))]
        public int ExamId { get; set; }
        public Exam Exam { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
