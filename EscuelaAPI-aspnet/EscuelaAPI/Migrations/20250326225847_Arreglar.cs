using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EscuelaAPI.Migrations
{
    /// <inheritdoc />
    public partial class Arreglar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuario_cursos_idCurso",
                table: "Usuario");

            migrationBuilder.DropPrimaryKey(
                name: "PK_cursos",
                table: "cursos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Usuario",
                table: "Usuario");

            migrationBuilder.DropIndex(
                name: "IX_Usuario_idCurso",
                table: "Usuario");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Usuario");

            migrationBuilder.DropColumn(
                name: "idCurso",
                table: "Usuario");

            migrationBuilder.DropColumn(
                name: "tutor",
                table: "Usuario");

            migrationBuilder.RenameTable(
                name: "cursos",
                newName: "Cursos");

            migrationBuilder.RenameTable(
                name: "Usuario",
                newName: "Usuarios");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Cursos",
                table: "Cursos",
                column: "idCurso");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Usuarios",
                table: "Usuarios",
                column: "idUsuario");

            migrationBuilder.CreateTable(
                name: "Docentes",
                columns: table => new
                {
                    idUsuario = table.Column<int>(type: "int", nullable: false),
                    especialidad = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Docentes", x => x.idUsuario);
                    table.ForeignKey(
                        name: "FK_Docentes_Usuarios_idUsuario",
                        column: x => x.idUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Estudiantes",
                columns: table => new
                {
                    idUsuario = table.Column<int>(type: "int", nullable: false),
                    tutor = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    idCurso = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estudiantes", x => x.idUsuario);
                    table.ForeignKey(
                        name: "FK_Estudiantes_Cursos_idCurso",
                        column: x => x.idCurso,
                        principalTable: "Cursos",
                        principalColumn: "idCurso",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Estudiantes_Usuarios_idUsuario",
                        column: x => x.idUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Estudiantes_idCurso",
                table: "Estudiantes",
                column: "idCurso");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Docentes");

            migrationBuilder.DropTable(
                name: "Estudiantes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Cursos",
                table: "Cursos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Usuarios",
                table: "Usuarios");

            migrationBuilder.RenameTable(
                name: "Cursos",
                newName: "cursos");

            migrationBuilder.RenameTable(
                name: "Usuarios",
                newName: "Usuario");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Usuario",
                type: "nvarchar(13)",
                maxLength: 13,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "idCurso",
                table: "Usuario",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "tutor",
                table: "Usuario",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_cursos",
                table: "cursos",
                column: "idCurso");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Usuario",
                table: "Usuario",
                column: "idUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_idCurso",
                table: "Usuario",
                column: "idCurso");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuario_cursos_idCurso",
                table: "Usuario",
                column: "idCurso",
                principalTable: "cursos",
                principalColumn: "idCurso",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
