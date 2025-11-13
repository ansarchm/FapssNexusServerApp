using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace fabsss.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] fabsss.Models.LoginRequest request)
        {
            var connectionString = _configuration.GetConnectionString("Default");

            try
            {
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = @"
                    SELECT c.id, c.username, u.id AS userroleid, u.userrole
                    FROM tbl_cash c 
                    JOIN tbl_userrole u ON c.userrole = u.id
                    WHERE c.username = @username 
                    AND c.password = @password 
                    AND u.status = 1 
                    AND c.status = 1";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@username", request.Username);
                cmd.Parameters.AddWithValue("@password", request.Password); // 🔑 hash if needed!

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    var id = reader["id"].ToString();
                    var username = reader["username"].ToString();
                    var userroleid = reader["userroleid"].ToString();
                    var userrole = reader["userrole"].ToString();

                    var token = GenerateJwtToken(id);
                    return Ok(new { token, id, username, userroleid, userrole });
                }

                return Unauthorized(new { error = "Invalid credentials" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private string GenerateJwtToken(string id)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("id", id),
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // 🔧 Optional: Builds a dynamic connection string for a user's DB
        private string GetUserDatabaseConnection(string dbname)
        {
            var connFront = _configuration.GetConnectionString("UserConnectionfront");
            var connLast = _configuration.GetConnectionString("UserConnectionlast");

            return connFront + dbname + connLast;
        }
    }
}
