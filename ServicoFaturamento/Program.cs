using Microsoft.EntityFrameworkCore;
using ServicoFaturamento.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<FaturamentoContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 

builder.Services.AddHttpClient("EstoqueClient", client =>
{
    client.BaseAddress = new Uri("http://localhost:5062"); 
});

builder.Services.AddCors(options => {
    options.AddPolicy("PermitirAngular", policy => {
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors("PermitirAngular");

app.UseAuthorization();
app.MapControllers();

app.Run();