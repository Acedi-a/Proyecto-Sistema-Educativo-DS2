using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo.DTOs
{
    public class UsuarioDTO
    {
        public string nombreUsuario { get; set; }

        public string nombre { get; set; }

       
        public string apellido { get; set; }

      
        public string? correo { get; set; }

       
        public string? clave { get; set; }

        public string direccion { get; set; }


      
        public string telefono { get; set; }



        public IFormFile? imagen { get; set; } // Nueva propiedad para la imagen

    }
}