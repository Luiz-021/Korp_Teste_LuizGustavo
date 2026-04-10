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
    private readonly IHttpClientFactory _httpClientFactory; // <- Adicionado

    public NotaFiscalController(FaturamentoContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClientFactory = httpClientFactory; // <- Adicionado
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
        if (nota.Status != "Aberta") return BadRequest("Apenas notas Abertas podem ser impressas.");

        var payload = nota.Itens.Select(i => new { i.ProdutoId, i.Quantidade }).ToList();
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var client = _httpClientFactory.CreateClient("EstoqueClient");

        try
        {
            var response = await client.PostAsync("/api/Produto/baixar-estoque", content);

            if (!response.IsSuccessStatusCode)
            {
                var erroDoEstoque = await response.Content.ReadAsStringAsync();
                return BadRequest($"Erro no Estoque: {erroDoEstoque}");
            }
        }
        catch (HttpRequestException)
        {
            return StatusCode(503, "O Serviço de Estoque está indisponível no momento. A nota não pôde ser fechada. Tente novamente mais tarde.");
        }

        
        nota.Status = "Fechada";
        await _context.SaveChangesAsync();

        return Ok(new { Mensagem = "Nota fiscal impressa com sucesso e saldo atualizado!", Nota = nota });
    }
}