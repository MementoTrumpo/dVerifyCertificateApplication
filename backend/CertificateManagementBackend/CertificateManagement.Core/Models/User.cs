using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertificateManagement.Core.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(42)]
        public string WalletAddress { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
