using fabsss.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Dapper;
using System.Xml.Linq;

namespace fabsss.Controllers
{
    [Route("api/[Action]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IConfiguration _configuration;

        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        //[Authorize]


        [HttpPost]
        public IActionResult GetUserById([FromBody] UserRequest request)
        {
            var user = new Dictionary<string, object>();

            try
            {
                string connectionString = _configuration.GetConnectionString("Default");
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string query = "SELECT * FROM tbl_cash WHERE id = @id AND locationid = @locationId";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", request.Id);
                cmd.Parameters.AddWithValue("@locationId", request.LocationId);

                using var reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        user[reader.GetName(i)] = reader.GetValue(i);
                    }

                    return Ok(user);
                }
                else
                {
                    return NotFound(new { error = "User not found" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        //[Authorize]

        [HttpPost]

        public IActionResult GetUser()
        {
            var users = new List<Dictionary<string, object>>();

            try
            {

                string connectionString = _configuration.GetConnectionString("Default");
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string query = "SELECT * FROM tbl_cash WHERE status='1'";

                using var cmd = new MySqlCommand(query, connection);

                using var reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    var user = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        user[reader.GetName(i)] = reader.GetValue(i);
                    }

                    users.Add(user);
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }



        //[Authorize]


        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] AddUserRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = @"
                INSERT INTO tbl_cash 
                (name, username, password, computername, status, userrole, courtesycard, courtesytype, courtesycount, locationid)
                VALUES
                (@name, @username, @password, @computername, @status, @userrole, @courtesycard, @courtesytype, @courtesycount, @locationid)";

                using var command = new MySqlCommand(query, connection);

                command.Parameters.AddWithValue("@name", request.Name);
                command.Parameters.AddWithValue("@username", request.Username);
                command.Parameters.AddWithValue("@password", request.Password);
                command.Parameters.AddWithValue("@computername", request.ComputerName);
                command.Parameters.AddWithValue("@status", request.Status);
                command.Parameters.AddWithValue("@userrole", request.UserRole);
                command.Parameters.AddWithValue("@courtesycard", request.CourtesyCard);
                command.Parameters.AddWithValue("@courtesytype", request.CourtesyType);
                command.Parameters.AddWithValue("@courtesycount", request.CourtesyCount);
                command.Parameters.AddWithValue("@locationid", request.LocationId);

                await command.ExecuteNonQueryAsync();

                return Ok(new { message = "User added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }



        //[Authorize]

        [HttpPost]
        public async Task<IActionResult> UpdateUserById([FromBody] UpdateUserRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = @"
                UPDATE tbl_cash 
                SET 
                    name = @name,
                    username = @username,
                    password = @password,
                    computername = @computername,
                    status = @status,
                    userrole = @userrole,
                    courtesycard = @courtesycard,
                    courtesytype = @courtesytype,
                    courtesycount = @courtesycount
                WHERE id = @id ";

                using var command = new MySqlCommand(query, connection);

                command.Parameters.AddWithValue("@name", request.Name);
                command.Parameters.AddWithValue("@username", request.Username);
                command.Parameters.AddWithValue("@password", request.Password);
                command.Parameters.AddWithValue("@computername", request.ComputerName);
                command.Parameters.AddWithValue("@status", request.Status);
                command.Parameters.AddWithValue("@userrole", request.UserRole);
                command.Parameters.AddWithValue("@courtesycard", request.CourtesyCard);
                command.Parameters.AddWithValue("@courtesytype", request.CourtesyType);
                command.Parameters.AddWithValue("@courtesycount", request.CourtesyCount);
                command.Parameters.AddWithValue("@id", request.Id);
                command.Parameters.AddWithValue("@locationid", request.LocationId);

                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                    return Ok(new { message = "User updated successfully" });
                else
                    return NotFound(new { error = "User not found or update failed" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

    }
}
