using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertificateManagement.Core.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(42)]
        public string WalletAddress { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public UserRole Role { get; set; } = UserRole.Verifier; 

        [Required]
        [MaxLength(128)]
        public string Nonce { get; set; } = Guid.NewGuid().ToString();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
