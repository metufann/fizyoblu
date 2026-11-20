using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FizyoBlu.Backend.Entities;
using Microsoft.IdentityModel.Tokens;

namespace FizyoBlu.Backend.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(User user)
    {
        var secret = _config["Jwt:Secret"] ?? "FizyoBluSuperSecretKey2024SecureJwtTokenKeyForPilatesStudio!";
        var issuer = _config["Jwt:Issuer"] ?? "FizyoBluApi";
        var audience = _config["Jwt:Audience"] ?? "FizyoBluFrontend";
        var expirationHours = int.TryParse(_config["Jwt:ExpirationHours"], out var hours) ? hours : 24;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expirationHours),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
