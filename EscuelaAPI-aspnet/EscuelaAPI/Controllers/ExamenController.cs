using EscuelaAPI.Data;
using EscuelaAPI.Modelo;
using EscuelaAPI.Modelo.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EscuelaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamenController : ControllerBase
    {
        private readonly DbConexion dbconexion;

        public ExamenController(DbConexion dc)
        {
            dbconexion = dc;
        }


        [HttpGet]
        [Route("academico/examenes/{estudianteId}")]
        public async Task<ActionResult<List<ExamenDTO>>> GetExamenesByEstudiante(int estudianteId)
        {
            var estudiante = await dbconexion.Estudiantes
                .Where(e => e.idUsuario == estudianteId)
                .Select(e => new { e.idCurso })
                .FirstOrDefaultAsync();

            if (estudiante == null)
            {
                return NotFound($"Estudiante con ID {estudianteId} no encontrado.");
            }

            var examenes = await dbconexion.Examen
                .Include(e => e.Horario)
                .ThenInclude(h => h.materia)
                .Where(e => e.Horario.idCurso == estudiante.idCurso) 
                .OrderBy(e => e.fechaExamen) 
                .Select(e => new ExamenDTO
                {
                    FechaExamen = e.fechaExamen,
                    NombreMateria = e.Horario.materia.nombreMateria ?? "Sin nombre",
                    HoraInicio = e.Horario.horaInicio.HasValue ? e.Horario.horaInicio.Value.TimeOfDay : TimeSpan.Zero,  //CAMBIADO
                    HoraFin = e.Horario.horaFin.HasValue ? e.Horario.horaFin.Value.TimeOfDay : TimeSpan.Zero,
                    DiaSemana = e.Horario.diaSemana,
                    DiasRestantes = (int)(e.fechaExamen - DateTime.Today).TotalDays 

                })
                .ToListAsync();

            return Ok(examenes);
        }
        
        [HttpGet]
        [Route("academico/alertaexamen/{estudianteId}")]
        public async Task<ActionResult<ExamenDTO>> GetProximoExamen(int estudianteId)
        {
            // 1. Obtener el curso del estudiante
            var estudiante = await dbconexion.Estudiantes
                .Where(e => e.idUsuario == estudianteId)
                .Select(e => new { e.idCurso })
                .FirstOrDefaultAsync();

            if (estudiante == null)
            {
                return NotFound($"Estudiante con ID {estudianteId} no encontrado.");
            }

            var proximoExamen = await dbconexion.Examen
                .Include(e => e.Horario)
                .ThenInclude(h => h.materia)
                .Where(e => 
                        e.Horario.idCurso == estudiante.idCurso &&
                        e.fechaExamen >= DateTime.Today 
                )
                .OrderBy(e => e.fechaExamen) 
                .Select(e => new ExamenDTO
                {
                    FechaExamen = e.fechaExamen,
                    NombreMateria = e.Horario.materia.nombreMateria ?? "Sin nombre",
                   
                    HoraInicio = e.Horario.horaInicio.HasValue ? e.Horario.horaInicio.Value.TimeOfDay : TimeSpan.Zero,  //CAMBIADO
                    HoraFin = e.Horario.horaFin.HasValue ? e.Horario.horaFin.Value.TimeOfDay : TimeSpan.Zero,
                    DiasRestantes = (int)(e.fechaExamen - DateTime.Today).TotalDays 
                })
                .FirstOrDefaultAsync();

            if (proximoExamen == null)
            {
                return Ok(new { Message = "No hay exámenes próximos." });
            }

            return Ok(proximoExamen);
        }


    }
}