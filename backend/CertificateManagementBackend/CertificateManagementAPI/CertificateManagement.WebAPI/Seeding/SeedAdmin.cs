using CertificateManagement.Core.Models;
using CertificateManagement.WebAPI.Contexts;

namespace CertificateManagement.WebAPI.Seeding;

public static class SeedAdmin
{
    public static async Task InitializeAsync(CertificateDbContext context, IConfiguration config)
    {
        var adminAddress = config["Admin:WalletAddress"]?.ToLower();

        if (string.IsNullOrWhiteSpace(adminAddress))
            throw new Exception(
                "❌ Admin wallet address is not configured in appsettings.json or environment variables");

        var exists = context.Users.Any(u => u.WalletAddress.ToLower() == adminAddress);

        if (!exists)
        {
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                WalletAddress = adminAddress,
                Role = UserRole.Admin,
                Nonce = Guid.NewGuid().ToString(),
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();

            Console.WriteLine($"✅ Seeded admin user: {adminAddress}");
        }
        else
        {
            Console.WriteLine($"ℹ️ Администратор уже существует: {adminAddress}");
        }
    }
}