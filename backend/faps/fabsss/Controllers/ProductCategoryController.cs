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
    public class ProductCategoryController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ProductCategoryController(IConfiguration configuration)
        {
            _configuration = configuration;
        }



        [Authorize]
        [HttpPost]
        public async Task<IActionResult> InsertGameDetail([FromBody] List<GameItem> data)
        {
            var inserted = new List<string>();
            var updated = new List<string>();

            try
            {
                // 🧠 Extract user ID from JWT
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { error = "Token missing user ID." });

                // ✅ Get client DB connection based on user ID
                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                // Get existing categories
                var uniqueCategories = data.Select(d => d.Category).Distinct().ToList();
                var existingCategories = new List<string>();
                var selectCategoryQuery = $"SELECT categoryname FROM tbl_productcat WHERE categoryname IN ('{string.Join("','", uniqueCategories)}')";
                using var cmdCat = new MySqlCommand(selectCategoryQuery, connection);
                using var reader = await cmdCat.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    existingCategories.Add(reader.GetString("categoryname"));
                }
                reader.Close();

                // Insert new categories
                var newCategories = uniqueCategories.Except(existingCategories).ToList();
                if (newCategories.Any())
                {
                    var insertCatQuery = "INSERT INTO tbl_productcat (categoryname, status, locationid) VALUES (@category, '1', @locationid)";
                    foreach (var category in newCategories)
                    {
                        using var insertCmd = new MySqlCommand(insertCatQuery, connection);
                        insertCmd.Parameters.AddWithValue("@category", category);
                        insertCmd.Parameters.AddWithValue("@locationid", 1); // Optional: make dynamic
                        await insertCmd.ExecuteNonQueryAsync();
                    }
                }

                // Get existing game IDs
                var ids = data.Select(d => d.Id).ToList();
                if (!ids.Any())
                    return BadRequest(new { error = "No game IDs provided." });

                var existingIds = new List<int>();
                var checkIdsQuery = $"SELECT gameid FROM tbl_product WHERE gameid IN ({string.Join(",", ids)}) AND locationid = 1";
                using var checkCmd = new MySqlCommand(checkIdsQuery, connection);
                using var idReader = await checkCmd.ExecuteReaderAsync();
                while (await idReader.ReadAsync())
                {
                    existingIds.Add(idReader.GetInt32("gameid"));
                }
                idReader.Close();

                // Insert or update
                foreach (var item in data)
                {
                    if (existingIds.Contains(item.Id))
                    {
                        var updateQuery = @"UPDATE tbl_product 
                    SET productname = @name, category = @category, rate = @price 
                    WHERE gameid = @id AND locationid = 1";

                        using var updateCmd = new MySqlCommand(updateQuery, connection);
                        updateCmd.Parameters.AddWithValue("@name", item.Title);
                        updateCmd.Parameters.AddWithValue("@category", item.Category);
                        updateCmd.Parameters.AddWithValue("@price", item.Price);
                        updateCmd.Parameters.AddWithValue("@id", item.Id);
                        await updateCmd.ExecuteNonQueryAsync();
                        updated.Add(item.Id.ToString());
                    }
                    else
                    {
                        var insertQuery = @"INSERT INTO tbl_product 
                (gameid, productname, category, rate, ptype, tax, status, sequence, bonus, duration, cashbalance, taxtype, timebandtype, locationid)
                VALUES (@id, @name, @category, @rate, 'Card', '0', '1', '0', '0', @rate, @rate, 'Included', 'Flexible', 1)";

                        using var insertCmd = new MySqlCommand(insertQuery, connection);
                        insertCmd.Parameters.AddWithValue("@id", item.Id);
                        insertCmd.Parameters.AddWithValue("@name", item.Title);
                        insertCmd.Parameters.AddWithValue("@category", item.Category);
                        insertCmd.Parameters.AddWithValue("@rate", item.Price);
                        await insertCmd.ExecuteNonQueryAsync();
                        inserted.Add(item.Id.ToString());
                    }
                }

                return Ok(new { message = "Success", inserted, updated });
            }
            catch (Exception ex)
            {
                Console.WriteLine("InsertGameDetails Error: " + ex.Message);
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }






        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddProductCat([FromBody] ProductCategory data)
        {
            var inserted = new List<string>();
            var updated = new List<string>();

            try
            {
                // 🧠 Extract user ID from JWT
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { error = "Token missing user ID." });

                // ✅ Get client DB connection based on user ID
                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                // Get existing categories
                var selectCategoryQuery = $"SELECT * FROM tbl_productcat WHERE categoryname ={data.CategoryName} and status='1')";
                using var cmdCat = new MySqlCommand(selectCategoryQuery, connection);
                using var reader = await cmdCat.ExecuteReaderAsync();

                int rowCount = 0;
                while (await reader.ReadAsync())
                {
                    rowCount++;
                    // You can access row data here if needed, e.g. reader["columnname"]
                }
                if (rowCount == 0)
                {
                    var insertCatQuery = "INSERT INTO tbl_productcat (categoryname, status, locationid) VALUES (@category, '1', @locationid)";

                    using var insertCmd = new MySqlCommand(insertCatQuery, connection);
                    insertCmd.Parameters.AddWithValue("@category", data.CategoryName);
                    insertCmd.Parameters.AddWithValue("@locationid", 1); // Optional: make dynamic
                    await insertCmd.ExecuteNonQueryAsync();


                    return Ok(new { message = "Success", inserted });




                  
                }
                else
                {
                    return StatusCode(500, new { error = "Insertion error", detail = "Category already exist"});

                }

                

                
            }
            catch (Exception ex)
            {
                Console.WriteLine("InsertGameDetails Error: " + ex.Message);
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }




        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UpdateProductCat([FromBody] ProductCategory data)
        {
            var inserted = new List<string>();
            var updated = new List<string>();

            try
            {
                // 🧠 Extract user ID from JWT
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { error = "Token missing user ID." });

                // ✅ Get client DB connection based on user ID
                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                // Get existing categories
                var selectCategoryQuery = $"SELECT * FROM tbl_productcat WHERE categoryname ={data.CategoryName} and status='1')";
                using var cmdCat = new MySqlCommand(selectCategoryQuery, connection);
                using var reader = await cmdCat.ExecuteReaderAsync();

                int rowCount = 0;
                while (await reader.ReadAsync())
                {
                    rowCount++;
                    // You can access row data here if needed, e.g. reader["columnname"]
                }
                if (rowCount == 0)
                {
                    var updateQuery = @"UPDATE tbl_product SET  category = @category  WHERE id =@id ";

                    using var updateCmd = new MySqlCommand(updateQuery, connection);
                    updateCmd.Parameters.AddWithValue("@category", data.CategoryName);
                    updateCmd.Parameters.AddWithValue("@id", data.Id);

                    await updateCmd.ExecuteNonQueryAsync();





                    return Ok(new { message = "Success", updated });
                }
                else
                {
                    return StatusCode(500, new { error = "Updation error", detail = "Category already exist" });

                }




            }
            catch (Exception ex)
            {
                Console.WriteLine("InsertGameDetails Error: " + ex.Message);
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetProductCat()
        {
            

            try
            {
                // 🧠 Extract user ID from JWT
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { error = "Token missing user ID." });

                // ✅ Get client DB connection based on user ID
                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                // Get existing categories
                var selectCategoryQuery = $"SELECT * FROM tbl_productcat WHERE status='1')";
                using var cmdCat = new MySqlCommand(selectCategoryQuery, connection);
                using var reader = await cmdCat.ExecuteReaderAsync();

                int rowCount = 0;
                while (await reader.ReadAsync())
                {
                    rowCount++;
                    // You can access row data here if needed, e.g. reader["columnname"]
                }
                if (rowCount == 0)
                {
                    

                    return Ok(new { message = "Success" });
                }
                else
                {
                    return StatusCode(500, new { error = "Fetching error", detail = "No Categories Exist" });

                }




            }
            catch (Exception ex)
            {
                Console.WriteLine("InsertGameDetails Error: " + ex.Message);
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }




    }
}
