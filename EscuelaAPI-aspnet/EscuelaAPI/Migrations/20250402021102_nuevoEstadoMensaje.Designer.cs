﻿// <auto-generated />
using System;
using EscuelaAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace EscuelaAPI.Migrations
{
    [DbContext(typeof(DbConexion))]
    [Migration("20250402021102_nuevoEstadoMensaje")]
    partial class nuevoEstadoMensaje
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("EscuelaAPI.Modelo.Asistencia", b =>
                {
                    b.Property<int>("idAsistencia")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("idAsistencia"));

                    b.Property<string>("estado")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<DateTime>("fecha")
                        .HasColumnType("datetime2");

                    b.Property<int>("idEstudiante")
                        .HasColumnType("int");

                    b.Property<int>("idHorario")
                        .HasColumnType("int");

                    b.HasKey("idAsistencia");

                    b.HasIndex("idEstudiante");

                    b.HasIndex("idHorario");

                    b.ToTable("Asistencia");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Calificacion", b =>
                {
                    b.Property<int>("IdCalificacion")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdCalificacion"));

                    b.Property<string>("Comentarios")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("FechaRegistro")
                        .HasColumnType("datetime2");

                    b.Property<int>("IdCurso")
                        .HasColumnType("int");

                    b.Property<int>("IdEstudiante")
                        .HasColumnType("int");

                    b.Property<int>("Nota")
                        .HasColumnType("int");

                    b.Property<int>("idMateria")
                        .HasColumnType("int");

                    b.HasKey("IdCalificacion");

                    b.HasIndex("IdCurso");

                    b.HasIndex("IdEstudiante");

                    b.HasIndex("idMateria");

                    b.ToTable("Calificacion");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Certificado", b =>
                {
                    b.Property<int>("idCertificado")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("idCertificado"));

                    b.Property<string>("contenido")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("fechaEmision")
                        .HasColumnType("datetime2");

                    b.Property<int>("idEstudiante")
                        .HasColumnType("int");

                    b.HasKey("idCertificado");

                    b.HasIndex("idEstudiante");

                    b.ToTable("Certificado");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Curso", b =>
                {
                    b.Property<int>("idCurso")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("idCurso"));

                    b.Property<string>("nombreCurso")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("turno")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("idCurso");

                    b.ToTable("Curso", (string)null);
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Examen", b =>
                {
                    b.Property<int>("idExamen")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("idExamen"));

                    b.Property<DateTime>("fechaExamen")
                        .HasColumnType("datetime2");

                    b.Property<int>("idHorario")
                        .HasColumnType("int");

                    b.HasKey("idExamen");

                    b.HasIndex("idHorario");

                    b.ToTable("Examen");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Horario", b =>
                {
                    b.Property<int>("idHorario")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("idHorario"));

                    b.Property<string>("diaSemana")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.Property<DateTime?>("horaFin")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("horaInicio")
                        .HasColumnType("datetime2");

                    b.Property<int>("idCurso")
                        .HasColumnType("int");

                    b.Property<int>("idDocente")
                        .HasColumnType("int");

                    b.Property<int>("idMateria")
                        .HasColumnType("int");

                    b.HasKey("idHorario");

                    b.HasIndex("idCurso");

                    b.HasIndex("idDocente");

                    b.HasIndex("idMateria");

                    b.ToTable("Horario");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Materia", b =>
                {
                    b.Property<int>("idMateria")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("idMateria"));

                    b.Property<string>("descripcion")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("nombreMateria")
                        .IsRequired()
                        .HasMaxLength(40)
                        .HasColumnType("nvarchar(40)");

                    b.HasKey("idMateria");

                    b.ToTable("Materia");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Mensaje", b =>
                {
                    b.Property<int>("IdMensaje")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdMensaje"));

                    b.Property<string>("Asunto")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("ContenidoMensaje")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<bool>("Estado")
                        .HasColumnType("bit");

                    b.Property<DateTime>("FechaCreacion")
                        .HasColumnType("datetime2");

                    b.Property<int>("IdDocente")
                        .HasColumnType("int");

                    b.Property<int>("IdEstudiante")
                        .HasColumnType("int");

                    b.Property<bool>("Reunion")
                        .HasColumnType("bit");

                    b.HasKey("IdMensaje");

                    b.HasIndex("IdDocente");

                    b.HasIndex("IdEstudiante");

                    b.ToTable("Mensaje");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Pago", b =>
                {
                    b.Property<int>("idPago")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("idPago"));

                    b.Property<string>("estado")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime>("fecha")
                        .HasColumnType("datetime2");

                    b.Property<int>("idEstudiante")
                        .HasColumnType("int");

                    b.Property<float>("monto")
                        .HasColumnType("real");

                    b.HasKey("idPago");

                    b.HasIndex("idEstudiante");

                    b.ToTable("Pago");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Reporte", b =>
                {
                    b.Property<int>("idReporte")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("idReporte"));

                    b.Property<string>("contenido")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("idDocente")
                        .HasColumnType("int");

                    b.Property<int>("idEstudiante")
                        .HasColumnType("int");

                    b.Property<string>("tipoReporte")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("idReporte");

                    b.HasIndex("idDocente");

                    b.HasIndex("idEstudiante");

                    b.ToTable("Reporte");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Usuario", b =>
                {
                    b.Property<int>("idUsuario")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("idUsuario"));

                    b.Property<string>("ImagenPath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("activo")
                        .HasColumnType("bit");

                    b.Property<string>("apellido")
                        .IsRequired()
                        .HasMaxLength(40)
                        .HasColumnType("nvarchar(40)");

                    b.Property<string>("correo")
                        .HasMaxLength(40)
                        .HasColumnType("nvarchar(40)");

                    b.Property<string>("direccion")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<DateTime?>("fechaRegistro")
                        .HasColumnType("datetime2");

                    b.Property<string>("nombre")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.Property<string>("nombreUsuario")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("password")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("rol")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<string>("telefono")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("idUsuario");

                    b.ToTable("Usuario", (string)null);

                    b.UseTptMappingStrategy();
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Docente", b =>
                {
                    b.HasBaseType("EscuelaAPI.Modelo.Usuario");

                    b.Property<string>("especialidad")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.ToTable("Docente", (string)null);
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Estudiante", b =>
                {
                    b.HasBaseType("EscuelaAPI.Modelo.Usuario");

                    b.Property<int>("idCurso")
                        .HasColumnType("int");

                    b.Property<string>("tutor")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasIndex("idCurso");

                    b.ToTable("Estudiante", (string)null);
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Operador", b =>
                {
                    b.HasBaseType("EscuelaAPI.Modelo.Usuario");

                    b.Property<string>("turnoLaboral")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.ToTable("Operador", (string)null);
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Asistencia", b =>
                {
                    b.HasOne("EscuelaAPI.Modelo.Estudiante", "estudiante")
                        .WithMany()
                        .HasForeignKey("idEstudiante")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("EscuelaAPI.Modelo.Horario", "horario")
                        .WithMany()
                        .HasForeignKey("idHorario")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("estudiante");

                    b.Navigation("horario");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Calificacion", b =>
                {
                    b.HasOne("EscuelaAPI.Modelo.Curso", null)
                        .WithMany()
                        .HasForeignKey("IdCurso")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("EscuelaAPI.Modelo.Estudiante", "Estudiante")
                        .WithMany()
                        .HasForeignKey("IdEstudiante")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("EscuelaAPI.Modelo.Materia", "materia")
                        .WithMany()
                        .HasForeignKey("idMateria")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Estudiante");

                    b.Navigation("materia");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Certificado", b =>
                {
                    b.HasOne("EscuelaAPI.Modelo.Estudiante", "Estudiante")
                        .WithMany()
                        .HasForeignKey("idEstudiante")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Estudiante");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Examen", b =>
                {
                    b.HasOne("EscuelaAPI.Modelo.Horario", "Horario")
                        .WithMany()
                        .HasForeignKey("idHorario")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Horario");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Horario", b =>
                {
                    b.HasOne("EscuelaAPI.Modelo.Curso", "curso")
                        .WithMany()
                        .HasForeignKey("idCurso")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("EscuelaAPI.Modelo.Docente", "docente")
                        .WithMany()
                        .HasForeignKey("idDocente")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("EscuelaAPI.Modelo.Materia", "materia")
                        .WithMany()
                        .HasForeignKey("idMateria")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("curso");

                    b.Navigation("docente");

                    b.Navigation("materia");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Mensaje", b =>
                {
                    b.HasOne("EscuelaAPI.Modelo.Docente", "Docente")
                        .WithMany()
                        .HasForeignKey("IdDocente")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("EscuelaAPI.Modelo.Estudiante", "Estudiante")
                        .WithMany()
                        .HasForeignKey("IdEstudiante")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Docente");

                    b.Navigation("Estudiante");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Pago", b =>
                {
                    b.HasOne("EscuelaAPI.Modelo.Estudiante", "Estudiante")
                        .WithMany()
                        .HasForeignKey("idEstudiante")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Estudiante");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Reporte", b =>
                {
                    b.HasOne("EscuelaAPI.Modelo.Docente", "Docente")
                        .WithMany()
                        .HasForeignKey("idDocente")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("EscuelaAPI.Modelo.Estudiante", "Estudiante")
                        .WithMany()
                        .HasForeignKey("idEstudiante")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Docente");

                    b.Navigation("Estudiante");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Docente", b =>
                {
                    b.HasOne("EscuelaAPI.Modelo.Usuario", null)
                        .WithOne()
                        .HasForeignKey("EscuelaAPI.Modelo.Docente", "idUsuario")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Estudiante", b =>
                {
                    b.HasOne("EscuelaAPI.Modelo.Curso", "Curso")
                        .WithMany("Estudiantes")
                        .HasForeignKey("idCurso")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("EscuelaAPI.Modelo.Usuario", null)
                        .WithOne()
                        .HasForeignKey("EscuelaAPI.Modelo.Estudiante", "idUsuario")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Curso");
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Operador", b =>
                {
                    b.HasOne("EscuelaAPI.Modelo.Usuario", null)
                        .WithOne()
                        .HasForeignKey("EscuelaAPI.Modelo.Operador", "idUsuario")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("EscuelaAPI.Modelo.Curso", b =>
                {
                    b.Navigation("Estudiantes");
                });
#pragma warning restore 612, 618
        }
    }
}
