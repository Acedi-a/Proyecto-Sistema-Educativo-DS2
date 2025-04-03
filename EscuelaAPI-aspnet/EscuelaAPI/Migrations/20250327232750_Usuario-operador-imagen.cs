using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EscuelaAPI.Migrations
{
    /// <inheritdoc />
    public partial class Usuariooperadorimagen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "imagenData",
                table: "Usuarios",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.CreateTable(
                name: "Operador",
                columns: table => new
                {
                    idUsuario = table.Column<int>(type: "int", nullable: false),
                    turnoLaboral = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Operador", x => x.idUsuario);
                    table.ForeignKey(
                        name: "FK_Operador_Usuarios_idUsuario",
                        column: x => x.idUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "idUsuario",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Operador");

            migrationBuilder.DropColumn(
                name: "imagenData",
                table: "Usuarios");
        }
    }
}
