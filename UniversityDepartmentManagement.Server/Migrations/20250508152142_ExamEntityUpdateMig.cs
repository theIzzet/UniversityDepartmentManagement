using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniversityDepartmentManagement.Server.Migrations
{
    /// <inheritdoc />
    public partial class ExamEntityUpdateMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exam_AspNetUsers_SupervisorId",
                table: "Exam");

            migrationBuilder.DropForeignKey(
                name: "FK_Exam_Classrooms_ClassroomId",
                table: "Exam");

            migrationBuilder.DropForeignKey(
                name: "FK_Exam_Lectures_LectureId",
                table: "Exam");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Exam",
                table: "Exam");

            migrationBuilder.RenameTable(
                name: "Exam",
                newName: "Exams");

            migrationBuilder.RenameIndex(
                name: "IX_Exam_SupervisorId",
                table: "Exams",
                newName: "IX_Exams_SupervisorId");

            migrationBuilder.RenameIndex(
                name: "IX_Exam_LectureId",
                table: "Exams",
                newName: "IX_Exams_LectureId");

            migrationBuilder.RenameIndex(
                name: "IX_Exam_ClassroomId",
                table: "Exams",
                newName: "IX_Exams_ClassroomId");

            migrationBuilder.AddColumn<int>(
                name: "Grade",
                table: "Exams",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Semester",
                table: "Exams",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Exams",
                table: "Exams",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_AspNetUsers_SupervisorId",
                table: "Exams",
                column: "SupervisorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Classrooms_ClassroomId",
                table: "Exams",
                column: "ClassroomId",
                principalTable: "Classrooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Exams_Lectures_LectureId",
                table: "Exams",
                column: "LectureId",
                principalTable: "Lectures",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exams_AspNetUsers_SupervisorId",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Classrooms_ClassroomId",
                table: "Exams");

            migrationBuilder.DropForeignKey(
                name: "FK_Exams_Lectures_LectureId",
                table: "Exams");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Exams",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "Grade",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "Semester",
                table: "Exams");

            migrationBuilder.RenameTable(
                name: "Exams",
                newName: "Exam");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_SupervisorId",
                table: "Exam",
                newName: "IX_Exam_SupervisorId");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_LectureId",
                table: "Exam",
                newName: "IX_Exam_LectureId");

            migrationBuilder.RenameIndex(
                name: "IX_Exams_ClassroomId",
                table: "Exam",
                newName: "IX_Exam_ClassroomId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Exam",
                table: "Exam",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Exam_AspNetUsers_SupervisorId",
                table: "Exam",
                column: "SupervisorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Exam_Classrooms_ClassroomId",
                table: "Exam",
                column: "ClassroomId",
                principalTable: "Classrooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Exam_Lectures_LectureId",
                table: "Exam",
                column: "LectureId",
                principalTable: "Lectures",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
