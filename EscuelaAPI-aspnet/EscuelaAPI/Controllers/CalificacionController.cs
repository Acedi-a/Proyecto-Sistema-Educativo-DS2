using EscuelaAPI.Modelo;
using EscuelaAPI.Modelo.DTOs    ;

using EscuelaAPI.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EscuelaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalificacionController : ControllerBase
    {
        private readonly DbConexion dbconexion;
        
        public CalificacionController(DbConexion _db)
        {
            dbconexion = _db;
        }
        
        [HttpGet("{estudianteId}")]
        public async Task<ActionResult<List<Calificacion>>> GetCalificaciones(int estudianteId)
        {
            var estudianteExiste = await dbconexion.Estudiantes.AnyAsync(e => e.idUsuario == estudianteId); 
            if (!estudianteExiste)
            {
                return NotFound($"No se encontró el estudiante con ID: {estudianteId}");
            }
            
            var calificaciones = await dbconexion.Calificacion
                .Where(c => c.IdEstudiante == estudianteId)
                .Include(c => c.materia) 
                .ToListAsync();

            if (calificaciones == null || !calificaciones.Any())
            {
                return Ok(new List<Calificacion>());
            }
            
            return Ok(calificaciones);
        }
        [HttpGet("materias/{idDocente}")]
        public async Task<ActionResult<IEnumerable<Materia>>> GetMateriasPorDocente(int idDocente)
        {
            var materias = await dbconexion.Horario
                .Where(h => h.idDocente == idDocente)
                .Include(h => h.materia)
                .Select(h => h.materia)
                .Distinct()
                .ToListAsync();

            if (materias == null || !materias.Any())
            {
                return NotFound("No se encontraron materias para este docente");
            }

            return Ok(materias);
        }


        // GET: api/Estudiantes/por-docente-materia?docenteId=3&materiaId=6
        [HttpGet("listarEstudiantes/{docenteId}/{materiaId}")]
        public async Task<ActionResult<List<EstudiantePorMateriaDTO>>> GetEstudiantesPorDocenteYMateria(
            int docenteId, int materiaId)
        {
            var resultado = await dbconexion.Horario
                .Where(h => h.idDocente == docenteId && h.idMateria == materiaId)
                .Include(h => h.curso)
                .ThenInclude(c => c.Estudiantes)
                .Include(h => h.materia)
                .SelectMany(h => h.curso.Estudiantes.Select(e => new EstudiantePorMateriaDTO
                {
                    IdUsuario = e.idUsuario,
                    Nombre = dbconexion.Usuario
                        .FirstOrDefault(u => u.idUsuario == e.idUsuario)!.nombre,
                    Apellido = dbconexion.Usuario
                        .FirstOrDefault(u => u.idUsuario == e.idUsuario)!.apellido,
                    IdCurso = h.curso.idCurso,
                    NombreCurso = h.curso.nombreCurso,
                    IdMateria = h.materia.idMateria,
                    NombreMateria = h.materia.nombreMateria
                }))
                .Distinct()
                .ToListAsync();

            if (!resultado.Any())
                return NotFound("No se encontraron estudiantes para el docente y materia especificados");

            return Ok(resultado);
        }

        [HttpPost("Registrar")]
        public async Task<ActionResult<Calificacion>> RegistrarCalificacion([FromBody] Calificacion calificacion)
        {
            try
            {
                if (await dbconexion.Estudiantes.FindAsync(calificacion.IdEstudiante) == null)
                {
                    return NotFound($"No se encontr贸 el estudiante con ID: {calificacion.IdEstudiante}");
                }
                if (await dbconexion.Materia.FindAsync(calificacion.idMateria) == null)
                {
                    return NotFound($"No se encontr贸 la materia con ID: {calificacion.idMateria}");
                }
                if (await dbconexion.cursos.FindAsync(calificacion.IdCurso) == null)
                {
                    return NotFound($"No se encontr贸 el curso con ID: {calificacion.IdCurso}");
                }

                dbconexion.Calificacion.Add(calificacion);
                await dbconexion.SaveChangesAsync();
                return Ok(calificacion);
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e);
                throw;
            }

        }
    }
}

