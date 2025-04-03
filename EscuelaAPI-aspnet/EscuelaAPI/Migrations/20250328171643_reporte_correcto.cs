using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EscuelaAPI.Migrations
{
    /// <inheritdoc />
    public partial class reporte_correcto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "nombre",
                table: "Usuario",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "correo",
                table: "Usuario",
                type: "nvarchar(40)",
                maxLength: 40,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "apellido",
                table: "Usuario",
                type: "nvarchar(40)",
                maxLength: 40,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateTable(
                name: "Reporte",
                columns: table => new
                {
                    idReporte = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tipoReporte = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    contenido = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idDocente = table.Column<int>(type: "int", nullable: false),
                    idEstudiante = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reporte", x => x.idReporte);
                    table.ForeignKey(
                        name: "FK_Reporte_Docente_idDocente",
                        column: x => x.idDocente,
                        principalTable: "Docente",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reporte_Estudiante_idEstudiante",
                        column: x => x.idEstudiante,
                        principalTable: "Estudiante",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reporte_idDocente",
                table: "Reporte",
                column: "idDocente");

            migrationBuilder.CreateIndex(
                name: "IX_Reporte_idEstudiante",
                table: "Reporte",
                column: "idEstudiante");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reporte");

            migrationBuilder.AlterColumn<string>(
                name: "nombre",
                table: "Usuario",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(30)",
                oldMaxLength: 30);

            migrationBuilder.AlterColumn<string>(
                name: "correo",
                table: "Usuario",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(40)",
                oldMaxLength: 40);

            migrationBuilder.AlterColumn<string>(
                name: "apellido",
                table: "Usuario",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(40)",
                oldMaxLength: 40);
        }
    }
}
