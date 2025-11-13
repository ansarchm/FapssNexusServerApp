using fabsss.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

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
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { error = "Token missing user ID." });

                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

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

                var newCategories = uniqueCategories.Except(existingCategories).ToList();
                if (newCategories.Any())
                {
                    var insertCatQuery = "INSERT INTO tbl_productcat (categoryname, status, locationid) VALUES (@category, '1', @locationid)";
                    foreach (var category in newCategories)
                    {
                        using var insertCmd = new MySqlCommand(insertCatQuery, connection);
                        insertCmd.Parameters.AddWithValue("@category", category);
                        insertCmd.Parameters.AddWithValue("@locationid", 1);
                        await insertCmd.ExecuteNonQueryAsync();
                    }
                }

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
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { error = "Token missing user ID." });

                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var selectCategoryQuery = "SELECT COUNT(*) FROM tbl_productcat WHERE categoryname = @category AND status = '1'";
                using var cmdCat = new MySqlCommand(selectCategoryQuery, connection);
                cmdCat.Parameters.AddWithValue("@category", data.CategoryName);

                var existingCount = Convert.ToInt32(await cmdCat.ExecuteScalarAsync());

                if (existingCount == 0)
                {
                    var insertCatQuery = "INSERT INTO tbl_productcat (categoryname, status, locationid) VALUES (@category, '1', @locationid)";
                    using var insertCmd = new MySqlCommand(insertCatQuery, connection);
                    insertCmd.Parameters.AddWithValue("@category", data.CategoryName);
                    insertCmd.Parameters.AddWithValue("@locationid", data.LocationId);
                    await insertCmd.ExecuteNonQueryAsync();

                    return Ok(new { message = "Success", category = data.CategoryName });
                }
                else
                {
                    return Conflict(new { error = "Category already exists" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("AddProductCat Error: " + ex.Message);
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UpdateProductCat([FromBody] ProductCategory data)
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { error = "Token missing user ID." });

                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var selectCategoryQuery = "SELECT COUNT(*) FROM tbl_productcat WHERE categoryname = @categoryName AND status = '1' AND id != @id";
                using var cmdCat = new MySqlCommand(selectCategoryQuery, connection);
                cmdCat.Parameters.AddWithValue("@categoryName", data.CategoryName);
                cmdCat.Parameters.AddWithValue("@id", data.Id);

                var existingCount = Convert.ToInt32(await cmdCat.ExecuteScalarAsync());

                if (existingCount == 0)
                {
                    var updateQuery = @"UPDATE tbl_productcat 
                                SET categoryname = @categoryName, locationid = @locationId 
                                WHERE id = @id AND status = '1'";

                    using var updateCmd = new MySqlCommand(updateQuery, connection);
                    updateCmd.Parameters.AddWithValue("@categoryName", data.CategoryName);
                    updateCmd.Parameters.AddWithValue("@locationId", data.LocationId);
                    updateCmd.Parameters.AddWithValue("@id", data.Id);

                    var rowsAffected = await updateCmd.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                        return Ok(new { message = "Category updated successfully" });
                    else
                        return NotFound(new { error = "Category not found" });
                }
                else
                {
                    return Conflict(new { error = "Category name already exists" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("UpdateProductCat Error: " + ex.Message);
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> DeleteProductCat([FromBody] ProductCategory data)
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { error = "Token missing user ID." });

                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                // Soft delete by setting status to '0'
                var deleteQuery = @"UPDATE tbl_productcat 
                                   SET status = '0' 
                                   WHERE id = @id";

                using var deleteCmd = new MySqlCommand(deleteQuery, connection);
                deleteCmd.Parameters.AddWithValue("@id", data.Id);

                var rowsAffected = await deleteCmd.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                    return Ok(new { message = "Category deleted successfully" });
                else
                    return NotFound(new { error = "Category not found" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("DeleteProductCat Error: " + ex.Message);
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetProductCat()
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { error = "Token missing user ID." });

                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var selectCategoryQuery = "SELECT id, categoryname, status, locationid FROM tbl_productcat WHERE status = '1' ORDER BY categoryname";
                using var cmdCat = new MySqlCommand(selectCategoryQuery, connection);
                using var reader = await cmdCat.ExecuteReaderAsync();

                var categories = new List<object>();
                while (await reader.ReadAsync())
                {
                    categories.Add(new
                    {
                        Id = reader["id"],
                        CategoryName = reader["categoryname"],
                        Status = reader["status"],
                        LocationId = reader["locationid"]
                    });
                }

                if (categories.Count == 0)
                {
                    return Ok(new { message = "No categories exist", data = new List<object>() });
                }

                return Ok(new { message = "Success", data = categories });
            }
            catch (Exception ex)
            {
                Console.WriteLine("GetProductCat Error: " + ex.Message);
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetProductsByCategory([FromQuery] string categoryName)
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { error = "Token missing user ID." });

                if (string.IsNullOrWhiteSpace(categoryName))
                    return BadRequest(new { error = "Category name is required" });

                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = @"SELECT 
                                p.gameid as Id,
                                p.productname as ProductName,
                                p.category as Category,
                                p.rate as Rate,
                                p.ptype as ProductType,
                                p.tax as Tax,
                                p.status as Status,
                                p.sequence as Sequence,
                                p.bonus as Bonus,
                                p.duration as Duration,
                                p.cashbalance as CashBalance,
                                p.taxtype as TaxType,
                                p.timebandtype as TimeBandType,
                                p.locationid as LocationId
                            FROM tbl_product p
                            WHERE p.category = @categoryName 
                            AND p.status = '1'
                            ORDER BY p.sequence, p.productname";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@categoryName", categoryName);
                using var reader = await cmd.ExecuteReaderAsync();

                var products = new List<object>();
                while (await reader.ReadAsync())
                {
                    products.Add(new
                    {
                        Id = reader["Id"],
                        ProductName = reader["ProductName"],
                        Category = reader["Category"],
                        Rate = reader["Rate"],
                        ProductType = reader["ProductType"],
                        Tax = reader["Tax"],
                        Status = reader["Status"],
                        Sequence = reader["Sequence"],
                        Bonus = reader["Bonus"],
                        Duration = reader["Duration"],
                        CashBalance = reader["CashBalance"],
                        TaxType = reader["TaxType"],
                        TimeBandType = reader["TimeBandType"],
                        LocationId = reader["LocationId"]
                    });
                }

                if (products.Count == 0)
                {
                    return Ok(new { message = $"No products found for category '{categoryName}'", data = new List<object>() });
                }

                return Ok(new { message = "Success", categoryName, totalProducts = products.Count, data = products });
            }
            catch (Exception ex)
            {
                Console.WriteLine("GetProductsByCategory Error: " + ex.Message);
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetAllProductsGroupedByCategory()
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { error = "Token missing user ID." });

                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = @"SELECT 
                                p.gameid as Id,
                                p.productname as ProductName,
                                p.category as Category,
                                p.rate as Rate,
                                p.ptype as ProductType,
                                p.status as Status,
                                pc.id as CategoryId
                            FROM tbl_product p
                            LEFT JOIN tbl_productcat pc ON p.category = pc.categoryname AND pc.status = '1'
                            WHERE p.status = '1'
                            ORDER BY p.category, p.sequence, p.productname";

                using var cmd = new MySqlCommand(query, connection);
                using var reader = await cmd.ExecuteReaderAsync();

                var productsByCategory = new Dictionary<string, List<object>>();

                while (await reader.ReadAsync())
                {
                    var category = reader["Category"].ToString();

                    if (!productsByCategory.ContainsKey(category))
                    {
                        productsByCategory[category] = new List<object>();
                    }

                    productsByCategory[category].Add(new
                    {
                        Id = reader["Id"],
                        ProductName = reader["ProductName"],
                        Rate = reader["Rate"],
                        ProductType = reader["ProductType"],
                        Status = reader["Status"]
                    });
                }

                var result = productsByCategory.Select(kvp => new
                {
                    Category = kvp.Key,
                    ProductCount = kvp.Value.Count,
                    Products = kvp.Value
                }).OrderBy(x => x.Category).ToList();

                return Ok(new { message = "Success", totalCategories = result.Count, data = result });
            }
            catch (Exception ex)
            {
                Console.WriteLine("GetAllProductsGroupedByCategory Error: " + ex.Message);
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }
    }
}