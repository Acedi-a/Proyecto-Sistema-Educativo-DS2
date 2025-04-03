using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo
{
    public class Asistencia
    {
        [Key]
        public int idAsistencia { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime fecha { get; set; }

        [Required]
        [StringLength(20)]
        public string estado { get; set; }

        public int idEstudiante { get; set; }
        [ForeignKey(nameof(idEstudiante))]
        public Estudiante? estudiante { get; set; }

        public int idHorario { get; set; }
        [ForeignKey(nameof(idHorario))]
        public Horario? horario { get; set; }

    }
}
