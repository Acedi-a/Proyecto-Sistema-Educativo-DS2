using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EscuelaAPI.Modelo
{
    public class Operador : Usuario
    {

        public Operador()
        {
            rol = "operador";
        }

        public string turnoLaboral { get; set; }

    }
}
