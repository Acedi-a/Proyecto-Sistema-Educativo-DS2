using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EscuelaAPI.Migrations
{
    /// <inheritdoc />
    public partial class asistencia_correcta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Asistencia",
                columns: table => new
                {
                    idAsistencia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    estado = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    idEstudiante = table.Column<int>(type: "int", nullable: false),
                    idHorario = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Asistencia", x => x.idAsistencia);
                    table.ForeignKey(
                        name: "FK_Asistencia_Estudiante_idEstudiante",
                        column: x => x.idEstudiante,
                        principalTable: "Estudiante",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Asistencia_Horario_idHorario",
                        column: x => x.idHorario,
                        principalTable: "Horario",
                        principalColumn: "idHorario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Asistencia_idEstudiante",
                table: "Asistencia",
                column: "idEstudiante");

            migrationBuilder.CreateIndex(
                name: "IX_Asistencia_idHorario",
                table: "Asistencia",
                column: "idHorario");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Asistencia");
        }
    }
}
