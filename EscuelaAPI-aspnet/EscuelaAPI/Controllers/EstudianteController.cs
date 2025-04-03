using EscuelaAPI.Data;
using EscuelaAPI.Modelo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EscuelaAPI.Controllers
{
    [Route("api/[controller]")]
    
    [ApiController]
    public class EstudianteController : ControllerBase
    {
      
           private readonly DbConexion dbconexion;

        public EstudianteController(DbConexion _db)
        {
            dbconexion = _db;
        }

        [HttpGet("listar")]
        public async Task<IActionResult> ListarEstudiantes()
        {
            var estudiantes = await dbconexion.Estudiantes.Include(c => c.Curso).
                Select(e => new
                {
                    e.idUsuario,
                    e.nombreUsuario,
                    e.nombre,
                    e.correo,
                    e.telefono,
                    e.ImagenPath,
                    cursoNombre = e.Curso.nombreCurso
                }).ToListAsync();


            return Ok(estudiantes);

        }


        [HttpGet]
        [Route("ObtenerE/{id}")]


        public async Task<IActionResult> obtenerEstudiante(int id)
        {
            var estudianteEncontrado = await dbconexion.Estudiantes
         .Include(e => e.Curso)
         .FirstOrDefaultAsync(x => x.idUsuario == id);

            if (estudianteEncontrado == null) return NotFound("No hay");
            return Ok(new
            {
                Estudiante = estudianteEncontrado
            });
        }


        [HttpGet("horarioPorEstudiante/{idEstudiante}")]
        public async Task<IActionResult> GetHorarioByEstudiante(int idEstudiante)
        {
            // 1. Obtener el idCurso del estudiante
            var estudiante = await dbconexion.Estudiantes
                .Include(e => e.Curso)
                .FirstOrDefaultAsync(e => e.idUsuario == idEstudiante);

            if (estudiante == null)
                return NotFound("Estudiante no encontrado");

            if (estudiante.idCurso == null)
                return BadRequest("El estudiante no tiene un curso asignado");

            // 2. Obtener los horarios asociados a ese idCurso
            var horarios = await dbconexion.Horario
                .Include(h => h.curso)
                .Include(h => h.docente)
                .Include(h => h.materia)
                .Where(h => h.idCurso == estudiante.idCurso)
                .Select(h => new
                {
                    Dia = h.diaSemana,
                    HoraInicio = h.horaInicio.ToString(),
                    HoraFin = h.horaFin.ToString(),
                    Materia = h.materia.nombreMateria,
                    Docente = h.docente.nombre
                })
                .ToListAsync();

            return Ok(new
            {
                Estudiante = estudiante.nombre,
                Curso = estudiante.Curso.nombreCurso,
                Horarios = horarios
            });
        }



    }
}
