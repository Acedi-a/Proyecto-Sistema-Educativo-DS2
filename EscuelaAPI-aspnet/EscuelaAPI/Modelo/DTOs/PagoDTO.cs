namespace EscuelaAPI.Modelo.DTOs
{
    public class PagoDTO
    {
        public int IdPago { get; set; }
        public float Monto { get; set; }
        public string Estado { get; set; }
        public DateTime Fecha { get; set; }
        public string NombreEstudiante { get; set; }
    }

    public class ProximoPagoDTO
    {
        public DateTime FechaProximo { get; set; }
        public float Monto { get; set; }
    }

    public class AlertaPagoDTO
    {
        public List<PagoDTO> Vencidos { get; set; }
        public List<ProximoPagoDTO> Proximos { get; set; }
    }
}