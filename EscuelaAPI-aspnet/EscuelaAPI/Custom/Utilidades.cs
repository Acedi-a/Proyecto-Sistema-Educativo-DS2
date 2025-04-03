using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using EscuelaAPI.Data;
using EscuelaAPI.Modelo;




namespace EscuelaAPI.Custom
{
    public class Utilidades
    {
        private readonly IConfiguration configuration;


        public Utilidades(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        public string encriptar(string texto)
        {
            using(SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(texto));

                StringBuilder builder = new StringBuilder();

                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }

                return builder.ToString();
            }       
        }

        public string generarJWT(Usuario u)
        {
            //crear info del usuario para el token
            var userClaims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, u.idUsuario.ToString()),
                new Claim(ClaimTypes.Email, u.correo.ToString())

            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            //crear detalle token

            var jwtConfig = new JwtSecurityToken(
                claims: userClaims,
                expires: DateTime.UtcNow.AddMinutes(2),
                signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(jwtConfig); 
        }



    }
}
