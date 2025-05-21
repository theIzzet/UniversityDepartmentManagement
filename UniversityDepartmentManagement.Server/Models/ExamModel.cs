using System.ComponentModel.DataAnnotations;

namespace UniversityDepartmentManagement.Server.Models
{
    public class ExamModel
    {
        public int Id { get; set; }

        public int LectureId { get; set; }

        public string SupervisorId { get; set; } = string.Empty;

        public int ClassroomId { get; set; }

        public int StudentNumber { get; set; }

        [Required]
        [Range(1, 4)]
        public int Grade { get; set; }

        [Required]
        public string Semester { get; set; } = string.Empty;

        public DateTime ExamDate { get; set; }

        public string StartTimeString { get; set; } = string.Empty; // Frontend'den gelen string zaman

        
        public string EndTimeString { get; set; } = string.Empty; // Frontend'den gelen string z
        public TimeSpan StartTime => TimeSpan.Parse(StartTimeString);
        public TimeSpan EndTime => TimeSpan.Parse(EndTimeString);
    }
}
