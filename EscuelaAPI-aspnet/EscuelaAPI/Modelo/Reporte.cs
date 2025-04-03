using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EscuelaAPI.Modelo
{
	public class Reporte
	{
        [Key]
        public int idReporte { get; set; }
		[Required(ErrorMessage = "El campo tipo reporte es obligatorio")]
		[StringLength(20, ErrorMessage = "El tipo reporte no cumple con los valores minimos"), MinLength(2)]
		public string tipoReporte { get; set; }
		[Required(ErrorMessage = "El campo contenido es obligatorio")]
		public string contenido {  get; set; }

        public int idDocente { get; set; }
		[ForeignKey(nameof(idDocente))]
		public virtual Docente? Docente { get; set; }
		
		public int idEstudiante { get; set; }
		[ForeignKey(nameof(idEstudiante))]
		public virtual Estudiante? Estudiante { get; set; }


	}
}
