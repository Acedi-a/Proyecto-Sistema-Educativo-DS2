using System.ComponentModel.DataAnnotations;

namespace EscuelaAPI.Modelo
{
    public class Usuario
    {
        [Key]
        public int idUsuario { get; set; }

        [StringLength(50)]
        public string nombreUsuario { get; set; }

        [StringLength(30)]
        public string nombre { get; set; }

        [StringLength(40)]
        public string apellido { get; set; }

        [EmailAddress]
        [StringLength(40)]
        public string? correo { get; set; }

        [StringLength(255)]
        public string? password { get; set; }

        [StringLength(200)]
        public string direccion { get; set; }

        [Phone]
        [StringLength(20)]
        public string telefono { get; set; }

        
        [StringLength(20)]
        public string rol { get; set; } // "Estudiante" o "Docente" uoperador

        public string ImagenPath { get; set; }

        public DateTime? fechaRegistro { get; set; } = DateTime.Now;
        public bool activo { get; set; } = true;
    }

}
