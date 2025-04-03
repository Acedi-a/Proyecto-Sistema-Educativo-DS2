using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo.DTOs
{
    public class DocenteDTO : UsuarioDTO
    {


        [Required]
        [StringLength(50)]
        public string especialidad { get; set; }

       
    }
}