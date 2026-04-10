using System.Text.Json.Serialization;

namespace ServicoFaturamento.Models;

public class ItemNotaFiscal
{
    public int Id { get; set; }
    
    // O ID do produto que está lá no banco de dados do Serviço de Estoque
    public int ProdutoId { get; set; } 
    public int Quantidade { get; set; }

    // Relação com a Nota Fiscal (Chave Estrangeira)
    public int NotaFiscalId { get; set; }
    
    [JsonIgnore] // Evita loop infinito quando o Swagger for mostrar o JSON
    public NotaFiscal? NotaFiscal { get; set; }
}