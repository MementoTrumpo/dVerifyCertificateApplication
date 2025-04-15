using CertificateManagement.Core.Models;
using CertificateManagement.WebAPI.Contexts;
using CertificateManagement.WebAPI.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text.Json;
using System.Threading.Tasks;

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
    public async Task<IActionResult> GetCertificateByBlockchainId(uint certificateId)
    {
        var certificate = await _context.Certificates
            .FirstOrDefaultAsync(c => c.CertificateId == certificateId);

        if (certificate == null)
        {
            return NotFound("Сертификат не найден");
        }

        return Ok(certificate);
    }
}
