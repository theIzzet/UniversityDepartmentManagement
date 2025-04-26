using System.ComponentModel.DataAnnotations;

namespace UniversityDepartmentManagement.Server.Models
{
    public class LectureModel
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public string LectureCode { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Language { get; set; } = string.Empty;

        [Required]
        public int StudentNumber { get; set; }
        [Required]
        public int ClassroomId { get; set; }

        [Required]
        public string InstructorId { get; set; }
    }



    
}
