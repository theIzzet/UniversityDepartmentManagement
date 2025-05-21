using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using UniversityDepartmentManagement.Server.Data;

namespace UniversityDepartmentManagement.Server.Entities
{
    public class Exam
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Lecture))]
        public int LectureId { get; set; }

        public Lecture Lecture { get; set; }

        [ForeignKey(nameof(User))]
        public string SupervisorId { get; set; } = string.Empty;

        public UniversityUser User { get; set; }

        [ForeignKey(nameof(Classroom))]
        public int ClassroomId { get; set; }

        public Classroom Classroom { get; set; }

        [Column(TypeName = "date")]
        public DateTime ExamDate { get; set; }

        public TimeSpan StartTime { get; set; }


        public TimeSpan EndTime { get; set; }

        [Range(1, 4)]
        public int Grade { get; set; }

        [Required]
        public string Semester { get; set; } = string.Empty;

        public ICollection<Comment> Comments { get; set; }= new List<Comment>();
    }
}
