namespace EscuelaAPI.Modelo.DTOs;

public class AsistenciaDTO
{
    public DateTime Fecha { get; set; }
    public string Estado { get; set; }
    public string DiaSemana { get; set; }
    public string Materia { get; set; }
    public string Docente { get; set; }
    public TimeSpan? HoraInicio { get; set; }
    public TimeSpan HoraFin { get; set; }
}