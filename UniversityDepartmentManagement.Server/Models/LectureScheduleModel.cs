using System.ComponentModel.DataAnnotations;
using UniversityDepartmentManagement.Server.Entities;

namespace UniversityDepartmentManagement.Server.Models
{
    public class LectureScheduleModel
    {
        public int LectureId { get; set; }
        public DayOfWeek Day { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public int Grade { get; set; }

        public string Semester { get; set; } = string.Empty;


    }
}
