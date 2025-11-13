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
    public class UserRoleController : ControllerBase
    {

        private readonly IConfiguration _configuration;

        public UserRoleController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [Authorize]

        [HttpPost]
        public IActionResult GetUserRole()
        {
            var roles = new List<Dictionary<string, object>>();

            try
            {


                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string query = "SELECT * FROM tbl_userrole WHERE status ='1'";

                using var cmd = new MySqlCommand(query, connection);

                using var reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    var role = new Dictionary<string, object>();

                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        role[reader.GetName(i)] = reader.GetValue(i);
                    }

                    roles.Add(role);
                }

                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        //[Authorize]
        [HttpPost]
        public IActionResult GetUserRoleById([FromBody] UserRoleRequest request)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("Default");
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string selectQuery = "SELECT * FROM tbl_userrole WHERE id = @id ";

                using var command = new MySqlCommand(selectQuery, connection);
                command.Parameters.AddWithValue("@id", request.id);

                using var reader = command.ExecuteReader();
                if (!reader.HasRows)
                {
                    return NotFound(new { error = "User role not found" });
                }

                var result = new Dictionary<string, object>();
                while (reader.Read())
                {
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        result[reader.GetName(i)] = reader.GetValue(i);
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        //[Authorize]f

        [HttpPost]
        public async Task<IActionResult> AddUserRole([FromBody] AddUserRoleRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var insertQuery = @"
                INSERT INTO tbl_userrole (userrole, status, locationid)
                VALUES (@userrole, @status, @locationid)";

                using var command = new MySqlCommand(insertQuery, connection);
                command.Parameters.AddWithValue("@userrole", request.UserRole);
                command.Parameters.AddWithValue("@status", request.Status);
                command.Parameters.AddWithValue("@locationid", request.LocationId);

                await command.ExecuteNonQueryAsync();

                return Ok(new { message = "User Role Added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        


        //[Authorize]

        [HttpPost]
        public async Task<IActionResult> UpdateUserRoles([FromBody] UpdateUserRoleRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                foreach (var role in request.Product)
                {
                    var updateQuery = @"
                    UPDATE tbl_userrole 
                    SET 
                        status = @status,
                        adminpanel = @adminpanel,
                        cashierpanel = @cashierpanel,
                        `release` = @release,
                        profileedit = @profileedit,
                        cardvalidation = @cardvalidation,
                        voidsale = @voidsale,
                        inventory = @inventory,
                        salesenable = @salesenable,
                        zoutaccess = @zoutaccess,
                        discountaccess = @discountaccess,
                        fulltransactionaccess = @fulltransactionaccess,
                        refundaccess = @refundaccess
                    WHERE id = @id AND locationid = @locationid";

                    using var command = new MySqlCommand(updateQuery, connection);
                    command.Parameters.AddWithValue("@status", role.Status);
                    command.Parameters.AddWithValue("@adminpanel", role.AdminPanel);
                    command.Parameters.AddWithValue("@cashierpanel", role.CashierPanel);
                    command.Parameters.AddWithValue("@release", role.Release);
                    command.Parameters.AddWithValue("@profileedit", role.ProfileEdit);
                    command.Parameters.AddWithValue("@cardvalidation", role.CardValidation);
                    command.Parameters.AddWithValue("@voidsale", role.VoidSale);
                    command.Parameters.AddWithValue("@inventory", role.Inventory);
                    command.Parameters.AddWithValue("@salesenable", role.SalesEnable);
                    command.Parameters.AddWithValue("@zoutaccess", role.ZOutAccess);
                    command.Parameters.AddWithValue("@discountaccess", role.DiscountAccess);
                    command.Parameters.AddWithValue("@fulltransactionaccess", role.FullTransactionAccess);
                    command.Parameters.AddWithValue("@refundaccess", role.RefundAccess);
                    command.Parameters.AddWithValue("@id", role.Id);
                    command.Parameters.AddWithValue("@locationid", request.LocationId);

                    await command.ExecuteNonQueryAsync();
                }

                return Ok(new { message = "User roles updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }






    }


}
