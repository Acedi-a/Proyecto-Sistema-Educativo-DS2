using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EscuelaAPI.Migrations
{
    /// <inheritdoc />
    public partial class Pago_correcto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pago",
                columns: table => new
                {
                    idPago = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    monto = table.Column<float>(type: "real", nullable: false),
                    estado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idEstudiante = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pago", x => x.idPago);
                    table.ForeignKey(
                        name: "FK_Pago_Estudiante_idEstudiante",
                        column: x => x.idEstudiante,
                        principalTable: "Estudiante",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pago_idEstudiante",
                table: "Pago",
                column: "idEstudiante");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pago");
        }
    }
}
