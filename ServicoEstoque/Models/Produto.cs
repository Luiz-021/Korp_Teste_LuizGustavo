namespace ServicoEstoque.Models;

public class Produto
{
    public int Id { get; set; } // Chave primária para o banco
    public string Codigo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public int Saldo { get; set; }
}