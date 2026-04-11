namespace ServicoFaturamento.Models;

public class NotaFiscal
{
    public int Id { get; set; }
    
    public int Numero { get; set; } 
    
    public string Status { get; set; } = "Aberta"; 
    
    public List<ItemNotaFiscal> Itens { get; set; } = new();
}