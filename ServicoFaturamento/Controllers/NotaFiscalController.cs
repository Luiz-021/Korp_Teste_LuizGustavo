using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServicoFaturamento.Data;
using ServicoFaturamento.Models;

namespace ServicoFaturamento.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotaFiscalController : ControllerBase
{
    private readonly FaturamentoContext _context;

    public NotaFiscalController(FaturamentoContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotaFiscal>>> GetNotasFiscais()
    {
        return await _context.NotasFiscais.Include(n => n.Itens).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<NotaFiscal>> PostNotaFiscal(NotaFiscal notaFiscal)
    {
        var ultimoNumero = await _context.NotasFiscais.MaxAsync(n => (int?)n.Numero) ?? 0;
        notaFiscal.Numero = ultimoNumero + 1;

        notaFiscal.Status = "Aberta";

        _context.NotasFiscais.Add(notaFiscal);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetNotasFiscais), new { id = notaFiscal.Id }, notaFiscal);
    }
}