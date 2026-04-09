using Microsoft.EntityFrameworkCore;
using ServicoEstoque.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<EstoqueContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers(); // Habilita o uso de Controllers
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi(); // Essa é uma feature mais nova do .NET, pode manter!
}

app.UseHttpsRedirection();
app.UseAuthorization();

// A LINHA MÁGICA: Mapeia as rotas para as classes Controller que vamos criar
app.MapControllers(); 

app.Run();