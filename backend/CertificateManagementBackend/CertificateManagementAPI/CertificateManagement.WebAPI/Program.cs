using CertificateManagement.WebAPI.Contexts;
using Ipfs.Http;
using Microsoft.EntityFrameworkCore;

namespace CertificateManagement.WebAPI
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Добавляем CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000") // Укажи адрес фронтенда
                              .AllowAnyMethod()
                              .AllowAnyHeader();
                    });
            });

            // Добавляем сервисы
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Настраиваем PostgreSQL
            builder.Services.AddDbContext<CertificateDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            var app = builder.Build();

            // Настройка middleware
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseRouting();
            app.UseCors("AllowFrontend"); // Включаем CORS
            app.UseHttpsRedirection();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();


        }
    }
}
