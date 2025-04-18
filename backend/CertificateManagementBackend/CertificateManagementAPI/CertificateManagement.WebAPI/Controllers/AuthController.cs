using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Nethereum.Signer;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CertificateManagement.WebAPI.Contexts;
using CertificateManagement.Core.Models;
using CertificateManagement.WebAPI.Dtos;
using Microsoft.EntityFrameworkCore;

namespace CertificateManagement.WebAPI.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly CertificateDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(CertificateDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.WalletAddress.ToLower() == request.Address.ToLower());

        if (user == null)
            return NotFound("Пользователь не зарегистрирован");

        var message = $"Authentication nonce: {user.Nonce}";
        var signer = new EthereumMessageSigner();
        var recoveredAddress = signer.EncodeUTF8AndEcRecover(message, request.Signature);

        if (!string.Equals(recoveredAddress, request.Address, StringComparison.OrdinalIgnoreCase))
            return Unauthorized("Подпись невалидна");

        // обновляем nonce, чтобы нельзя было повторно использовать подпись
        user.Nonce = Guid.NewGuid().ToString();
        await _context.SaveChangesAsync();

        var token = GenerateJwt(user);
        return Ok(new { token, role = user.Role.ToString() });
    }

    
    [HttpGet("nonce")]
    public async Task<IActionResult> GetNonce([FromQuery] string address)
    {
        var lower = address.ToLower();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.WalletAddress.ToLower() == lower);

        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                WalletAddress = lower,
                Role = UserRole.Verifier,
                Nonce = Guid.NewGuid().ToString()
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        return Ok(new { nonce = user.Nonce });
    }


    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"] ?? string.Empty));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.WalletAddress),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(6),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}