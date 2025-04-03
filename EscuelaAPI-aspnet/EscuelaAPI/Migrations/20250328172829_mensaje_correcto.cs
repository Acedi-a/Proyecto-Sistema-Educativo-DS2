using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EscuelaAPI.Migrations
{
    /// <inheritdoc />
    public partial class mensaje_correcto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Mensaje",
                columns: table => new
                {
                    IdMensaje = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Asunto = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Reunion = table.Column<bool>(type: "bit", nullable: false),
                    ContenidoMensaje = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IdEstudiante = table.Column<int>(type: "int", nullable: false),
                    IdDocente = table.Column<int>(type: "int", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mensaje", x => x.IdMensaje);
                    table.ForeignKey(
                        name: "FK_Mensaje_Docente_IdDocente",
                        column: x => x.IdDocente,
                        principalTable: "Docente",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Mensaje_Estudiante_IdEstudiante",
                        column: x => x.IdEstudiante,
                        principalTable: "Estudiante",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Mensaje_IdDocente",
                table: "Mensaje",
                column: "IdDocente");

            migrationBuilder.CreateIndex(
                name: "IX_Mensaje_IdEstudiante",
                table: "Mensaje",
                column: "IdEstudiante");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Mensaje");
        }
    }
}
