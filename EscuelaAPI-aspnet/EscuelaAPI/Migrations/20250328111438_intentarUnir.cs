using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EscuelaAPI.Migrations
{
    /// <inheritdoc />
    public partial class intentarUnir : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Materia",
                columns: table => new
                {
                    idMateria = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombreMateria = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Materia", x => x.idMateria);
                });

            migrationBuilder.CreateTable(
                name: "Horario",
                columns: table => new
                {
                    idHorario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    diaSemana = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    horaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    horaFin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idCurso = table.Column<int>(type: "int", nullable: false),
                    idDocente = table.Column<int>(type: "int", nullable: false),
                    idMateria = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Horario", x => x.idHorario);
                    table.ForeignKey(
                        name: "FK_Horario_Curso_idCurso",
                        column: x => x.idCurso,
                        principalTable: "Curso",
                        principalColumn: "idCurso",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Horario_Docente_idDocente",
                        column: x => x.idDocente,
                        principalTable: "Docente",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Horario_Materia_idMateria",
                        column: x => x.idMateria,
                        principalTable: "Materia",
                        principalColumn: "idMateria",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Horario_idCurso",
                table: "Horario",
                column: "idCurso");

            migrationBuilder.CreateIndex(
                name: "IX_Horario_idDocente",
                table: "Horario",
                column: "idDocente");

            migrationBuilder.CreateIndex(
                name: "IX_Horario_idMateria",
                table: "Horario",
                column: "idMateria");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Horario");

            migrationBuilder.DropTable(
                name: "Materia");
        }
    }
}
