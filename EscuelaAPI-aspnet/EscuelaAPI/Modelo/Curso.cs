using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo
{
    public class Curso
    {
        [Key]
        public int idCurso { get; set; }


        public string nombreCurso { get; set; }

        public string turno {  get; set; }



        public virtual ICollection<Estudiante> Estudiantes { get; set; }










    }
}
