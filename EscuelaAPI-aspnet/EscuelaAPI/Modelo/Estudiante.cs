using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EscuelaAPI.Modelo
{
    public class Estudiante : Usuario
    {


        public Estudiante()
        {
            rol = "Estudiante";
           
            
        }

        [StringLength(20)]
        public string tutor { get; set; }

        public int idCurso { get; set; }
        [ForeignKey(nameof(idCurso))]

        public virtual Curso? Curso { get; set; }

    }
}
