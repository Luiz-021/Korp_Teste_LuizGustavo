namespace ServicoEstoque.Models;

using System.ComponentModel.DataAnnotations;
public class Produto
{
    public int Id { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    
    [ConcurrencyCheck]
    public int Saldo { get; set; }
}