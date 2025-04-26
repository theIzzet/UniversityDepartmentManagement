using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UniversityDepartmentManagement.Server.Entities;

namespace UniversityDepartmentManagement.Server.Data
{
    public class DataApplicationContext : IdentityDbContext<UniversityUser,UniversityRole,string>
    {

        public DataApplicationContext(DbContextOptions<DataApplicationContext> options) : base(options)
        {

        }

        public DbSet<Classroom> Classrooms => Set<Classroom>();

        public DbSet<Lecture> Lectures => Set<Lecture>();

        public DbSet<LectureSchedule> LectureSchedules => Set<LectureSchedule>();


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UniversityUser>()
                .HasIndex(u => u.SicilNo)
                .IsUnique(true);

            builder.Entity<Classroom>().HasIndex(u =>u.Name).IsUnique(true);
            builder.Entity<Lecture>().HasIndex(u => u.Name).IsUnique(true);
            builder.Entity<Lecture>().HasIndex(u => u.LectureCode).IsUnique(true);
        }
    }
}
