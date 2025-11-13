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

namespace ProductApi.Controllers
{
    [ApiController]
    [Route("api/[Action]")]
    public class ProductController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ProductController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
      

    // Product Api
        [Authorize]
        [HttpPost]
        public IActionResult GetProduct()
        {

            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Token missing user ID or DB name" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string query = "SELECT * FROM tbl_product where status='1' ";

                using var cmd = new MySqlCommand(query, connection);
                using var reader = cmd.ExecuteReader();

                var products = new List<Dictionary<string, object>>();
                while (reader.Read())
                {
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {

                        row[reader.GetName(i)] = reader.GetValue(i);
                    }
                    products.Add(row);
                }

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public IActionResult GetProductById([FromBody] ProductRequest request)
        {
            var product = new Dictionary<string, object>();

            try
            {
                var userId = User.FindFirst("id")?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Token missing user ID." });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string query = "SELECT * FROM tbl_product WHERE id = @id";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", request.Id);

                using var reader = cmd.ExecuteReader();

                if (!reader.HasRows)
                {
                    return NotFound(new { error = "Product not found" });
                }

                if (reader.Read())
                {
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        product[reader.GetName(i)] = reader.GetValue(i);
                    }
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }


        [Authorize]


        [HttpPost("addProduct")]
        public IActionResult AddProduct([FromBody] ProductRequest request)
        {

            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string insertQuery = @"
            INSERT INTO tbl_product 
            (productname, category, ptype, rate, tax, status, sequence, bonus, duration, cashbalance, timebandtype, taxtype, gateip, depositamount, kot, favoriteflag, customercard, kiosk, regman, typegate, gatevalue, commonflag, expiry, enableled, green, blue, red, locationid) 
            VALUES 
            (@productname, @category, @ptype, @rate, @tax, @status, @sequence, @bonus, @duration, @cashbalance, @timebandtype, @taxtype, @gateip, @depositamount, @kot, @favoriteflag, @customercard, @kiosk, @regman, @typegate, @gatevalue, @commonflag, @expiry, @enableled, @green, @blue, @red, @locationid)";

                using var cmd = new MySqlCommand(insertQuery, connection);

                cmd.Parameters.AddWithValue("@productname", request.ProductName);
                cmd.Parameters.AddWithValue("@category", request.Category);
                cmd.Parameters.AddWithValue("@ptype", request.PType);
                cmd.Parameters.AddWithValue("@rate", request.Rate);
                cmd.Parameters.AddWithValue("@tax", request.Tax);
                cmd.Parameters.AddWithValue("@status", request.Status);
                cmd.Parameters.AddWithValue("@sequence", request.Sequence);
                cmd.Parameters.AddWithValue("@bonus", request.Bonus);
                cmd.Parameters.AddWithValue("@duration", request.Duration);
                cmd.Parameters.AddWithValue("@cashbalance", request.CashBalance);
                cmd.Parameters.AddWithValue("@timebandtype", request.TimebandType);
                cmd.Parameters.AddWithValue("@taxtype", request.TaxType);
                cmd.Parameters.AddWithValue("@gateip", request.GateIp);
                cmd.Parameters.AddWithValue("@depositamount", request.DepositAmount);
                cmd.Parameters.AddWithValue("@kot", request.Kot);
                cmd.Parameters.AddWithValue("@favoriteflag", request.FavoriteFlag);
                cmd.Parameters.AddWithValue("@customercard", request.CustomerCard);
                cmd.Parameters.AddWithValue("@kiosk", request.Kiosk);
                cmd.Parameters.AddWithValue("@regman", request.RegMan);
                cmd.Parameters.AddWithValue("@typegate", request.TypeGate);
                cmd.Parameters.AddWithValue("@gatevalue", request.GateValue);
                cmd.Parameters.AddWithValue("@commonflag", request.CommonFlag);
                cmd.Parameters.AddWithValue("@expiry", request.Expiry);
                cmd.Parameters.AddWithValue("@enableled", request.EnableLed);
                cmd.Parameters.AddWithValue("@green", request.Green);
                cmd.Parameters.AddWithValue("@blue", request.Blue);
                cmd.Parameters.AddWithValue("@red", request.Red);
                cmd.Parameters.AddWithValue("@locationid", request.LocationId); // from decoded token originally

                cmd.ExecuteNonQuery();

                return Ok(new { message = "Product added successfully" });
            }
            catch (MySqlException ex) when (ex.Number == 1062) // Duplicate entry error
            {
                return BadRequest(new { error = "Product already exists, Try again" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [Authorize]
        [HttpPost]
        public IActionResult UpdateProductById([FromBody] ProductModel product)
        {
            try
            {
               

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string query = @"
            UPDATE tbl_product SET 
                productname = @productname,
                category = @category,
                ptype = @ptype,
                rate = @rate,
                tax = @tax,
                status = @status,
                sequence = @sequence,
                bonus = @bonus,
                duration = @duration,
                cashbalance = @cashbalance,
                timebandtype = @timebandtype,
                taxtype = @taxtype,
                gateip = @gateip,
                depositamount = IFNULL(@depositamount, 0),
                kot = IFNULL(@kot, 0),
                favoriteflag = IFNULL(@favoriteflag, 0),
                customercard = IFNULL(@customercard, 0),
                kiosk = @kiosk,
                regman = @regman,
                typegate = @typegate,
                gatevalue = @gatevalue,
                commonflag = IFNULL(@commonflag, 0),
                expiry = IFNULL(@expiry, 0),
                enableled = IFNULL(@enableled, 0),
                green = @green,
                blue = @blue,
                red = @red
            WHERE id = @id AND locationid = @locationid";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@productname", product.productname);
                cmd.Parameters.AddWithValue("@category", product.category);
                cmd.Parameters.AddWithValue("@ptype", product.ptype);
                cmd.Parameters.AddWithValue("@rate", product.rate);
                cmd.Parameters.AddWithValue("@tax", product.tax);
                cmd.Parameters.AddWithValue("@status", product.status);
                cmd.Parameters.AddWithValue("@sequence", product.sequence);
                cmd.Parameters.AddWithValue("@bonus", product.bonus);
                cmd.Parameters.AddWithValue("@duration", product.duration);
                cmd.Parameters.AddWithValue("@cashbalance", product.cashbalance);
                cmd.Parameters.AddWithValue("@timebandtype", product.timebandtype);
                cmd.Parameters.AddWithValue("@taxtype", product.taxtype);
                cmd.Parameters.AddWithValue("@gateip", product.gateip);
                cmd.Parameters.AddWithValue("@depositamount", product.depositamount);
                cmd.Parameters.AddWithValue("@kot", product.kot);
                cmd.Parameters.AddWithValue("@favoriteflag", product.favoriteflag);
                cmd.Parameters.AddWithValue("@customercard", product.customercard);
                cmd.Parameters.AddWithValue("@kiosk", product.kiosk);
                cmd.Parameters.AddWithValue("@regman", product.regman);
                cmd.Parameters.AddWithValue("@typegate", product.typegate);
                cmd.Parameters.AddWithValue("@gatevalue", product.gatevalue);
                cmd.Parameters.AddWithValue("@commonflag", product.commonflag);
                cmd.Parameters.AddWithValue("@expiry", product.expiry);
                cmd.Parameters.AddWithValue("@enableled", product.enableled);
                cmd.Parameters.AddWithValue("@green", product.green);
                cmd.Parameters.AddWithValue("@blue", product.blue);
                cmd.Parameters.AddWithValue("@red", product.red);
                cmd.Parameters.AddWithValue("@id", product.id);
                cmd.Parameters.AddWithValue("@locationid", product.locationid);

                cmd.ExecuteNonQuery();

                return Ok(new { message = "Product updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }






        // Userrole
        



     
        
        
      
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> InsertGameDetails([FromBody] List<GameItem> data)
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




        
        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] AddCategoryRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = "INSERT INTO tbl_productcat (categoryname, status, locationid) VALUES (@CategoryName, @Status, @LocationId)";
                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@CategoryName", request.CategoryName);
                cmd.Parameters.AddWithValue("@Status", request.Status);
                cmd.Parameters.AddWithValue("@LocationId", request.LocationId);

                await cmd.ExecuteNonQueryAsync();

                return Ok(new { message = "Category added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }



        }

        [HttpPost("getCategoryById")]
        public async Task<IActionResult> GetCategoryById([FromBody] CategoryRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = "SELECT * FROM tbl_productcat WHERE id = @Id AND locationid = @LocationId;";
                var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", request.Id);
                command.Parameters.AddWithValue("@LocationId", request.LocationId); // previously decoded.id

                using var reader = await command.ExecuteReaderAsync();
                if (!reader.HasRows)
                {
                    return NotFound(new { error = "Category not found" });
                }

                var result = new Dictionary<string, object>();
                if (await reader.ReadAsync())
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
        [HttpPost]
        public async Task<IActionResult> UpdateCategoryById([FromBody] UpdateCategoryRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = "UPDATE tbl_productcat SET categoryname = @categoryname, status = @status WHERE id = @id AND locationid = @locationid;";
                using var command = new MySqlCommand(query, connection);

                command.Parameters.AddWithValue("@categoryname", request.CategoryName);
                command.Parameters.AddWithValue("@status", request.Status);
                command.Parameters.AddWithValue("@id", request.Id);
                command.Parameters.AddWithValue("@locationid", request.LocationId); // Now passed from request directly

                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                    return Ok(new { message = "Category updated successfully" });
                else
                    return NotFound(new { error = "Category not found or not updated" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
      
      
       
      
        
        [Authorize]
        [HttpPost]
        public IActionResult UserRoleUpdateRequest([FromBody] UserRoleRequest request)
        {
            try
            {
                // You can access the authenticated user's information if needed
                var userId = User.Identity?.Name; // Or you can use other claims like User.FindFirst("id") if the user ID is stored in the token

                // Optional: If needed, you can log or use this `userId` to log who is making the request

                string connectionString = _configuration.GetConnectionString("Default");

                // Open a new connection to the database
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                // Query to select the user role based on id and locationid
                string selectQuery = "SELECT * FROM tbl_userrole WHERE id = @id AND locationid = @locationid";

                // Create and configure the MySQL command
                using var command = new MySqlCommand(selectQuery, connection);
                command.Parameters.AddWithValue("@id", request.id);
                command.Parameters.AddWithValue("@locationid", request.locationid);

                // Execute the query
                using var reader = command.ExecuteReader();
                if (!reader.HasRows)
                {
                    // Return NotFound if no matching user role is found
                    return NotFound(new { error = "User role not found" });
                }

                // Collect the result
                var result = new Dictionary<string, object>();
                while (reader.Read())
                {
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        result[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                    }
                }

                // Return the result as an Ok response
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Return a 500 Internal Server Error in case of exception
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPut]
        public async Task<IActionResult> UpdateUserRoleName([FromBody] UpdateUserRoleRequest1 request)
        {
            MySqlConnection connection = null;

            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string updateQuery = @"UPDATE tbl_userrole 
                                   SET userrole = @userrole, status = @status 
                                   WHERE id = @id AND locationid = @locationid";

                using var cmd = new MySqlCommand(updateQuery, connection);
                cmd.Parameters.AddWithValue("@userrole", request.UserRole);
                cmd.Parameters.AddWithValue("@status", request.Status);
                cmd.Parameters.AddWithValue("@id", request.Id);
                cmd.Parameters.AddWithValue("@locationid", request.LocationId);

                await cmd.ExecuteNonQueryAsync();

                return Ok(new { message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
            finally
            {
                if (connection != null)
                    await connection.CloseAsync();
            }
        }

      
        [HttpPost("GetProductSaleByUser")]
        public async Task<IActionResult> GetProductSaleByUser([FromBody] ReportRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                await using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var startTime = await GetStartTimeForDay1(request.StartDate, connection);
                var endTime = await GetEndTimeForDay1(request.EndDate, connection);
                var nextDay = DateTime.Parse(request.EndDate).AddDays(1).ToString("yyyy-MM-dd");

                var firstReport = new List<Dictionary<string, object>>();
                var firstQuery = @"
                SELECT b.cashname AS Username, 
                       b.productname AS Product, 
                       SUM(b.quantity) AS Quantity, 
                       ROUND(SUM(total) / SUM(quantity), 2) AS `Average Cost`, 
                       ROUND(SUM(total) - SUM(taxtotal), 2) AS Revenue, 
                       SUM(taxtotal) AS Tax, 
                       SUM(tdiscount) AS Discount, 
                       SUM(total) AS Total 
                FROM tbl_bill b 
                WHERE b.createddate BETWEEN CONCAT(@StartDate, ' ', @StartTime) AND CONCAT(@NextDay, ' ', @EndTime) 
                  AND locationid = @UserId AND `delete` = 0 
                GROUP BY b.cashname, b.productname 
                ORDER BY b.cashname;";

                await using (var cmd = new MySqlCommand(firstQuery, connection))
                {
                    cmd.Parameters.AddWithValue("@StartDate", request.StartDate);
                    cmd.Parameters.AddWithValue("@StartTime", startTime);
                    cmd.Parameters.AddWithValue("@NextDay", nextDay);
                    cmd.Parameters.AddWithValue("@EndTime", endTime);
                    cmd.Parameters.AddWithValue("@UserId", request.UserId);

                    using var reader = await cmd.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        }
                        firstReport.Add(row);
                    }
                }

                object discount = 0;
                var secondQuery = @"
    SELECT SUM(Discount) AS Discount
    FROM (
        SELECT MAX(tdiscount) AS Discount
        FROM tbl_bill 
        WHERE tdiscount > 0 
          AND locationid = @UserId 
          AND createddate BETWEEN CONCAT(@StartDate, ' ', @StartTime) AND CONCAT(@NextDay, ' ', @EndTime) 
          AND `delete` = 0 
        GROUP BY uuid
    ) inq;";
                await using (var cmd = new MySqlCommand(secondQuery, connection))
                {
                    cmd.Parameters.AddWithValue("@UserId", request.UserId);
                    cmd.Parameters.AddWithValue("@StartDate", request.StartDate);
                    cmd.Parameters.AddWithValue("@StartTime", startTime);
                    cmd.Parameters.AddWithValue("@NextDay", nextDay);
                    cmd.Parameters.AddWithValue("@EndTime", endTime);

                    var result = await cmd.ExecuteScalarAsync();
                    discount = result == DBNull.Value ? 0 : result;
                }

                return Ok(new { firstReport, discount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private async Task<string> GetStartTimeForDay1(string date, MySqlConnection conn) => "00:00:00";
        private async Task<string> GetEndTimeForDay1(string date, MySqlConnection conn) => "23:59:59";
      
      
        [HttpPost("add-fetched-products")]
        public async Task<IActionResult> AddFetchedProducts([FromHeader] string userId, [FromBody] List<ProductData> data)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "Unauthorized: Missing user ID" });
            }

            try
            {
                using var connection = new MySqlConnection(_configuration.GetConnectionString("Default"));
                await connection.OpenAsync();

                // Fetch existing game IDs from the database
                var gameIds = data.Select(d => d.Id).ToList();

                var selectQuery = @"SELECT gameid FROM tbl_product WHERE gameid IN @GameIds AND locationid = @UserId";
                var existingGameIds = (await connection.QueryAsync<int>(selectQuery, new { GameIds = gameIds, UserId = userId })).ToList();

                // Split into insert and update sets
                var insertItems = data.Where(item => !existingGameIds.Contains(item.Id)).ToList();
                var updateItems = data.Where(item => existingGameIds.Contains(item.Id)).ToList();

                // Insert new products
                if (insertItems.Any())
                {
                    var insertQuery = @"INSERT INTO tbl_product 
                        (gameid, productname, category, rate, ptype, tax, status, sequence, bonus, duration, cashbalance, taxtype, timebandtype, locationid)
                        VALUES (@GameId, @ProductName, @Category, @Rate, 'Cash', 0, '1', 0, 0, @Rate, @Rate, 'Included', 'Flexible', @LocationId)";

                    var insertParams = insertItems.Select(item => new
                    {
                        GameId = item.Id,
                        ProductName = item.Title,
                        Category = item.Category,
                        Rate = item.Price,
                        LocationId = userId
                    });

                    await connection.ExecuteAsync(insertQuery, insertParams);
                }

                // Update existing products
                if (updateItems.Any())
                {
                    var updateQuery = @"UPDATE tbl_product 
                        SET productname = @ProductName, category = @Category, rate = @Rate 
                        WHERE locationid = @LocationId AND gameid = @GameId";

                    var updateParams = updateItems.Select(item => new
                    {
                        ProductName = item.Title,
                        Category = item.Category,
                        Rate = item.Price,
                        LocationId = userId,
                        GameId = item.Id
                    });

                    await connection.ExecuteAsync(updateQuery, updateParams);
                }

                return Ok(new { message = "success" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error processing request", error = ex.Message });
            }
        }      
      
    }
}
