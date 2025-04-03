using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo.DTOs
{
	public class MensajeDTO
	{
		
			[Required(ErrorMessage = "El asunto es requerido")]
			[StringLength(100, MinimumLength = 5, ErrorMessage = "El asunto debe tener entre 5 y 100 caracteres")]
			public string Asunto { get; set; }

			[Required(ErrorMessage = "Debe especificar si es reunión o no")]
			public bool Reunion { get; set; }

			[Required(ErrorMessage = "El contenido del mensaje es requerido")]
			[StringLength(500, MinimumLength = 10, ErrorMessage = "El mensaje debe tener entre 10 y 500 caracteres")]
			public string ContenidoMensaje { get; set; }
	}
}
