using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo
{
	public class Examen
	{
		[Key]
		public int idExamen { get; set; }
		[Required(ErrorMessage = "El campo fecha examen es obligatorio")]
		[DataType(DataType.Date)]
		public DateTime fechaExamen { get; set; }
		public int idHorario { get; set; }
		[ForeignKey(nameof(idHorario))]
		public virtual Horario? Horario { get; set; }
	}
}
