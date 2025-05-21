using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using UniversityDepartmentManagement.Server.Data;

namespace UniversityDepartmentManagement.Server.Entities
{

    public class Lecture
    {
       
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        
        public string LectureCode { get; set; } = string.Empty;

        public string Language { get; set; } = string.Empty;
        public int StudentNumber { get; set; }

        [ForeignKey(nameof(Classroom))]
        public int ClassroomId { get; set; }
       


        [ForeignKey(nameof(User))]
        public string InstructorId { get; set; }

        public Classroom Classroom { get; set; }
        public UniversityUser User { get; set; }


        public ICollection<LectureSchedule> Schedules { get; set; } = new List<LectureSchedule>();

        public ICollection<Exam> Exam { get; set; } = new List<Exam>();
    }
}
