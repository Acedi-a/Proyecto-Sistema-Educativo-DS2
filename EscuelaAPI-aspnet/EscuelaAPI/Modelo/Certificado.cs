using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo
{
    public class Certificado
    {
        [Key]
        public int idCertificado { get; set; }

        [Required(ErrorMessage = "El campo fecha de emisión es obligatorio")]
        public DateTime fechaEmision { get; set; }

        [Required(ErrorMessage = "El campo contenido es obligatorio")]
        public string contenido { get; set; }

        [Required(ErrorMessage = "El campo estudiante es obligatorio")]
        public int idEstudiante { get; set; }

        [ForeignKey(nameof(idEstudiante))]
        public virtual Estudiante? Estudiante { get; set; }
    }
}
