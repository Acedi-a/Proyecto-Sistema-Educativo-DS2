using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EscuelaAPI.Migrations
{
    /// <inheritdoc />
    public partial class calificacion_correcta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Calificacion",
                columns: table => new
                {
                    IdCalificacion = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nota = table.Column<int>(type: "int", nullable: false),
                    Comentarios = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdEstudiante = table.Column<int>(type: "int", nullable: false),
                    IdCurso = table.Column<int>(type: "int", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idMateria = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Calificacion", x => x.IdCalificacion);
                    table.ForeignKey(
                        name: "FK_Calificacion_Curso_IdCurso",
                        column: x => x.IdCurso,
                        principalTable: "Curso",
                        principalColumn: "idCurso",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Calificacion_Estudiante_IdEstudiante",
                        column: x => x.IdEstudiante,
                        principalTable: "Estudiante",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Calificacion_Materia_idMateria",
                        column: x => x.idMateria,
                        principalTable: "Materia",
                        principalColumn: "idMateria",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Calificacion_IdCurso",
                table: "Calificacion",
                column: "IdCurso");

            migrationBuilder.CreateIndex(
                name: "IX_Calificacion_IdEstudiante",
                table: "Calificacion",
                column: "IdEstudiante");

            migrationBuilder.CreateIndex(
                name: "IX_Calificacion_idMateria",
                table: "Calificacion",
                column: "idMateria");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Calificacion");
        }
    }
}
