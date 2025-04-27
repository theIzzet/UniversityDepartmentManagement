using UniversityDepartmentManagement.Server.Data;

namespace UniversityDepartmentManagement.Server.Models
{
    public class LectureList
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Language { get; set; }
        public int StudentNumber { get; set; }
        public int ClassroomId { get; set; }
        public string? LectureCode { get; set; }
        public string? InstructorId { get; set; }

        public string? InstructorName { get; set; }
        public ClassroomModel Classroom { get; set; }
        //public UniversityUser User { get; set; }

        //public List<ScheduleDto> Schedules { get; set; }
    }
}
