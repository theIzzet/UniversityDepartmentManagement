namespace UniversityDepartmentManagement.Server.Entities
{
    public class Classroom
    {

        public int Id { get; set; }


        public string Name { get; set; } = string.Empty;

        public int Capacity { get; set; }
        public int Columns { get; set; } = 1;
        public int SeatsPerColumn { get; set; } = 1;

        public ICollection<Lecture>? Lectures { get; set; } = new List<Lecture>();
        public ICollection<Exam> Exam { get; set; }= new List<Exam>();
    }
}


