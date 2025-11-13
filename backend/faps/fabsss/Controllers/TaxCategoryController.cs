using fabsss.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json;

namespace ProductApi.Controllers
{
    [ApiController]
    [Route("api/[Action]")]
    public class TaxCategoryController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public TaxCategoryController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Get all tax categories
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetTaxCategories()
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Token missing user ID" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string query = @"SELECT * FROM tbl_taxcategory 
                                WHERE status = '1'
                                ORDER BY id ASC";

                using var cmd = new MySqlCommand(query, connection);
                using var reader = await cmd.ExecuteReaderAsync();

                var taxCategories = new List<Dictionary<string, object>>();
                while (await reader.ReadAsync())
                {
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                    }
                    taxCategories.Add(row);
                }

                Console.WriteLine($"✅ Found {taxCategories.Count} tax categories");

                return Ok(taxCategories);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Get tax category by ID
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetTaxCategoryById([FromBody] JsonElement request)
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Token missing user ID" });
                }

                if (!request.TryGetProperty("Id", out JsonElement idElement))
                {
                    return BadRequest(new { error = "Tax Category ID is required" });
                }

                var id = idElement.GetInt32();
                if (id == 0)
                {
                    return BadRequest(new { error = "Tax Category ID is required" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string query = @"SELECT * FROM tbl_taxcategory WHERE id = @id";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", id);

                using var reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                {
                    return NotFound(new { error = "Tax category not found" });
                }

                var taxCategory = new Dictionary<string, object>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    taxCategory[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                }

                return Ok(taxCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Add new tax category
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddTaxCategory([FromBody] TaxCategoryModel taxCategory)
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                var userName = User.FindFirst("name")?.Value ?? "Admin";

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Token missing user ID" });
                }

                // Validation
                if (string.IsNullOrWhiteSpace(taxCategory.taxid))
                {
                    return BadRequest(new { error = "Tax ID is required" });
                }

                if (string.IsNullOrWhiteSpace(taxCategory.taxcategory))
                {
                    return BadRequest(new { error = "Tax Category is required" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string insertQuery = @"
                    INSERT INTO tbl_taxcategory 
                    (taxid, taxcategory, taxpercent, description, status, locationid, lastupdateddate, lastupdateduser) 
                    VALUES 
                    (@taxid, @taxcategory, @taxpercent, @description, @status, @locationid, @lastupdateddate, @lastupdateduser)";

                using var cmd = new MySqlCommand(insertQuery, connection);

                cmd.Parameters.AddWithValue("@taxid", taxCategory.taxid);
                cmd.Parameters.AddWithValue("@taxcategory", taxCategory.taxcategory);
                cmd.Parameters.AddWithValue("@taxpercent", taxCategory.taxpercent ?? 0);
                cmd.Parameters.AddWithValue("@description", taxCategory.description ?? "");
                cmd.Parameters.AddWithValue("@status", taxCategory.status ?? "1");
                cmd.Parameters.AddWithValue("@locationid", int.Parse(userId));
                cmd.Parameters.AddWithValue("@lastupdateddate", DateTime.Now);
                cmd.Parameters.AddWithValue("@lastupdateduser", userName);

                await cmd.ExecuteNonQueryAsync();

                Console.WriteLine("✅ Tax category added successfully");
                return Ok(new { message = "Tax category added successfully" });
            }
            catch (MySqlException ex) when (ex.Number == 1062)
            {
                return BadRequest(new { error = "Tax ID already exists" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error details: {ex.Message}");
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Update tax category
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UpdateTaxCategory([FromBody] TaxCategoryModel taxCategory)
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                var userName = User.FindFirst("name")?.Value ?? "Admin";

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Token missing user ID" });
                }

                if (taxCategory.id == 0)
                {
                    return BadRequest(new { error = "Tax Category ID is required" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string query = @"
                    UPDATE tbl_taxcategory SET 
                        taxid = @taxid,
                        taxcategory = @taxcategory,
                        taxpercent = @taxpercent,
                        description = @description,
                        status = @status,
                        lastupdateddate = @lastupdateddate,
                        lastupdateduser = @lastupdateduser
                    WHERE id = @id";

                using var cmd = new MySqlCommand(query, connection);

                cmd.Parameters.AddWithValue("@taxid", taxCategory.taxid);
                cmd.Parameters.AddWithValue("@taxcategory", taxCategory.taxcategory);
                cmd.Parameters.AddWithValue("@taxpercent", taxCategory.taxpercent ?? 0);
                cmd.Parameters.AddWithValue("@description", taxCategory.description ?? "");
                cmd.Parameters.AddWithValue("@status", taxCategory.status ?? "1");
                cmd.Parameters.AddWithValue("@lastupdateddate", DateTime.Now);
                cmd.Parameters.AddWithValue("@lastupdateduser", userName);
                cmd.Parameters.AddWithValue("@id", taxCategory.id);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    Console.WriteLine("✅ Tax category updated successfully");
                    return Ok(new { message = "Tax category updated successfully" });
                }
                else
                {
                    return NotFound(new { error = "Tax category not found" });
                }
            }
            catch (MySqlException ex) when (ex.Number == 1062)
            {
                return BadRequest(new { error = "Tax ID already exists" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error details: {ex.Message}");
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Delete tax category (soft delete)
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> DeleteTaxCategory([FromBody] JsonElement request)
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Token missing user ID" });
                }

                if (!request.TryGetProperty("Id", out JsonElement idElement))
                {
                    return BadRequest(new { error = "Tax Category ID is required" });
                }

                var id = idElement.GetInt32();
                if (id == 0)
                {
                    return BadRequest(new { error = "Tax Category ID is required" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string query = @"UPDATE tbl_taxcategory 
                                SET status = '0' 
                                WHERE id = @id";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", id);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    return Ok(new { message = "Tax category deleted successfully" });
                }
                else
                {
                    return NotFound(new { error = "Tax category not found" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }
    }
}