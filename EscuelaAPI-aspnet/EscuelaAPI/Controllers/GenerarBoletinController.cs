using EscuelaAPI.Data;
using EscuelaAPI.Modelo;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EscuelaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenerarBoletinController : ControllerBase
    {
        private readonly DbConexion _dbconexion;

        public GenerarBoletinController(DbConexion dbconexion)
        {
            _dbconexion = dbconexion;
        }

        [HttpGet("boletin/{idEstudiante}")]
        public async Task<IActionResult> GenerarBoletin(int idEstudiante)
        {
            var estudiante = await _dbconexion.Estudiantes
                .Include(e => e.Curso)
                .FirstOrDefaultAsync(e => e.idUsuario == idEstudiante);

            if (estudiante == null)
                return NotFound("Estudiante no encontrado");

            if (estudiante.idCurso == 0)
                return BadRequest("El estudiante no tiene curso asignado");

            // Obtener todas las materias del curso desde el horario
            var materiasDelCurso = await _dbconexion.Horario
                .Where(h => h.idCurso == estudiante.idCurso)
                .Include(h => h.materia)
                .Select(h => h.materia)
                .Distinct()
                .ToListAsync();

            // Obtener todas las calificaciones del estudiante en el curso
            var calificaciones = await _dbconexion.Calificacion
                .Where(c => c.IdEstudiante == idEstudiante && c.IdCurso == estudiante.idCurso)
                .ToListAsync();

            // Construir el boletín
            var boletin = materiasDelCurso.Select(materia => new
            {
                Materia = materia.nombreMateria,
                Descripcion = materia.descripcion,
                Calificaciones = calificaciones
                    .Where(c => c.idMateria == materia.idMateria)
                    .OrderBy(c => c.FechaRegistro)
                    .Select(c => new
                    {
                        c.Nota,
                        c.Comentarios,
                        Fecha = c.FechaRegistro.ToString("dd/MM/yyyy")
                    }),
                PromedioMateria = calificaciones
                    .Where(c => c.idMateria == materia.idMateria)
                    .Select(c => c.Nota)
                    .DefaultIfEmpty()
                    .Average()
            }).ToList();

            return Ok(new
            {
                Estudiante = new
                {
                    estudiante.nombre,
                    estudiante.apellido, 
                    estudiante.nombreUsuario,
                    Curso = estudiante.Curso.nombreCurso
                },
                TotalMaterias = materiasDelCurso.Count,
                PromedioGeneral = boletin
            .Select(b => b.PromedioMateria)
            .DefaultIfEmpty()
            .Average(),
                Boletín = boletin
            });
        }
    }
}