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
}