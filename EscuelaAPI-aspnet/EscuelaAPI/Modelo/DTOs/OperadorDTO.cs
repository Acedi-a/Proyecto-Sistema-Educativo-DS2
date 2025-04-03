namespace EscuelaAPI.Modelo.DTOs
{
    public class OperadorDTO : UsuarioDTO
    {
      
        public string turnoLaboral { get; set; } // "Matutino", "Vespertino", "Nocturno", etc.
    }
}