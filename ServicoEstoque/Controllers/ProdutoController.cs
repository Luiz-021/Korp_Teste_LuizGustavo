using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServicoEstoque.Data;
using ServicoEstoque.Models;

namespace ServicoEstoque.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutoController : ControllerBase
{
    private readonly EstoqueContext _context;

    public ProdutoController(EstoqueContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
    {
        return await _context.Produtos.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Produto>> PostProduto(Produto produto)
    {
        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProdutos), new { id = produto.Id }, produto);
    }

    [HttpPost("baixar-estoque")]
    public async Task<IActionResult> BaixarEstoque(List<BaixaEstoqueRequest> itensParaBaixa)
    {
        foreach (var item in itensParaBaixa)
        {
            var produto = await _context.Produtos.FindAsync(item.ProdutoId);
            if (produto == null) return NotFound($"Produto {item.ProdutoId} não encontrado.");
            
            if (produto.Saldo < item.Quantidade) 
                return BadRequest($"Saldo insuficiente para o produto {produto.Descricao}.");

            produto.Saldo -= item.Quantidade; 
        }

        try
        {
            await Task.Delay(3000); // Temporário para testar concorrência
            await _context.SaveChangesAsync();
            return Ok("Estoque atualizado com sucesso.");
        }
        catch (DbUpdateConcurrencyException) 
        {
            return Conflict("Erro de concorrência: O estoque foi modificado por outra transação simultânea. Tente novamente.");
        }
    }

    [HttpPut("{id}")]
    public IActionResult AtualizarProduto(int id, [FromBody] Produto produtoAtualizado)
    {
        if (id != produtoAtualizado.Id) return BadRequest();

        var produtoExistente = _context.Produtos.Find(id);
        if (produtoExistente == null) return NotFound();

        produtoExistente.Saldo = produtoAtualizado.Saldo;

        _context.SaveChanges();
        return Ok(produtoExistente);
    }
}