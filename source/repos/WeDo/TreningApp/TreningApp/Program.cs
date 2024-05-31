using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TreningApp.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Registracija AppDbContext sa SQLite konekcijom
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=trainingTracker.db")); // Vaš SQLite connection string

// Dodavanje kontrolera
builder.Services.AddControllers();

// Konfiguracija CORS-a
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Generate a random 128-bit key for JWT token validation and generation
var randomBytes = new byte[16];
using (var rng = new RNGCryptoServiceProvider())
{
    rng.GetBytes(randomBytes);
}
var base64SecretKey = Convert.ToBase64String(randomBytes);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false, // Postavite na true ako želite da validirate izdavača (Issuer)
        ValidateAudience = false, // Postavite na true ako želite da validirate auditorijum (Audience)
        ValidateLifetime = true, // Postavite na true ako želite da validirate trajanje tokena
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(base64SecretKey)) // Postavite svoj tajni ključ ovde
    };
});

// Konfiguracija Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowAll");

app.MapControllers();

app.Run();
