using System.ComponentModel.DataAnnotations;

namespace CertificateManagement.WebAPI.Dtos;

public class LoginRequest
{
    [Required]
    public string Address { get; set; } // Адрес пользователя в MetaMask
    [Required]
    public string Signature { get; set; }// Подпись
}