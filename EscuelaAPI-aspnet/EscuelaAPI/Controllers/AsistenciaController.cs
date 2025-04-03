using EscuelaAPI.Modelo;
using EscuelaAPI.Data;
using EscuelaAPI.Modelo.DTOs;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EscuelaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AsistenciaController : ControllerBase
    {
        private readonly DbConexion dbconexion;
        
        public AsistenciaController(DbConexion _db)
        {
            dbconexion = _db;
        }
        
        [HttpGet("academico/asistencia/{estudianteId}")]
        public async Task<ActionResult<List<AsistenciaDTO>>> GetAsistenciaEstudiante(int estudianteId)
        {
            // Validar existencia del estudiante
            var estudianteExiste = await dbconexion.Estudiantes.AnyAsync(e => e.idUsuario == estudianteId);
            if (!estudianteExiste)
            {
                return NotFound($"Estudiante con ID {estudianteId} no encontrado.");
            }

            // Obtener asistencias con detalles
            var asistencias = await dbconexion.Asistencia
                .Where(a => a.idEstudiante == estudianteId)
                .Include(a => a.horario)
                .ThenInclude(h => h.materia)
                .Include(a => a.horario)
                .ThenInclude(h => h.docente)
                .OrderByDescending(a => a.fecha)
                .Select(a => new AsistenciaDTO()
                {
                    Fecha = a.fecha,
                    Estado = a.estado,
                    DiaSemana = a.horario.diaSemana, 
                    Materia = a.horario.materia.nombreMateria ?? "Sin materia",
                    Docente = a.horario.docente != null 
                        ? $"{a.horario.docente.nombre} {a.horario.docente.apellido}" 
                        : "Sin docente asignado",
                    HoraInicio = a.horario.horaInicio.HasValue ? a.horario.horaInicio.Value.TimeOfDay : TimeSpan.Zero,
                    HoraFin = a.horario.horaFin.HasValue ? a.horario.horaFin.Value.TimeOfDay : TimeSpan.Zero
                })
                .ToListAsync();

            return Ok(asistencias); // Devuelve lista vacía si no hay registros
        }
        
        
        
        
    }
}