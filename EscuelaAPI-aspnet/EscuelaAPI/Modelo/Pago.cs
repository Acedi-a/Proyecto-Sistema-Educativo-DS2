using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EscuelaAPI.Modelo
{
    public class Pago
    {
        [Key]
        public int idPago { get; set; }

        [Required(ErrorMessage = "El campo monto es obligatorio")]
        public float monto { get; set; }

        [Required(ErrorMessage = "El campo estado es obligatorio")]
        [StringLength(50, ErrorMessage = "El estado no debe exceder 50 caracteres")]
        public string estado { get; set; }

        [Required(ErrorMessage = "El campo fecha es obligatorio")]
        public DateTime fecha { get; set; }

        public int idEstudiante { get; set; }

        [ForeignKey(nameof(idEstudiante))]
        public virtual Estudiante? Estudiante { get; set; }
    }
}
