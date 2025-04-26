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
        public Lecture Lecture { get; set; }
    }

}
