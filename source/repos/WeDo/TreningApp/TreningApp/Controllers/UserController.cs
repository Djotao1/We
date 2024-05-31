using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TreningApp.Data;
using TreningApp.Models;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly string _jwtSecret; // Secret key for JWT token

    public AuthController(AppDbContext context)
    {
        _context = context;
        _jwtSecret = GenerateJwtSecret(); // Generate JWT secret key
    }

    // Method to generate JWT secret key
    private string GenerateJwtSecret()
    {
        byte[] keyBytes = new byte[32]; // 128 bits key size
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(keyBytes);
        }
        return Convert.ToBase64String(keyBytes);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserForRegistrationDto model)
    {
        if (await _context.Users.AnyAsync(x => x.Username == model.Username))
        {
            return BadRequest("Username already exists");
        }

        // Generate salt
        byte[] salt = GenerateSalt();

        // Hash password with salt
        string hashedPassword = HashPassword(model.Password, salt);

        var newUser = new User
        {
            Username = model.Username,
            Email = model.Email,
            Phone = model.Phone,
            FirstName = model.FirstName,
            LastName = model.LastName,
            PasswordSalt = Convert.ToBase64String(salt),
            PasswordHash = hashedPassword
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return StatusCode(201);
    }

    // Method to generate salt
    private byte[] GenerateSalt()
    {
        byte[] salt = new byte[16]; // You can adjust the size of the salt
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }
        return salt;
    }

    // Method to hash password with salt
    private string HashPassword(string password, byte[] salt)
    {
        using (var hmac = new HMACSHA512(salt))
        {
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hash);
        }
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserForLoginDto model)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == model.Username);

        if (user == null)
        {
            return BadRequest("Invalid username or password");
        }

        // Validate the password
        if (!VerifyPassword(model.Password, user.PasswordHash, Convert.FromBase64String(user.PasswordSalt)))
        {
            return BadRequest("Invalid username or password");
        }

        // Password is valid, generate JWT token
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSecret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // User ID claim
            new Claim(ClaimTypes.Name, user.Username) // Username claim
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return Ok(new { Token = tokenString });
    }


    // Method to verify password
    private bool VerifyPassword(string enteredPassword, string hashedPassword, byte[] salt)
    {
        using (var hmac = new HMACSHA512(salt))
        {
            byte[] computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(enteredPassword));
            return hashedPassword == Convert.ToBase64String(computedHash);
        }
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }
}
