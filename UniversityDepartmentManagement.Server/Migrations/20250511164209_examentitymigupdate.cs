using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniversityDepartmentManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class examentitymigupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "ExamDate",
                table: "Exams",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "TEXT");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "ExamDate",
                table: "Exams",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "date");
        }
    }
}
