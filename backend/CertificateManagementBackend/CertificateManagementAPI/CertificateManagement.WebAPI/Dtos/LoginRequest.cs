namespace CertificateManagement.WebAPI.Dtos;

public class LoginRequest
{
    public string Address { get; set; } // Адрес пользователя в MetaMask
    public string Signature { get; set; }// Подпись
    public string Message { get; set; }// Сообщение
}