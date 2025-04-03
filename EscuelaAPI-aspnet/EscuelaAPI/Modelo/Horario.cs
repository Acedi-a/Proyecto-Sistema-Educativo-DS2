using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo
{
    public class Horario
    {
        [Key]
        public int idHorario { get; set; }

        [Required(ErrorMessage = "El campo diaSemana es obligatorio")]
        [StringLength(15, ErrorMessage = "El dia de la semana no cumple con los requerimientos", MinimumLength = 3)]
        public string diaSemana { get; set; }

        [DataType(DataType.Time)]
        public DateTime? horaInicio { get; set; }

        [DataType(DataType.Time)]
        public DateTime? horaFin { get; set; }

        public int idCurso { get; set; }
        [ForeignKey(nameof(idCurso))]
        public Curso? curso { get; set; }

        public int idDocente { get; set; }
        [ForeignKey(nameof(idDocente))]
        public Docente? docente { get; set; }

        public int idMateria { get; set; }
        [ForeignKey(nameof(idMateria))]
        public Materia? materia { get; set; }
    }
}
