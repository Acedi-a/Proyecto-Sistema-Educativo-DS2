using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EscuelaAPI.Migrations
{
    /// <inheritdoc />
    public partial class examenTabla : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Examen",
                columns: table => new
                {
                    idExamen = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fechaExamen = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idHorario = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Examen", x => x.idExamen);
                    table.ForeignKey(
                        name: "FK_Examen_Horario_idHorario",
                        column: x => x.idHorario,
                        principalTable: "Horario",
                        principalColumn: "idHorario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Examen_idHorario",
                table: "Examen",
                column: "idHorario");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Examen");
        }
    }
}
