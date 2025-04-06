using CertificateManagement.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace CertificateManagement.WebAPI.Contexts
{
    public class CertificateDbContext : DbContext
    {
        public CertificateDbContext(DbContextOptions<CertificateDbContext> options) : base(options) { }
      
        public DbSet<User> Users { get; set; }

        public DbSet<Certificate> Certificates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(u => u.WalletAddress).IsUnique();
            modelBuilder.Entity<Certificate>().HasIndex(c => c.BlockchainHash).IsUnique();
        }
    }
}
