using EscuelaAPI.Data;
using EscuelaAPI.Modelo;
using EscuelaAPI.Modelo.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace EscuelaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagoController : ControllerBase
    {
        private readonly DbConexion dbconexion;

        public PagoController(DbConexion dc)
        {
            dbconexion = dc;
        }


      // GET: api/pagos/pendientes/{estudianteId}
    [HttpGet("pendientes/{estudianteId}")]
    public async Task<ActionResult<List<PagoDTO>>> GetPagosPendientes(int estudianteId)
    {
        var pagos = await dbconexion.Pago
            .Where(p => p.idEstudiante == estudianteId && p.estado == "Pendiente")
            .Include(p => p.Estudiante)
            .Select(p => new PagoDTO
            {
                IdPago = p.idPago,
                Monto = p.monto,
                Estado = p.estado,
                Fecha = p.fecha,
                NombreEstudiante = p.Estudiante.nombre + " " + p.Estudiante.apellido
            })
            .ToListAsync();

        return Ok(pagos);
    }
    
    // GET: api/pagos/pagados/{estudianteId}
    [HttpGet("pagados/{estudianteId}")]
    public async Task<ActionResult<List<PagoDTO>>> GetPagosPagados(int estudianteId)
    {
        var pagos = await dbconexion.Pago
            .Where(p => p.idEstudiante == estudianteId && p.estado == "Pagado")
            .Include(p => p.Estudiante)
            .Select(p => new PagoDTO
            {
                IdPago = p.idPago,
                Monto = p.monto,
                Estado = p.estado,
                Fecha = p.fecha,
                NombreEstudiante = p.Estudiante.nombre + " " + p.Estudiante.apellido
            })
            .ToListAsync();

        return Ok(pagos);
    }

    // PUT: api/pagos/pagar/{pagoId}
    [HttpPut("pagar/{pagoId}")]
    public async Task<ActionResult<PagoDTO>> PagarPago(int pagoId)
    {
        // Buscamos el pago por su id
        var pago = await dbconexion.Pago
            .Include(p => p.Estudiante)
            .FirstOrDefaultAsync(p => p.idPago == pagoId);

        if (pago == null)
        {
            return NotFound("Pago no encontrado");
        }

        if (pago.estado == "Pagado")
        {
            return BadRequest("El pago ya ha sido realizado");
        }

        // Actualizamos el estado del pago a 'Pagado'
        pago.estado = "Pagado";
        // Opcional: actualizar la fecha de pago al momento actual
        pago.fecha = DateTime.Now;

        dbconexion.Pago.Update(pago);
        await dbconexion.SaveChangesAsync();

        // Devolvemos un DTO actualizado
        var pagoActualizado = new PagoDTO
        {
            IdPago = pago.idPago,
            Monto = pago.monto,
            Estado = pago.estado,
            Fecha = pago.fecha,
            NombreEstudiante = pago.Estudiante.nombre + " " + pago.Estudiante.apellido
        };

        return Ok(pagoActualizado);
    }
    
    // GET: api/pagos/comprobante/{pagoId}
    [HttpGet("comprobante/{pagoId}")]
    public async Task<ActionResult<PagoDTO>> GetComprobante(int pagoId)
    {
        var pago = await dbconexion.Pago
            .Include(p => p.Estudiante)
            .FirstOrDefaultAsync(p => p.idPago == pagoId);

        if (pago == null)
        {
            return NotFound();
        }

        var comprobante = new PagoDTO
        {
            IdPago = pago.idPago,
            Monto = pago.monto,
            Estado = pago.estado,
            Fecha = pago.fecha,
            NombreEstudiante = pago.Estudiante.nombre + " " + pago.Estudiante.apellido
        };

        return Ok(comprobante);
    }

    // GET: api/pagos/proximos/{estudianteId}
    [HttpGet("proximos/{estudianteId}")]
    public async Task<ActionResult<List<ProximoPagoDTO>>> GetProximosPagos(int estudianteId)
    {
        var ultimoPago = await dbconexion.Pago
            .Where(p => p.idEstudiante == estudianteId)
            .OrderByDescending(p => p.fecha)
            .FirstOrDefaultAsync();

        var proximasFechas = new List<ProximoPagoDTO>();
        DateTime fechaBase = ultimoPago?.fecha.AddMonths(1) ?? DateTime.Now;

        for (int i = 0; i < 3; i++)
        {
            proximasFechas.Add(new ProximoPagoDTO
            {
                FechaProximo = fechaBase.AddMonths(i + 1),
                Monto = ultimoPago?.monto ?? 0
            });
        }

        return Ok(proximasFechas);
    }

    // GET: api/pagos/alertas/{estudianteId}
    [HttpGet("alertas/{estudianteId}")]
    public async Task<ActionResult<AlertaPagoDTO>> GetAlertasPagos(int estudianteId)
    {
        var pagosVencidos = await dbconexion.Pago
            .Where(p => p.idEstudiante == estudianteId 
                    && p.estado == "Pendiente"
                    && p.fecha < DateTime.Now)
            .Select(p => new PagoDTO { 
                IdPago = p.idPago,
                Monto = p.monto,
                Fecha = p.fecha
            })
            .ToListAsync();

        var proximosPagos = await dbconexion.Pago
            .Where(p => p.idEstudiante == estudianteId
                    && p.estado == "Pendiente"
                    && p.fecha >= DateTime.Now
                    && p.fecha <= DateTime.Now.AddDays(7))
            .Select(p => new ProximoPagoDTO {
                FechaProximo = p.fecha,
                Monto = p.monto
            })
            .ToListAsync();

        var alertas = new AlertaPagoDTO
        {
            Vencidos = pagosVencidos,
            Proximos = proximosPagos
        };

        return Ok(alertas);
    }


    }
}