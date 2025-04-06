using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CertificateManagement.Core.Models
{
    public class Certificate
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public uint CertificateId { get; set; } // ID из блокчейна

        [Required]
        public string IssuedTo { get; set; } // Адрес получателя

        [Required]
        public string Issuer { get; set; } // Адрес отправителя

        [Required]
        [MaxLength(68)]
        public string BlockchainHash { get; set; } // Можно оставить для хэша транзакции

        [Required]
        [MaxLength(46)]
        public string IpfsHash { get; set; }

        [Required]
        public JsonDocument Metadata { get; set; }

        public DateTime IssueDate { get; set; } // Дата выпуска в блокчейне

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
