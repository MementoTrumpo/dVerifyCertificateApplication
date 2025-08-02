using System.Security.Claims;
using System.Text.Json;
using CertificateManagement.Core.Models;
using CertificateManagement.WebAPI.Contexts;
using CertificateManagement.WebAPI.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CertificateManagement.WebAPI.Controllers;

[Route("api/certificates")]
[ApiController]
public class CertificatesController : ControllerBase
{
    private readonly CertificateDbContext _context;

    public CertificatesController(CertificateDbContext context)
    {
        _context = context;
    }


    [HttpPost]
    public async Task<IActionResult> UploadCertificate([FromBody] CertificateRequest request)
    {
        if (request is null || request.CertificateId == 0 || string.IsNullOrEmpty(request.BlockchainHash))
        {
            return BadRequest("Некорректные данные");
        }

        try
        {
            var certificate = new Certificate
            {
                CertificateId = request.CertificateId,
                IssuedTo = request.IssuedTo,
                Issuer = request.Issuer,
                BlockchainHash = request.BlockchainHash,
                IpfsHash = request.IpfsHash,
                IssueDate = request.IssueDate,
                Metadata = JsonDocument.Parse(JsonSerializer.Serialize(request.Metadata))
            };

            _context.Certificates.Add(certificate);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCertificateByBlockchainId), new { certificateId = certificate.CertificateId }, certificate);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка сохранения сертификата: {ex.Message}");
            return StatusCode(500, "Ошибка сервера");
        }
    }



    [HttpGet("{certificateId}")]
    public async Task<IActionResult> GetCertificateByBlockchainId(uint certificateId, CancellationToken cancellationToken)
    {
        var certificate = await _context.Certificates
            .FirstOrDefaultAsync(c => c.CertificateId == certificateId, cancellationToken);

        if (certificate == null)
        {
            return NotFound("Сертификат не найден");
        }

        return Ok(certificate);
    }
    
    [Authorize(Roles = "Issuer")]
    [HttpPut("{certificateId}/revoke")]
    public async Task<IActionResult> RevokeCertificate(uint certificateId, CancellationToken cancellationToken)
    {
        var certificate = await _context.Certificates.FirstOrDefaultAsync(c => c.CertificateId == certificateId, cancellationToken);
        if (certificate is null)
        {
            return NotFound("Сертификат не найден");
        }

        if (certificate.IsRevoked)
        {
            return BadRequest("Сертификат уже отозван");
        }

        certificate.IsRevoked = true;
        await _context.SaveChangesAsync(cancellationToken);
        return Ok("Сертификат успешно отозван");
    }
    
    [HttpGet("issued")]
    [Authorize(Roles = "Issuer")]
    public async Task<IActionResult> GetIssuedByMe(CancellationToken cancellationToken)
    {
        var issuerAddress = User.FindFirstValue(ClaimTypes.NameIdentifier)?.ToLower();

        if (string.IsNullOrWhiteSpace(issuerAddress))
            return Unauthorized("Не удалось определить адрес пользователя");

        var issuedCerts = await _context.Certificates
            .Where(c => c.Issuer.ToLower() == issuerAddress.ToLower())
            .OrderByDescending(c => c.IssueDate)
            .ToListAsync(cancellationToken);

        return Ok(issuedCerts);
    }

    [HttpGet("owned-by/{address}")]
    public async Task<IActionResult> GetCertificatesByUser(string address)
    {
        var certs = await _context.Certificates
            .Where(c => c.IssuedTo.ToLower() == address.ToLower())
            .OrderByDescending(c => c.IssueDate)
            .ToListAsync();

        return Ok(certs);
    }

    [HttpGet("api/certificates/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var cert = await _context.Certificates.FindAsync(id);
        if (cert == null)
            return NotFound();

        return Ok(cert);
    }


}