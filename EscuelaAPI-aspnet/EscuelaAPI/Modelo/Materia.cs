using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo
{
    public class Materia
    {
        [Key]
        public int idMateria { get; set; }

        [Required]
        [StringLength(40, ErrorMessage = "El campo nombre de la materia no cumple con los requerimientos", MinimumLength = 3)]
        public string nombreMateria { get; set; }

        [Required]
        [StringLength(200, ErrorMessage = "El campo descripcion no cumple con los requerimientos", MinimumLength = 3)]
        public string descripcion { get; set; }
    }
}
