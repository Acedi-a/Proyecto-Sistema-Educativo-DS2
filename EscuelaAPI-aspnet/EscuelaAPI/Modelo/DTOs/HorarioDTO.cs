namespace EscuelaAPI.Modelo.DTOs
{


    public class HorarioDTO
    {
        public string DiaSemana { get; set; }
        public List<ClaseDTO> Clases { get; set; } // Lista de bloques horarios por día
    }

    public class ClaseDTO
    {
        public TimeSpan HoraInicio { get; set; }
        public TimeSpan HoraFin { get; set; }
        public string NombreMateria { get; set; }
        public string NombreDocente { get; set; }
    }
}    