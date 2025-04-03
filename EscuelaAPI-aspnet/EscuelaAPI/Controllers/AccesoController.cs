using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EscuelaAPI.Custom;
using EscuelaAPI.Modelo;
using EscuelaAPI.Modelo.DTOs;
using Microsoft.AspNetCore.Authorization;
using EscuelaAPI.Data;
using System.IO;

namespace EscuelaAPI.Controllers
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class AccesoController : ControllerBase
    {
        private readonly DbConexion _dbconexion;
        private readonly Utilidades _utilidades;

        public AccesoController(DbConexion dbconexion, Utilidades utilidades)
        {
            _dbconexion = dbconexion;
            _utilidades = utilidades;
        }

        private async Task<string> GuardarImagenUsuario(IFormFile archivo)
        {
            
                var extensionesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(archivo.FileName).ToLower();
                var rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var uploadsFolder = Path.Combine(rootPath, "Uploads", "Usuarios");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Generar nombre único
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await archivo.CopyToAsync(stream);
                }

                if (!System.IO.File.Exists(filePath))
                    return "error insercion";

                return Path.Combine("Uploads", "Usuarios", fileName).Replace("\\", "/");
            
            
        }


        [HttpPost("Registrar/Operador")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> RegistrarOperador([FromForm] OperadorDTO operadorDto)
        {
            try
            {
                if (await _dbconexion.Usuario.AnyAsync(u => u.correo == operadorDto.correo))
                    return BadRequest(new { success = false, message = "El correo ya está registrado" });

                string imagenPath = await GuardarImagenUsuario(operadorDto.imagen);

                var operador = new Operador
                {
                    nombreUsuario = operadorDto.nombreUsuario,
                    nombre = operadorDto.nombre,
                    apellido = operadorDto.apellido,
                    correo = operadorDto.correo,
                    password = _utilidades.encriptar(operadorDto.clave),
                    direccion = operadorDto.direccion,
                    telefono = operadorDto.telefono,
                    rol = "Operador",
                    fechaRegistro = DateTime.Now,
                    activo = true,
                    turnoLaboral = operadorDto.turnoLaboral,
                    ImagenPath = imagenPath
                };

                _dbconexion.Usuario.Add(operador);
                await _dbconexion.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    id = operador.idUsuario,
                    message = "Operador registrado exitosamente",
                    imagenUrl = imagenPath != null ? $"/{imagenPath}" : null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al registrar operador",
                    error = ex.Message
                });
            }
        }
        [HttpPut("Editar/Operador/{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> EditarOperador(int id, [FromForm] OperadorDTO operadorDto)
        {
            try
            {
                var operador = await _dbconexion.Operador.FindAsync(id);
                if (operador == null)
                    return NotFound(new { success = false, message = "Operador no encontrado" });

                // Actualizar campos básicos
                operador.nombreUsuario = operadorDto.nombreUsuario ?? operador.nombreUsuario;
                operador.nombre = operadorDto.nombre ?? operador.nombre;
                operador.apellido = operadorDto.apellido ?? operador.apellido;
                operador.direccion = operadorDto.direccion ?? operador.direccion;
                operador.telefono = operadorDto.telefono ?? operador.telefono;
                operador.turnoLaboral = operadorDto.turnoLaboral ?? operador.turnoLaboral;

                // Actualizar imagen si se proporciona
                if (operadorDto.imagen != null)
                {
                    var nuevaImagenPath = await GuardarImagenUsuario(operadorDto.imagen);
                    operador.ImagenPath = nuevaImagenPath;
                }

                await _dbconexion.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Operador actualizado exitosamente",
                    imagenUrl = operador.ImagenPath != null ? $"/{operador.ImagenPath}" : null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al actualizar operador",
                    error = ex.Message
                });
            }
        }

        [HttpPost("Registrar/Estudiante")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> RegistrarEstudiante([FromForm] EstudianteDTO estudianteDto)
        {
            try
            {
                if (await _dbconexion.Usuario.AnyAsync(u => u.correo == estudianteDto.correo))
                    return BadRequest(new { success = false, message = "El correo ya está registrado" });

                string imagenPath = await GuardarImagenUsuario(estudianteDto.imagen);


                var estudiante = new Estudiante
                {
                    nombreUsuario = estudianteDto.nombreUsuario,
                    nombre = estudianteDto.nombre,
                    apellido = estudianteDto.apellido,
                    correo = estudianteDto.correo,
                    password = _utilidades.encriptar(estudianteDto.clave),
                    direccion = estudianteDto.direccion,
                    telefono = estudianteDto.telefono,
                    rol = "Estudiante",
                    fechaRegistro = DateTime.Now,
                    activo = true,
                    tutor = estudianteDto.tutor,
                    idCurso = estudianteDto.idCurso,
                    ImagenPath = imagenPath
                };

                _dbconexion.Usuario.Add(estudiante);
                await _dbconexion.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    id = estudiante.idUsuario,
                    message = "Estudiante registrado exitosamente",
                    imagenUrl = imagenPath != null ? $"/{imagenPath}" : null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al registrar estudiante",
                    error = ex.Message
                });
            }
        }

        [HttpPut("Editar/Estudiante/{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> EditarEstudiante(int id, [FromForm] EstudianteDTO estudianteDto)
        {
            try
            {
                var estudiante = await _dbconexion.Estudiantes.FindAsync(id);
                if (estudiante == null)
                    return NotFound(new { success = false, message = "Estudiante no encontrado" });

                // Actualizar campos básicos
                estudiante.nombreUsuario = estudianteDto.nombreUsuario ?? estudiante.nombreUsuario;
                estudiante.nombre = estudianteDto.nombre ?? estudiante.nombre;
                estudiante.apellido = estudianteDto.apellido ?? estudiante.apellido;
                estudiante.direccion = estudianteDto.direccion ?? estudiante.direccion;
                estudiante.telefono = estudianteDto.telefono ?? estudiante.telefono;
                estudiante.tutor = estudianteDto.tutor ?? estudiante.tutor;

                if (estudianteDto.idCurso!=null)
                    estudiante.idCurso = estudianteDto.idCurso;

                // Actualizar imagen si se proporciona
                if (estudianteDto.imagen != null)
                {
                    var nuevaImagenPath = await GuardarImagenUsuario(estudianteDto.imagen);
                    estudiante.ImagenPath = nuevaImagenPath;
                }

                await _dbconexion.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Estudiante actualizado exitosamente",
                    imagenUrl = estudiante.ImagenPath != null ? $"/{estudiante.ImagenPath}" : null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al actualizar estudiante",
                    error = ex.Message
                });
            }
        }
        [HttpGet]
        [Route("Obtener/Estudiante/{id}")]
        public async Task<IActionResult> ObtenerEstudiante(int id)
        {
            try
            {
                var estudiante = await _dbconexion.Estudiantes
                    .Where(d => d.idUsuario == id)
                    .Select(d => new
                    {
                        d.nombreUsuario,
                        d.nombre,
                        d.apellido,
                        d.direccion,
                        d.telefono,
                        d.tutor,
                        d.ImagenPath,
                        d.correo,
                        rol = d.rol,
                        fechaRegistro = d.fechaRegistro
                    })
                    .FirstOrDefaultAsync();

                if (estudiante == null)
                {
                    return NotFound(new { success = false, message = "Estudiante no encontrado" });
                }

                return Ok(new { success = true, estudiante });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al obtener docente",
                    error = ex.Message
                });
            }
        }

        [HttpPost("Registrar/Docente")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> RegistrarDocente([FromForm] DocenteDTO docenteDto)
        {
            try
            {
                if (await _dbconexion.Usuario.AnyAsync(u => u.correo == docenteDto.correo))
                    return BadRequest(new { success = false, message = "El correo ya está registrado" });

                string imagenPath = await GuardarImagenUsuario(docenteDto.imagen);


                var docente = new Docente
                {
                    nombreUsuario = docenteDto.nombreUsuario,
                    nombre = docenteDto.nombre,
                    apellido = docenteDto.apellido,
                    correo = docenteDto.correo,
                    password = _utilidades.encriptar(docenteDto.clave),
                    direccion = docenteDto.direccion,
                    telefono = docenteDto.telefono,
                    rol = "Docente",
                    fechaRegistro = DateTime.Now,
                    activo = true,
                    especialidad = docenteDto.especialidad,
                    ImagenPath = imagenPath
                };

                _dbconexion.Usuario.Add(docente);
                await _dbconexion.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    id = docente.idUsuario,
                    message = "Docente registrado exitosamente",
                    imagenUrl = imagenPath != null ? $"/{imagenPath}" : null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al registrar docente",
                    error = ex.Message
                });
            }
        }
        [HttpPut("Editar/Docente/{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> EditarDocente(int id, [FromForm] DocenteDTO docenteDto)
        {
            try
            {
                var docente = await _dbconexion.Docente.FindAsync(id);
                if (docente == null)
                    return NotFound(new { success = false, message = "Docente no encontrado" });

                // Actualizar campos básicos
                docente.nombreUsuario = docenteDto.nombreUsuario ?? docente.nombreUsuario;
                docente.nombre = docenteDto.nombre ?? docente.nombre;
                docente.apellido = docenteDto.apellido ?? docente.apellido;
                docente.direccion = docenteDto.direccion ?? docente.direccion;
                docente.telefono = docenteDto.telefono ?? docente.telefono;
                docente.especialidad = docenteDto.especialidad ?? docente.especialidad;

                // Actualizar imagen si se proporciona
                if (docenteDto.imagen != null)
                {
                    var nuevaImagenPath = await GuardarImagenUsuario(docenteDto.imagen);
                    docente.ImagenPath = nuevaImagenPath;
                }

                await _dbconexion.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Docente actualizado exitosamente",
                    imagenUrl = docente.ImagenPath != null ? $"/{docente.ImagenPath}" : null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al actualizar docente",
                    error = ex.Message
                });
            }
        }
        [HttpGet]
        [Route("Obtener/Docente/{id}")]
        public async Task<IActionResult> ObtenerDocente(int id)
        {
            try
            {
                var docente = await _dbconexion.Docente
                    .Where(d => d.idUsuario == id)
                    .Select(d => new
                    {
                        d.idUsuario,
                        d.nombreUsuario,
                        d.nombre,
                        d.apellido,
                        d.direccion,
                        d.telefono,
                        d.especialidad,
                        d.ImagenPath,
                        d.correo,
                        rol = d.rol,
                        fechaRegistro = d.fechaRegistro
                    })
                    .FirstOrDefaultAsync();

                if (docente == null)
                {
                    return NotFound(new { success = false, message = "Docente no encontrado" });
                }

                return Ok(new { success = true, docente });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al obtener docente",
                    error = ex.Message
                });
            }
        }


        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            try
            {
                var usuario = await _dbconexion.Usuario
                    .FirstOrDefaultAsync(u => u.correo == loginDto.correo &&
                                            u.password == _utilidades.encriptar(loginDto.clave));

                if (usuario == null)
                    return Unauthorized(new { success = false, message = "Credenciales incorrectas" });
                int idUsuario = usuario.idUsuario;
                object datosAdicionales = null;
                string nombreCompleto = $"{usuario.nombre} {usuario.apellido}";

                switch (usuario.rol)
                {
                    case "Estudiante":
                        var estudiante = await _dbconexion.Estudiantes
                            .Include(e => e.Curso)
                            .FirstOrDefaultAsync(e => e.idUsuario == usuario.idUsuario);

                        datosAdicionales = new
                        {
                            tutor = estudiante?.tutor,
                            curso = estudiante?.Curso?.nombreCurso,
                            idCurso = estudiante?.idCurso
                        };
                        break;

                    case "Docente":
                        var docente = await _dbconexion.Docente
                            .FirstOrDefaultAsync(d => d.idUsuario == usuario.idUsuario);

                        datosAdicionales = new
                        {
                            especialidad = docente?.especialidad
                        };
                        break;

                    case "Operador":
                        var operador = await _dbconexion.Operador
                            .FirstOrDefaultAsync(o => o.idUsuario == usuario.idUsuario);

                        datosAdicionales = new
                        {
                            turnoLaboral = operador?.turnoLaboral
                        };
                        break;
                }

                var token = _utilidades.generarJWT(usuario);

                return Ok(new
                {
                    success = true,
                    token,
                    idUsuario,
                    rol = usuario.rol,
                    nombreUsuario = usuario.nombreUsuario,
                    nombreCompleto,
                    imagenUrl = !string.IsNullOrEmpty(usuario.ImagenPath) ? $"/{usuario.ImagenPath}" : null,
                    datosAdicionales
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error durante el login",
                    error = ex.Message
                });
            }
        }
    }
}