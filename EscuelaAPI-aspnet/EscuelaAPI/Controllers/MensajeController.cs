using EscuelaAPI.Data;
using EscuelaAPI.Modelo;
using EscuelaAPI.Modelo.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace EscuelaAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	
	public class MensajeController : ControllerBase
	{
		private readonly DbConexion _db;

		public MensajeController(DbConexion db)
		{
			_db = db;
		}
		//para listar los docentes del estudiante
		[HttpGet("listarDocentesSegunEstudiantes/{idEstudiante:int}")]
		public async Task<ActionResult> listarDocenteSegunEstudiante(int idEstudiante)
		{
			var estudiante = await _db.Estudiantes
			   .Include(e => e.Curso)
			   .FirstOrDefaultAsync(e => e.idUsuario == idEstudiante);
			if (estudiante == null)
			{
				return NotFound("Estudiante no encontrado");
			}

			if (estudiante.idCurso == 0)
			{
				return NotFound("El estudiante no está asignado a ningún curso");
			}
			var docentes = await _db.Horario
				.Where(h => h.idCurso == estudiante.idCurso)
				.Select(h => h.docente)
				.Distinct()
				.Select(d => new
				{
					d.idUsuario,
					d.nombre,
					d.apellido,

				})
				.ToListAsync();
			if (!docentes.Any())
			{
				return NotFound("No se encontraron docentes para el curso del estudiante");
			}

			return Ok(docentes);
		}

		//ver detalles del docente especifico
		[HttpGet("obtenerDocenteEspecifico/{idEstudiante:int}/{idDocente:int}")]
		public async Task<ActionResult> obtenerDocenteEspecifico(int idEstudiante, int idDocente)
		{

			var estudiante = await _db.Estudiantes
				.FirstOrDefaultAsync(e => e.idUsuario == idEstudiante);

			if (estudiante == null)
			{
				return NotFound("Estudiante no encontrado");
			}


			var docenteValido = await _db.Horario
				.AnyAsync(h => h.idCurso == estudiante.idCurso && h.idDocente == idDocente);

			if (!docenteValido)
			{
				return BadRequest("El docente no enseña al estudiante especificado");
			}


			var docente = await _db.Docente
				.Where(d => d.idUsuario == idDocente)
				.Select(d => new
				{
					d.idUsuario,
					d.nombre,
					d.apellido,
					d.correo,
					d.telefono,
					d.especialidad
				})
				.FirstOrDefaultAsync();

			if (docente == null)
			{
				return NotFound("Docente no encontrado");
			}

			return Ok(docente);
		}
		//listar mensajes del docente
		[HttpGet("docente/{idDocente:int}")]
		public async Task<ActionResult> GetMensajesPorDocente(int idDocente)
		{
			
			var todosLosMensajes = await _db.Mensaje.ToListAsync();
			if (!todosLosMensajes.Any())
			{
				return Ok(new { mensaje = "No hay mensajes en la base de datos" });
			}

			
			var docente = await _db.Docente.FirstOrDefaultAsync(d => d.idUsuario == idDocente);
			if (docente == null)
			{
				return Ok(new { mensaje = $"No se encontró el docente con ID {idDocente}" });
			}

			
			var mensajesDocente = await _db.Mensaje
				.Where(m => m.IdDocente == idDocente)
				.ToListAsync();
			if (!mensajesDocente.Any())
			{
				return Ok(new
				{
					mensaje = $"No hay mensajes para el docente {idDocente}",
					totalMensajes = todosLosMensajes.Count,
					idDocenteBuscado = idDocente
				});
			}

			
			var mensajes = await _db.Mensaje
				.Where(m => m.IdDocente == idDocente)
				.Include(m => m.Estudiante)
				.Select(m => new
				{
					m.IdMensaje,
					m.Asunto,
					m.Reunion,
					m.Estado,
					m.ContenidoMensaje,
					m.FechaCreacion,
					Estudiante = new
					{
						Id = m.Estudiante.idUsuario,
						NombreCompleto = m.Estudiante.nombre + " " + m.Estudiante.apellido,
						Curso = _db.cursos
							.Where(c => c.idCurso == m.Estudiante.idCurso)
							.Select(c => c.nombreCurso)
							.FirstOrDefault(),
						Tutor = m.Estudiante.tutor
					}
				})
				.OrderByDescending(m => m.FechaCreacion)
				.ToListAsync();

			return Ok(mensajes);
		}
		/*[HttpGet("docente/{idDocente}")]
		public async Task<ActionResult> GetMensajesPorDocente(int idDocente)
		{
			var docenteExiste = await _db.Docente.AnyAsync(d => d.idUsuario == idDocente);
			if (!docenteExiste)
			{
				return NotFound("Docente no encontrado");
			}

			
			var mensajes = await _db.Mensaje
				.Where(m => m.IdDocente == idDocente)
				.Include(m => m.Estudiante)  
				.Select(m => new
				{
					
					m.IdMensaje,
					m.Asunto,
					m.Reunion,
					m.Estado,
					m.ContenidoMensaje,
					m.FechaCreacion,

					
					Estudiante = new
					{
						Id = m.Estudiante.idUsuario,
						NombreCompleto = m.Estudiante.nombre + " " + m.Estudiante.apellido,
						Curso = _db.cursos
							.Where(c => c.idCurso == m.Estudiante.idCurso)
							.Select(c => c.nombreCurso)
							.FirstOrDefault(),

						
						Tutor = m.Estudiante.tutor
					}
				})
				.OrderByDescending(m => m.FechaCreacion)
				.ToListAsync();

			return Ok(mensajes);
		}*/


		//crear mensaje , enviar a docente
		[HttpPost("{idEstudiante}/{idDocente}")]
		public async Task<ActionResult> InsertarMensaje(
			int idEstudiante,
			int idDocente,
			[FromForm] MensajeDTO mensajeDto)
		{
		
			var estudianteValido = await _db.Estudiantes
				.FirstOrDefaultAsync(e => e.idUsuario == idEstudiante);

			if (estudianteValido == null)
			{
				return NotFound("El id estudiante no fue encontrado");
			}

			
			var docenteValido = await _db.Docente
				.FirstOrDefaultAsync(d => d.idUsuario == idDocente);

			if (docenteValido == null)
			{
				return NotFound("El id docente no fue encontrado");
			}

			var relacionValida = await _db.Horario
				.AnyAsync(h => h.idDocente == idDocente &&
							 h.idCurso == estudianteValido.idCurso);

			if (!relacionValida)
			{
				return BadRequest("El docente no enseña al estudiante especificado");
			}

			
			var mensaje = new Mensaje
			{
				Asunto = mensajeDto.Asunto,
				Reunion = mensajeDto.Reunion,
				ContenidoMensaje = mensajeDto.ContenidoMensaje,
				Estado = false, 
				IdEstudiante = idEstudiante,
				IdDocente = idDocente,
				FechaCreacion = DateTime.Now
			};

			_db.Mensaje.Add(mensaje);
			await _db.SaveChangesAsync();

			return Ok(new
			{
				Success = true,
				Message = mensajeDto.Reunion ?
					"Solicitud de reunión enviada" : "Mensaje enviado correctamente",
				IdMensaje = mensaje.IdMensaje
			});
		}
		//aceptar reunion
		[HttpPut("reunion/{idMensaje}")]
		public async Task<ActionResult> ResponderReunion(int idMensaje,[FromBody] ResponderReunionDto respuesta)
		{
			var mensaje = await _db.Mensaje.FirstOrDefaultAsync(m => m.IdMensaje == idMensaje && m.Reunion);

			if (mensaje == null)
			{
				return NotFound("Reunión no encontrada o no es una solicitud de reunión");
			}


			mensaje.Estado = respuesta.Aceptada;
			await _db.SaveChangesAsync();

			return Ok(new
			{
				Success = true,
				Message = respuesta.Aceptada ?
					"Reunión aceptada correctamente" : "Reunión rechazada",
				IdMensaje = mensaje.IdMensaje,
				Estado = mensaje.Estado
			});
		}

		public class ResponderReunionDto
		{
			[Required]
			public bool Aceptada { get; set; }
		}
		//listar historial de mensajes
		[HttpGet("estudiante/{idEstudiante}")]
		public async Task<ActionResult> GetHistorialEstudiante(int idEstudiante)
		{
			
			var estudianteExiste = await _db.Estudiantes.AnyAsync(e => e.idUsuario == idEstudiante);
			if (!estudianteExiste)
			{
				return NotFound("Estudiante no encontrado");
			}

			
			var historial = await _db.Mensaje
				.Where(m => m.IdEstudiante == idEstudiante)
				.Include(m => m.Docente)  
				.Select(m => new
				{
					
					m.IdMensaje,
					m.Asunto,
					m.Reunion,
					m.Estado,
					m.ContenidoMensaje,
					m.FechaCreacion,

					
					Docente = new
					{
						Id = m.Docente.idUsuario,
						NombreCompleto = m.Docente.nombre + " " + m.Docente.apellido,
						Especialidad = m.Docente.especialidad
					}
				})
				.OrderByDescending(m => m.FechaCreacion)  
				.ToListAsync();

			return Ok(historial);
		}

	}
}
