namespace UniversityDepartmentManagement.Server.Models
{
    public class LectureScheduleModel
    {
        public int LectureId { get; set; }
        public DayOfWeek Day { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
