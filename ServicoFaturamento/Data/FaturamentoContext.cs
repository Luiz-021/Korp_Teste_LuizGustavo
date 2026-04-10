using Microsoft.EntityFrameworkCore;
using ServicoFaturamento.Models;

namespace ServicoFaturamento.Data;

public class FaturamentoContext : DbContext
{
    public FaturamentoContext(DbContextOptions<FaturamentoContext> options) : base(options) { }

    public DbSet<NotaFiscal> NotasFiscais { get; set; }
    public DbSet<ItemNotaFiscal> ItensNotaFiscal { get; set; }
}