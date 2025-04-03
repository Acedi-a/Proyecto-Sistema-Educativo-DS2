using EscuelaAPI.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EscuelaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MateriaController : ControllerBase
    {

        private readonly DbConexion dbconexion;

        public MateriaController(DbConexion _db)
        {
            dbconexion = _db;
        }
        [HttpGet("listar")]
        public async Task<IActionResult> ListarMaterias()
        {
            var materias = await dbconexion.Materia
                .Select(m => new {
                    m.idMateria,
                    m.nombreMateria,
                    m.descripcion
                }).ToListAsync();

            return Ok(materias);
        }


    }
}
