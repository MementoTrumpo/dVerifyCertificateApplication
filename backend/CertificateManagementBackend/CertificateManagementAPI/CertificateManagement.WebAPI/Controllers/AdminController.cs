using CertificateManagement.WebAPI.Contexts;
using CertificateManagement.WebAPI.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CertificateManagement.WebAPI.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly CertificateDbContext _context;

    public AdminController(CertificateDbContext context)
    {
        _context = context;
    }
        
    [HttpPost("setRole")]
    public async Task<IActionResult> SetUserRole([FromBody] SetUpUserRoleRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => 
            u.WalletAddress.ToLower() == request.WalletAddress.ToLower(), cancellationToken);
        if (user is null)
        {
            return NotFound("Пользователь не найден!");
        }
        
        user.Role = request.NewRole;
        await _context.SaveChangesAsync(cancellationToken);

        return Ok("Роль назначена!");
    }
}