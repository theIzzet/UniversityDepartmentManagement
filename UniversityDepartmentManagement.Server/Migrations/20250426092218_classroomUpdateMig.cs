using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniversityDepartmentManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class classroomUpdateMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Columns",
                table: "Classrooms",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SeatsPerColumn",
                table: "Classrooms",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Columns",
                table: "Classrooms");

            migrationBuilder.DropColumn(
                name: "SeatsPerColumn",
                table: "Classrooms");
        }
    }
}
