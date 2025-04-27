using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityDepartmentManagement.Server.Entities
{
    public class LectureSchedule
    {
        
        public int Id { get; set; }

        [ForeignKey(nameof(Lecture))]
        public int LectureId { get; set; }
        

        public DayOfWeek Day { get; set; } 

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        //public int Grade { get; set; }

        //public Semester Semester { get; set; }

        [Required]
        [Range(1, 4)]
        public int Grade { get; set; }

        [Required]
        public string Semester { get; set; } = string.Empty;
        public Lecture Lecture { get; set; }



    }

  

}
