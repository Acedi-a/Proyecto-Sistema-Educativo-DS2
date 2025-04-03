namespace EscuelaAPI.Modelo.DTOs
{
    public class ExamenDTO
    {
        public DateTime FechaExamen { get; set; }
        public string NombreMateria { get; set; }
        public TimeSpan HoraInicio { get; set; } 
        public TimeSpan HoraFin { get; set; }
        public string DiaSemana { get; set; }
        public int DiasRestantes { get; set; }
    }
}