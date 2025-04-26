using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace UniversityDepartmentManagement.Server.Data
{
    public static class DataSeeder
    {
        public static async Task SeedRoles(RoleManager<UniversityRole> roleManager)
        {
            string[] roles = { "Chair", "Instructor", "Department Secretary" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new UniversityRole { Name = role });
                }
            }


        }

        public static async Task SeedUsers(UserManager<UniversityUser> userManager, RoleManager<UniversityRole> roleManager)
        {
            
            var deanUser = new UniversityUser
            {
                UserName = "dean@university.edu.tr",
                Email = "dean@university.edu.tr",
                Name = "Ahmet",
                SurName = "Yılmaz",
                SicilNo = 1001,
                AddedTime = DateTime.Now,

                

            };

            if (await userManager.FindByEmailAsync(deanUser.Email) == null)
            {
                var result = await userManager.CreateAsync(deanUser, "DeanPassword123!");
                if (result.Succeeded)
                {
                    // Rolün var olduğundan emin ol
                    if (await roleManager.RoleExistsAsync("Chair"))
                    {
                        await userManager.AddToRoleAsync(deanUser, "Chair");
                    }
                }
                else
                {
                    // Hataları logla
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    Console.WriteLine($"Kullanıcı oluşturma hatası: {errors}");
                }
            }

           
            var secretaryUser = new UniversityUser
            {
                UserName = "secretary@university.edu.tr",
                Email = "secretary@university.edu.tr",
                Name = "Ayşe",
                SurName = "Demir",
                SicilNo = 1002,
                AddedTime = DateTime.Now,
                

            };

            if (await userManager.FindByEmailAsync(secretaryUser.Email) == null)
            {
                var result = await userManager.CreateAsync(secretaryUser, "SecretaryPassword123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(secretaryUser, "Department Secretary");
                }
            }

           
            var facultyUser = new UniversityUser
            {
                UserName = "faculty@university.edu.tr",
                Email = "faculty@university.edu.tr",
                Name = "Mehmet",
                SurName = "Kaya",
                SicilNo = 1003,
                AddedTime = DateTime.Now,
                
            };

            if (await userManager.FindByEmailAsync(facultyUser.Email) == null)
            {
                var result = await userManager.CreateAsync(facultyUser, "FacultyPassword123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(facultyUser, "Instructor");
                }
            }
        }

    }
}
