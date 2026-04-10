using Microsoft.EntityFrameworkCore;
using ServicoFaturamento.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<FaturamentoContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Precisaremos instalar o pacote do Swagger de novo aqui!

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();