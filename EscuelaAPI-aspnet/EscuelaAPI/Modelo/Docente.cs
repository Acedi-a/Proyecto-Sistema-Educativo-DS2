using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EscuelaAPI.Modelo
{
    public class Docente : Usuario
    {
     

        public Docente()
        {
            rol = "Docente";
        }

        [StringLength(50)]
        public string especialidad { get; set; }
    }
}
