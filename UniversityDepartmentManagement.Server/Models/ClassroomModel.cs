namespace UniversityDepartmentManagement.Server.Models
{
    public class ClassroomModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int Columns { get; set; } = 1;
        public int SeatsPerColumn { get; set; } = 1;
        public int LectureCount { get; set; } 
        //public List<LectureDto>? Lectures { get; set; }
    }
}
