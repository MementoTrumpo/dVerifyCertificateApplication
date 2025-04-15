using CertificateManagement.WebAPI.Contexts;

namespace CertificateManagement.WebAPI.Seeding;

public static class SeedAdminExtensions
{
    public static async Task UseSeedAdminAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var dbContext = scope.ServiceProvider.GetRequiredService<CertificateDbContext>();
        var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        await SeedAdmin.InitializeAsync(dbContext, config);
    }
}