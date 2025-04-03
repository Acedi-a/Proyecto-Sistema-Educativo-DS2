using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo.DTOs
{
    public class LoginDTO
    {
        public string correo { get; set; }

        public string clave { get; set; }
    }

    
}