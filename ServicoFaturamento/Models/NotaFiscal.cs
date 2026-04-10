namespace ServicoFaturamento.Models;

public class NotaFiscal
{
    public int Id { get; set; }
    
    // O teste pede numeração sequencial
    public int Numero { get; set; } 
    
    // O teste pede status inicial "Aberta"
    public string Status { get; set; } = "Aberta"; 
    
    // Uma nota fiscal pode ter vários itens
    public List<ItemNotaFiscal> Itens { get; set; } = new();
}