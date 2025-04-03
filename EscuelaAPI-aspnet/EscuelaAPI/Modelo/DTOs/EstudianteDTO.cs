using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo.DTOs
{
    public class EstudianteDTO : UsuarioDTO
    {




        [Required]
        [StringLength(100)]
        public string tutor { get; set; }

        [Required]
        public int idCurso { get; set; }
    }
}