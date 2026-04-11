using Microsoft.EntityFrameworkCore;
using ServicoEstoque.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<EstoqueContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers(); // Habilita o uso de Controllers
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options => {
    options.AddPolicy("PermitirAngular", policy => {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi(); // Essa é uma feature mais nova do .NET, pode manter!
}

app.UseHttpsRedirection();
app.UseRouting();

// APLIQUE ISSO AQUI (Tem que vir antes do Authorization e do MapControllers!):
app.UseCors("PermitirAngular");

app.UseAuthorization();
app.MapControllers();

app.Run();