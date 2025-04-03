using EscuelaAPI.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EscuelaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CursoController : ControllerBase
    {
        private readonly DbConexion dbconexion;

        public CursoController(DbConexion dc)
        {
            dbconexion = dc;
        }

        [HttpGet("listar")]
        public async Task<IActionResult> ListarCursos()
        {
            var cursos = await dbconexion.cursos
                .Select(c => new {
                    c.idCurso,
                    c.nombreCurso,
                    c.turno

                }).ToListAsync();

            return Ok(cursos);
        }

    }
}
