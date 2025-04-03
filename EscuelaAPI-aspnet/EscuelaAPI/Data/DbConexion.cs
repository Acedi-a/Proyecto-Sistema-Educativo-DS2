using EscuelaAPI.Modelo;
using Microsoft.EntityFrameworkCore;

namespace EscuelaAPI.Data
{
    public class DbConexion : DbContext
    {
        public DbConexion(DbContextOptions<DbConexion> options) : base(options) { }

        public DbSet<Estudiante> Estudiantes { get; set; }
        public DbSet<Curso> cursos { get; set; }
        public DbSet<Usuario> Usuario { get; set; }
        public DbSet<Docente> Docente { get; set; }
        public DbSet<Operador> Operador { get; set; }


        public DbSet<Horario> Horario { get; set; }
        public DbSet<Asistencia> Asistencia { get; set; }

        public DbSet<Calificacion> Calificacion { get; set; }

        public DbSet<Reporte> Reporte { get; set; }

        public DbSet<Certificado> Certificado { get; set; }

        public DbSet<Pago> Pago { get; set; }

        public DbSet<Mensaje> Mensaje { get; set; }

        public DbSet<Examen>  Examen { get; set; }

        public DbSet<Materia> Materia { get; set; }








        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuración base
            modelBuilder.Entity<Usuario>(e =>
            {
                e.ToTable("Usuario");
                e.HasKey(u => u.idUsuario);
            });

            // Configuración para Estudiante (sin renombrar columna idUsuario)
            modelBuilder.Entity<Estudiante>(e =>
            {
                e.ToTable("Estudiante");
                e.HasOne(x => x.Curso)
                    .WithMany(x => x.Estudiantes)
                    .HasForeignKey(x => x.idCurso);
            });

            // Configuración para Docente (sin renombrar columna idUsuario)
            modelBuilder.Entity<Docente>(e =>
            {
                e.ToTable("Docente");
            });

            // Configuración para Operador (sin renombrar columna idUsuario)
            modelBuilder.Entity<Operador>(e =>
            {
                e.ToTable("Operador");
            });

            // Configuración para Curso
            modelBuilder.Entity<Curso>().ToTable("Curso");






            //CREAR HORARIO CORRECTO

            modelBuilder.Entity<Horario>()
               .HasOne(h => h.docente)
               .WithMany()
               .HasForeignKey(h => h.idDocente)
               .HasPrincipalKey(d => d.idUsuario); // Asumiendo que IdUsuario es la PK en Usuar


            //CREAR ASISTENCIA CORRECTA

            // Configuración para Asistencia-Horario
            modelBuilder.Entity<Asistencia>()
                .HasOne(a => a.horario)
                .WithMany()
                .HasForeignKey(a => a.idHorario)
                .OnDelete(DeleteBehavior.Restrict); // Cambiado a Restrict

                    modelBuilder.Entity<Asistencia>()
               .HasOne(a => a.estudiante)
               .WithMany()
               .HasForeignKey(a => a.idEstudiante)
               .HasPrincipalKey(e => e.idUsuario)
               .OnDelete(DeleteBehavior.Restrict); // Cambiado a Restrict




            //  CREAR CALIFICACION CORRECTA

            // Configuración para Calificacion-Estudiante
            modelBuilder.Entity<Calificacion>()
                .HasOne(c => c.Estudiante)
                .WithMany() // Sin colección en Estudiante
                .HasForeignKey(c => c.IdEstudiante)
                .HasPrincipalKey(e => e.idUsuario) // Relación con idUsuario de Estudiante
                .OnDelete(DeleteBehavior.Restrict); // Prevenir cascade delete

            // Configuración para Calificacion-Materia
            modelBuilder.Entity<Calificacion>()
                .HasOne(c => c.materia)
                .WithMany() // Sin colección en Materia
                .HasForeignKey(c => c.idMateria)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración para Calificacion-Curso
            modelBuilder.Entity<Calificacion>()
                .HasOne<Curso>() // Asume que existe entidad Curso
                .WithMany() // Sin colección en Curso
                .HasForeignKey(c => c.IdCurso)
                .OnDelete(DeleteBehavior.Restrict);



            //CREAR REPORTE CORRECTO
            // Relación Reporte -> Docente
            modelBuilder.Entity<Reporte>()
                .HasOne(r => r.Docente)
                .WithMany()
                .HasForeignKey(r => r.idDocente).OnDelete(DeleteBehavior.Restrict)
                .HasPrincipalKey(d => d.idUsuario);

            // Relación Reporte -> Estudiante
            modelBuilder.Entity<Reporte>()
                .HasOne(r => r.Estudiante)
                .WithMany()
                .HasForeignKey(r => r.idEstudiante).OnDelete(DeleteBehavior.Restrict)
                .HasPrincipalKey(e => e.idUsuario);



            //CREAR CERTIFICADO CORRECTO
            modelBuilder.Entity<Certificado>()
              .HasOne(c => c.Estudiante) // Relación con la propiedad de navegación
              .WithMany() // Un estudiante puede tener muchos certificados
              .HasForeignKey(c => c.idEstudiante).OnDelete(DeleteBehavior.Restrict) // Clave foránea en Certificado
              .HasPrincipalKey(e => e.idUsuario); // Clave principal en Estudiante



            // CREAR PAGO CORRECTO
            modelBuilder.Entity<Pago>()
                  .HasOne(P => P.Estudiante) // Relación con la propiedad de navegación
                  .WithMany() // Un estudiante puede tener muchos certificados
                  .HasForeignKey(p =>p.idEstudiante).OnDelete(DeleteBehavior.Restrict) // Clave foránea en Certificado
                  .HasPrincipalKey(p => p.idUsuario); // Clave principal en Estudiante







            modelBuilder.Entity<Mensaje>()
                .HasOne(r => r.Docente)
                .WithMany()
                .HasForeignKey(r => r.IdDocente).OnDelete(DeleteBehavior.Restrict)
                .HasPrincipalKey(d => d.idUsuario);

            // Relación Reporte -> Estudiante
            modelBuilder.Entity<Mensaje>()
                .HasOne(r => r.Estudiante)
                .WithMany()
                .HasForeignKey(r => r.IdEstudiante).OnDelete(DeleteBehavior.Restrict)
                .HasPrincipalKey(e => e.idUsuario);

        }



      
    }
}

