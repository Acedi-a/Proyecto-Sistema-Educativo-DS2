using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EscuelaAPI.Migrations
{
    /// <inheritdoc />
    public partial class normalizar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Docentes_Usuarios_idUsuario",
                table: "Docentes");

            migrationBuilder.DropForeignKey(
                name: "FK_Estudiantes_Cursos_idCurso",
                table: "Estudiantes");

            migrationBuilder.DropForeignKey(
                name: "FK_Estudiantes_Usuarios_idUsuario",
                table: "Estudiantes");

            migrationBuilder.DropForeignKey(
                name: "FK_Operador_Usuarios_idUsuario",
                table: "Operador");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Usuarios",
                table: "Usuarios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Estudiantes",
                table: "Estudiantes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Docentes",
                table: "Docentes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Cursos",
                table: "Cursos");

            migrationBuilder.RenameTable(
                name: "Usuarios",
                newName: "Usuario");

            migrationBuilder.RenameTable(
                name: "Estudiantes",
                newName: "Estudiante");

            migrationBuilder.RenameTable(
                name: "Docentes",
                newName: "Docente");

            migrationBuilder.RenameTable(
                name: "Cursos",
                newName: "Curso");

            migrationBuilder.RenameIndex(
                name: "IX_Estudiantes_idCurso",
                table: "Estudiante",
                newName: "IX_Estudiante_idCurso");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Usuario",
                table: "Usuario",
                column: "idUsuario");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Estudiante",
                table: "Estudiante",
                column: "idUsuario");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Docente",
                table: "Docente",
                column: "idUsuario");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Curso",
                table: "Curso",
                column: "idCurso");

            migrationBuilder.AddForeignKey(
                name: "FK_Docente_Usuario_idUsuario",
                table: "Docente",
                column: "idUsuario",
                principalTable: "Usuario",
                principalColumn: "idUsuario",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estudiante_Curso_idCurso",
                table: "Estudiante",
                column: "idCurso",
                principalTable: "Curso",
                principalColumn: "idCurso",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estudiante_Usuario_idUsuario",
                table: "Estudiante",
                column: "idUsuario",
                principalTable: "Usuario",
                principalColumn: "idUsuario",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Operador_Usuario_idUsuario",
                table: "Operador",
                column: "idUsuario",
                principalTable: "Usuario",
                principalColumn: "idUsuario",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Docente_Usuario_idUsuario",
                table: "Docente");

            migrationBuilder.DropForeignKey(
                name: "FK_Estudiante_Curso_idCurso",
                table: "Estudiante");

            migrationBuilder.DropForeignKey(
                name: "FK_Estudiante_Usuario_idUsuario",
                table: "Estudiante");

            migrationBuilder.DropForeignKey(
                name: "FK_Operador_Usuario_idUsuario",
                table: "Operador");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Usuario",
                table: "Usuario");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Estudiante",
                table: "Estudiante");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Docente",
                table: "Docente");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Curso",
                table: "Curso");

            migrationBuilder.RenameTable(
                name: "Usuario",
                newName: "Usuarios");

            migrationBuilder.RenameTable(
                name: "Estudiante",
                newName: "Estudiantes");

            migrationBuilder.RenameTable(
                name: "Docente",
                newName: "Docentes");

            migrationBuilder.RenameTable(
                name: "Curso",
                newName: "Cursos");

            migrationBuilder.RenameIndex(
                name: "IX_Estudiante_idCurso",
                table: "Estudiantes",
                newName: "IX_Estudiantes_idCurso");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Usuarios",
                table: "Usuarios",
                column: "idUsuario");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Estudiantes",
                table: "Estudiantes",
                column: "idUsuario");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Docentes",
                table: "Docentes",
                column: "idUsuario");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Cursos",
                table: "Cursos",
                column: "idCurso");

            migrationBuilder.AddForeignKey(
                name: "FK_Docentes_Usuarios_idUsuario",
                table: "Docentes",
                column: "idUsuario",
                principalTable: "Usuarios",
                principalColumn: "idUsuario",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estudiantes_Cursos_idCurso",
                table: "Estudiantes",
                column: "idCurso",
                principalTable: "Cursos",
                principalColumn: "idCurso",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Estudiantes_Usuarios_idUsuario",
                table: "Estudiantes",
                column: "idUsuario",
                principalTable: "Usuarios",
                principalColumn: "idUsuario",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Operador_Usuarios_idUsuario",
                table: "Operador",
                column: "idUsuario",
                principalTable: "Usuarios",
                principalColumn: "idUsuario",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
