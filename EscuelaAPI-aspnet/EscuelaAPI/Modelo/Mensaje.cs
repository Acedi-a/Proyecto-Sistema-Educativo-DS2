using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo
{
    public class Mensaje
    {

        [Key]
        public int IdMensaje { get; set; }

        [Required(ErrorMessage = "El asunto es requerido")]
        [StringLength(100, ErrorMessage = "El asunto debe tener entre 5 y 100 caracteres", MinimumLength = 5)]
        public string Asunto { get; set; }

        [Required(ErrorMessage = "Debe especificar si es reunión o no")]
        public bool Reunion { get; set; }

        [Required(ErrorMessage = "El contenido del mensaje es requerido")]
        [StringLength(500, ErrorMessage = "El mensaje debe tener entre 10 y 500 caracteres", MinimumLength = 10)]
        public string ContenidoMensaje { get; set; }

        //NUEVO ATRIBUTO
        public bool Estado { get; set; }

        [Required(ErrorMessage = "El ID del estudiante es requerido")]
        public int IdEstudiante { get; set; }

        [Required(ErrorMessage = "El ID del docente es requerido")]
        public int IdDocente { get; set; }

        [Required(ErrorMessage = "La fecha de creación es requerida")]
        [DataType(DataType.DateTime)]
        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        [ForeignKey(nameof(IdEstudiante))]
        public Estudiante Estudiante { get; set; }

        [ForeignKey(nameof(IdDocente))]
        public Docente Docente { get; set; }
    }
}
