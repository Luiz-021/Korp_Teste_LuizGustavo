using System.Text;
using System.Text.Json;
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
    private readonly IHttpClientFactory _httpClientFactory;

    public NotaFiscalController(FaturamentoContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
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

    [HttpPost("{id}/imprimir")]
    public async Task<IActionResult> ImprimirNota(int id)
    {
        var nota = await _context.NotasFiscais.Include(n => n.Itens).FirstOrDefaultAsync(n => n.Id == id);
        if (nota == null) return NotFound("Nota fiscal não encontrada.");
        
        if (nota.Status != "Aberta") return BadRequest("Apenas notas com status 'Aberta' podem ser impressas.");

        await Task.Delay(2000);

        var client = _httpClientFactory.CreateClient("EstoqueClient");

        try
        {
            var payload = nota.Itens.Select(i => new { ProdutoId = i.ProdutoId, Quantidade = i.Quantidade }).ToList();
            
            var response = await client.PostAsJsonAsync("/api/Produto/baixar-estoque", payload);

            if (!response.IsSuccessStatusCode)
            {
                var erroDoEstoque = await response.Content.ReadAsStringAsync();
                return BadRequest($"Falha na reserva de estoque: {erroDoEstoque}");
            }
        }
        catch (HttpRequestException)
        {
            return StatusCode(503, "O Serviço de Estoque está indisponível. A nota não pode ser fechada agora.");
        }

        nota.Status = "Fechada";
        await _context.SaveChangesAsync();

        return Ok(new { Mensagem = "Nota fiscal impressa com sucesso e estoque atualizado!", Nota = nota });
    }
}