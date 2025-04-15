using CertificateManagement.Core.Models;

namespace CertificateManagement.WebAPI.Dtos;

public class SetUpUserRoleRequest
{
    public string WalletAddress { get; set; }
    public UserRole NewRole { get; set; }
}