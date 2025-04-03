using EscuelaAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EscuelaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocenteController : ControllerBase
    {
        private readonly DbConexion dbconexion;

        public DocenteController(DbConexion dc)
        {
            dbconexion = dc;
        }


        [HttpGet]
        [Route("listarDocente")]
        public async Task<IActionResult> listarDocentes()
        {
            var docentes = await dbconexion.Docente.Select(
                d => new
                {
                    d.idUsuario,
                    d.apellido,
                    d.nombreUsuario,
                    d.nombre,
                    d.rol,
                    d.correo,
                    d.telefono,
                    d.especialidad
                }).ToListAsync();


            return Ok(docentes);
        }


    }
}
