using EscuelaAPI.Data;
using EscuelaAPI.Modelo;
using EscuelaAPI.Modelo.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EscuelaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HorarioController : ControllerBase
    {
        private readonly DbConexion dbconex;

        public HorarioController(DbConexion dbconexion)
        {
            dbconex = dbconexion;

        }


        [HttpPost]
        [Route("designarHorario")]
        public async Task<ActionResult<Horario>> designar([FromBody] Horario h)
        {
            dbconex.Horario.Add(h);
            await dbconex.SaveChangesAsync();
            return Ok("Guardado");
        }

        [HttpGet]
        [Route("listarHorarios")]
        public async Task<IActionResult> listarHorarioo()
        {
            var horarios = await dbconex.Horario
                .Include(h => h.docente)      // Asume que Horario tiene una propiedad de navegación "Docente"
                .Include(h => h.materia)      // Asume que Horario tiene una propiedad de navegación "Materia"
                .Include(h => h.curso)         // Asume que Horario tiene una propiedad de navegación "Curso"
                .Select(h => new
                {
                    IdHorario = h.idHorario,
                    DiaSemana = h.diaSemana,
                    HoraInicio = h.horaInicio,
                    HoraFin = h.horaFin,
                    Docente = h.docente.nombre, // Asume que Docente tiene una propiedad "Nombre"
                    Materia = h.materia.nombreMateria, // Asume que Materia tiene una propiedad "Nombre"
                    Curso = h.curso.nombreCurso      // Asume que Curso tiene una propiedad "Nombre"
                })
                .ToListAsync();

            return Ok(horarios);
        }
        [HttpPut]
        [Route("editarHorario/{idHorario}")]
        public async Task<IActionResult> editarHorario(int idHorario, [FromBody] Horario h)
        {
            var horarioExistente = await dbconex.Horario.FindAsync(idHorario);
            if (horarioExistente == null)
            {
                return NotFound($"Horario con ID {idHorario} no encontrado.");
            }
            horarioExistente.diaSemana = h.diaSemana;
            horarioExistente.horaInicio = h.horaInicio;
            horarioExistente.horaFin = h.horaFin;
            horarioExistente.idDocente = h.idDocente;
            horarioExistente.idMateria = h.idMateria;
            horarioExistente.idCurso = h.idCurso;
            await dbconex.SaveChangesAsync();

            return Ok("Horario actualizado correctamente.");
        }

        [HttpGet]
        [Route("ObtenerHorario/{id}")]
        public async Task<IActionResult> ObtenerHorario(int id)
        {
            try
            {
                var  horario =  await dbconex.Horario
                    .Where(d => d.idHorario == id)
                    .Select(d => new
                    {
                        d.diaSemana,
                        d.horaInicio,
                        d.horaFin,
                        d.idMateria,
                        d.idDocente,
                        d.idCurso
                    })
                    .FirstOrDefaultAsync();

                if (horario == null)
                {
                    return NotFound(new { success = false, message = "Docente no encontrado" });
                }

                return Ok(new { success = true, horario });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al obtener horario",
                    error = ex.Message
                });
            }
        }




        //PARTE UNIDA
        [HttpGet]
        [Route("academico/horario/{estudianteId}")]
        public async Task<ActionResult<List<HorarioDTO>>> GetHorarioEstudiante(int estudianteId)
        {
            // 1. Obtener el curso del estudiante
            var estudianteInfo = await dbconex.Estudiantes
                .Where(e => e.idUsuario == estudianteId)
                .Select(e => new { e.idCurso })
                .FirstOrDefaultAsync();

            if (estudianteInfo == null || estudianteInfo.idCurso <= 0)
            {
                return NotFound($"Estudiante con ID {estudianteId} no encontrado o sin curso asignado.");
            }

            int cursoId = estudianteInfo.idCurso;

            // 2. Obtener los horarios del curso y agruparlos por día
            var horarios = await dbconex.Horario
                .Where(h => h.idCurso == cursoId)
                .Include(h => h.materia)
                .Include(h => h.docente)
                .OrderBy(h => h.horaInicio)
                .Select(h => new
                {
                    h.diaSemana,
                    h.horaInicio,
                    h.horaFin,
                    NombreMateria = h.materia.nombreMateria ?? "Sin materia",
                    NombreDocente = h.docente != null ? $"{h.docente.nombre} {h.docente.apellido}" : "Sin docente"
                })
                .ToListAsync();

            // 3. Agrupar por día y ordenar días de la semana
            var horariosAgrupados = horarios
                .GroupBy(h => h.diaSemana)
                .Select(g => new HorarioDTO
                {
                    DiaSemana = g.Key,
                    Clases = g.Select(c => new ClaseDTO
                    {
                        HoraInicio = c.horaInicio.HasValue ? c.horaInicio.Value.TimeOfDay : TimeSpan.Zero,
                        HoraFin = c.horaFin.HasValue ? c.horaFin.Value.TimeOfDay : TimeSpan.Zero,
                        NombreMateria = c.NombreMateria,
                        NombreDocente = c.NombreDocente
                    }).OrderBy(c => c.HoraInicio).ToList()
                })
                .OrderBy(d => OrdenarDiasSemana(d.DiaSemana)) // Ordenar días (Lunes, Martes...)
                .ToList();

            return Ok(horariosAgrupados);
        }

        private int OrdenarDiasSemana(string dia)
        {
            switch (dia.ToLower())
            {
                case "lunes": return 1;
                case "martes": return 2;
                case "miércoles": return 3;
                case "jueves": return 4;
                case "viernes": return 5;
                default: return 6; // Otros días al final
            }
        }



    }
}
