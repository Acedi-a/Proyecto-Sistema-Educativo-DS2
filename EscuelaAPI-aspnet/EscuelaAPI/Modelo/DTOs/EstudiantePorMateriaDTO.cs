namespace EscuelaAPI.Modelo.DTOs
{
    public class EstudiantePorMateriaDTO
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public int IdCurso { get; set; }
        public string NombreCurso { get; set; }
        public int IdMateria { get; set; }
        public string NombreMateria { get; set; }
    }
}