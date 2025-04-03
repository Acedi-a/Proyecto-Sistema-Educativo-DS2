using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo
{
    public class Calificacion
    {
        [Key]
        public int IdCalificacion { get; set; }

        [Required(ErrorMessage = "La nota es requerida")]
        [Range(0, 100, ErrorMessage = "La nota debe estar entre 0 y 100")]
        public int Nota { get; set; }

        public string Comentarios { get; set; }

        public int IdEstudiante { get; set; }

        public int IdCurso { get; set; }

        [Required(ErrorMessage = "La fecha de registro es requerida")]
        [DataType(DataType.Date)]
        public DateTime FechaRegistro { get; set; } = DateTime.Now;

        [ForeignKey(nameof(IdEstudiante))]
        public Estudiante? Estudiante { get; set; }


        public int idMateria { get; set; }

        [ForeignKey(nameof(idMateria))]
        public Materia? materia { get; set; }
    }
}
