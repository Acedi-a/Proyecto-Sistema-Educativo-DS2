using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EscuelaAPI.Migrations
{
    /// <inheritdoc />
    public partial class certificadi_correcto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Certificado",
                columns: table => new
                {
                    idCertificado = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fechaEmision = table.Column<DateTime>(type: "datetime2", nullable: false),
                    contenido = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idEstudiante = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certificado", x => x.idCertificado);
                    table.ForeignKey(
                        name: "FK_Certificado_Estudiante_idEstudiante",
                        column: x => x.idEstudiante,
                        principalTable: "Estudiante",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Certificado_idEstudiante",
                table: "Certificado",
                column: "idEstudiante");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Certificado");
        }
    }
}
