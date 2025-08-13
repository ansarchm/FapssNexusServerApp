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
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] fabsss.Models.LoginRequest request)
        {
            var connectionString = _configuration.GetConnectionString("Default");

            try
            {
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                // ✅ Match your DB schema: username, password (SHA2)
                var query = @"
                SELECT c.id ,c.username, u.id as userroleid , u.userrole
                FROM tbl_cash c join tbl_userrole u on c.userrole=u.id
                WHERE c.username = @username 
                AND c.password = @password and u.status=1 and c.status=1";


                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@username", request.Username);
                cmd.Parameters.AddWithValue("@password", request.Password);

                using var reader = await cmd.ExecuteReaderAsync();
                if (reader.Read())
                {
                    var id = reader["id"].ToString();
                    var username = reader["username"].ToString();
                    var userroleid = reader["userroleid"].ToString();
                    var userrole = reader["userrole"].ToString();

                    var token = GenerateJwtToken(id);
                    return Ok(new { token ,id, username, userroleid, userrole });
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
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
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

        // ✅ Get user's DB connection string
        private string GetUserDatabaseConnection(string dbname)
        {
            var connFront = _configuration.GetConnectionString("UserConnectionfront");
            var connLast = _configuration.GetConnectionString("UserConnectionlast");

            

            return connFront + dbname + connLast;
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
        



        //Gate api


        [Authorize]
        [HttpPost]
        public IActionResult GetGateById(int id)
        {
            var gate = new Dictionary<string, object>();

            try
            {
                var userId = User.FindFirst("id")?.Value;
                var dbName = User.FindFirst("dbname")?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Token missing user ID." });
                }

                string connectionString = GetUserDatabaseConnection(dbName); // use dynamic DB logic

                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string query = "SELECT * FROM tbl_gate WHERE id = @id";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", id);

                using var reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        gate[reader.GetName(i)] = reader.GetValue(i);
                    }

                    return Ok(gate);
                }
                else
                {
                    return NotFound(new { error = "Gate not found" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        



        

        [HttpGet]
        public IActionResult GetGateByLocation(int locationId)
        {
            var gates = new List<Dictionary<string, object>>();

            try
            {
                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string query = "SELECT * FROM tbl_gate WHERE locationid = @locationId";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@locationId", locationId);

                using var reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    var gate = new Dictionary<string, object>();

                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        gate[reader.GetName(i)] = reader.GetValue(i);
                    }

                    gates.Add(gate);
                }

                return Ok(gates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }
        [HttpGet]
        public IActionResult GetGateGroupByLocation(int locationId)
        {
            var gateGroups = new List<Dictionary<string, object>>();

            try
            {
                string connectionString = _configuration.GetConnectionString("Default");
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string query = "SELECT * FROM tbl_gategroups WHERE locationid = @locationId";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@locationId", locationId);

                using var reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    var group = new Dictionary<string, object>();

                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        group[reader.GetName(i)] = reader.GetValue(i);
                    }

                    gateGroups.Add(group);
                }

                return Ok(gateGroups);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }
        
        
        [HttpGet]
        public IActionResult GetPaymentModesByLocation(int locationId)
        {
            var paymentModes = new List<Dictionary<string, object>>();

            try
            {
                string connectionString = _configuration.GetConnectionString("Default");
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string query = "SELECT * FROM tbl_payment_modes WHERE locationid = @locationId";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@locationId", locationId);

                using var reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    var mode = new Dictionary<string, object>();

                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        mode[reader.GetName(i)] = reader.GetValue(i);
                    }

                    paymentModes.Add(mode);
                }

                return Ok(paymentModes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

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
        public async Task<IActionResult> GetDiscountReport([FromBody] DiscountRequest request)
        {
            var results = new List<DiscountReportResult>();

            try
            {
                var connectionString = _configuration.GetConnectionString("Default");
                await using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = @"
                SELECT  
                    cashname AS 'Username',  
                    billno AS 'BillNo', 
                    createddate AS 'CreatedOn', 
                    maintotal AS 'Total', 
                    tdiscount AS 'Discount', 
                    afterdiscount AS 'Bill Amount' 
                FROM tbl_bill b 
                WHERE tdiscount > 0 
                AND createddate BETWEEN @startDate AND @endDate  
                GROUP BY CONCAT(b.billno, b.uuid);";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@startDate", request.StartDate);
                cmd.Parameters.AddWithValue("@endDate", request.EndDate);

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    results.Add(new DiscountReportResult
                    {
                        Username = reader["Username"].ToString(),
                        BillNo = reader["BillNo"].ToString(),
                        CreatedOn = Convert.ToDateTime(reader["CreatedOn"]),
                        Total = Convert.ToDecimal(reader["Total"]),
                        Discount = Convert.ToDecimal(reader["Discount"]),
                        BillAmount = Convert.ToDecimal(reader["Bill Amount"])
                    });
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> GetVoidSalesReport([FromBody] VoidSalesRequest request)
        {
            var results = new List<Dictionary<string, object>>();

            try
            {
                var connectionString = _configuration.GetConnectionString("Default");
                await using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();




                string query = @"
                SELECT 
                    b.cashname, 
                    b.billno, 
                    b.maintotal, 
                    GROUP_CONCAT(DISTINCT t.cardnumber) AS cards 
                FROM tbl_bill b 
                LEFT JOIN tbl_transaction t 
                    ON t.uuid = b.uuid AND b.locationid = t.locationid 
                WHERE b.`delete` = 1 
                    AND b.locationid = @locationid 
                    AND b.createddate BETWEEN CONCAT(@startDate, ' 00:00:00') AND CONCAT(@endDate, ' 23:59:59') 
                GROUP BY b.uuid 
                ORDER BY b.cashname, b.billno * 1;";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@locationid", request.UserId);  // Replace with actual decoded user ID
                cmd.Parameters.AddWithValue("@startDate", request.StartDate);
                cmd.Parameters.AddWithValue("@endDate", request.EndDate);

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                    }
                    results.Add(row);
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> UpdateGateGroupDetails([FromBody] GateGroupUpdateRequest request)
        {
            var connectionString = _configuration.GetConnectionString("Default");

            await using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
                // Update tbl_gategroups
                var updateCommand = new MySqlCommand(@"
            UPDATE tbl_gategroups 
            SET groupname = @groupname, status = @status, categoryflag = @categoryflag 
            WHERE id = @groupId AND locationid = @userId", connection, (MySqlTransaction)transaction);

                updateCommand.Parameters.AddWithValue("@groupname", request.GroupName);
                updateCommand.Parameters.AddWithValue("@status", request.Status);
                updateCommand.Parameters.AddWithValue("@categoryflag", request.CategoryFlag);
                updateCommand.Parameters.AddWithValue("@groupId", request.GroupId);
                updateCommand.Parameters.AddWithValue("@userId", request.UserId);

                await updateCommand.ExecuteNonQueryAsync();

                // Delete from tbl_gategroupmap
                var deleteCommand = new MySqlCommand("DELETE FROM tbl_gategroupmap WHERE groupid = @groupId", connection, (MySqlTransaction)transaction);
                deleteCommand.Parameters.AddWithValue("@groupId", request.GroupId);
                await deleteCommand.ExecuteNonQueryAsync();

                // Insert into tbl_gategroupmap
                foreach (var gateId in request.Gates)
                {
                    var insertCommand = new MySqlCommand(@"
                INSERT INTO tbl_gategroupmap (gateid, groupid, mnts, locationid) 
                VALUES (@gateid, @groupId, 0, @userId)", connection, (MySqlTransaction)transaction);

                    insertCommand.Parameters.AddWithValue("@gateid", gateId);
                    insertCommand.Parameters.AddWithValue("@groupId", request.GroupId);
                    insertCommand.Parameters.AddWithValue("@userId", request.UserId);

                    await insertCommand.ExecuteNonQueryAsync();
                }

                await transaction.CommitAsync();

                return Ok(new { groupId = request.GroupId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> UpdateGateGroupById([FromBody] GateGroupUpdateRequest request)
        {
            MySqlConnection connection = null;
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");
                connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var groupQuery = @"UPDATE `tbl_gategroups` 
                           SET `groupname` = @groupname, `status` = @status, `categoryflag` = @categoryflag 
                           WHERE `id` = @groupId AND `locationid` = @locationid";

                using (var groupCmd = new MySqlCommand(groupQuery, connection))
                {
                    groupCmd.Parameters.AddWithValue("@groupname", request.GroupName);
                    groupCmd.Parameters.AddWithValue("@status", request.Status);
                    groupCmd.Parameters.AddWithValue("@categoryflag", request.CategoryFlag);
                    groupCmd.Parameters.AddWithValue("@groupId", request.GroupId);
                    groupCmd.Parameters.AddWithValue("@locationid", request.LocationId);
                    await groupCmd.ExecuteNonQueryAsync();
                }

                // Delete old mappings
                var deleteQuery = "DELETE FROM `tbl_gategroupmap` WHERE `groupid` = @groupId";
                using (var deleteCmd = new MySqlCommand(deleteQuery, connection))
                {
                    deleteCmd.Parameters.AddWithValue("@groupId", request.GroupId);
                    await deleteCmd.ExecuteNonQueryAsync();
                }

                // Insert new mappings
                foreach (var gateId in request.Gates)
                {
                    var insertQuery = @"INSERT INTO `tbl_gategroupmap` 
                                (`gateid`, `groupid`, `mnts`, `locationid`) 
                                VALUES (@gateid, @groupid, @mnts, @locationid)";
                    using (var insertCmd = new MySqlCommand(insertQuery, connection))
                    {
                        insertCmd.Parameters.AddWithValue("@gateid", gateId);
                        insertCmd.Parameters.AddWithValue("@groupid", request.GroupId);
                        insertCmd.Parameters.AddWithValue("@mnts", 0); // default to 0
                        insertCmd.Parameters.AddWithValue("@locationid", request.LocationId);
                        await insertCmd.ExecuteNonQueryAsync();
                    }
                }

                return Ok(new { groupId = request.GroupId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
            finally
            {
                if (connection != null && connection.State == ConnectionState.Open)
                {
                    await connection.CloseAsync();
                }
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
        [HttpPost]
        public async Task<IActionResult> AddGate([FromBody] AddGateRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = @"
                INSERT INTO tbl_gate 
                (gateip, gatename, amount, type, parent, duration, mode, relay, msg, status, denied, locationid) 
                VALUES 
                (@gateip, @gatename, @amount, @type, @parent, @duration, @mode, @relay, @msg, @status, @denied, @locationid)";

                using var command = new MySqlCommand(query, connection);

                command.Parameters.AddWithValue("@gateip", request.GateIp);
                command.Parameters.AddWithValue("@gatename", request.GateName);
                command.Parameters.AddWithValue("@amount", request.Amount);
                command.Parameters.AddWithValue("@type", request.Type);
                command.Parameters.AddWithValue("@parent", request.Parent);
                command.Parameters.AddWithValue("@duration", request.Duration);
                command.Parameters.AddWithValue("@mode", request.Mode);
                command.Parameters.AddWithValue("@relay", request.Relay);
                command.Parameters.AddWithValue("@msg", request.Msg);
                command.Parameters.AddWithValue("@status", request.Status);
                command.Parameters.AddWithValue("@denied", request.Denied);
                command.Parameters.AddWithValue("@locationid", request.LocationId);

                await command.ExecuteNonQueryAsync();

                return Ok(new { message = "Gate added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPost("add")]
        public async Task<IActionResult> AddRefundReason([FromBody] AddRefundReasonRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = @"
                INSERT INTO tbl_refund_reasons 
                (reason, status, locationid) 
                VALUES 
                (@reason, @status, @locationid)";

                using var command = new MySqlCommand(query, connection);

                command.Parameters.AddWithValue("@reason", request.Reason);
                command.Parameters.AddWithValue("@status", request.Status);
                command.Parameters.AddWithValue("@locationid", request.LocationId);

                await command.ExecuteNonQueryAsync();

                return Ok(new { message = "Refund reason added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPut]
        public async Task<IActionResult> UpdateGateById([FromBody] UpdateGateRequest request)
        {
            var connectionString = _configuration.GetConnectionString("Default");

            try
            {
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = @"
                UPDATE tbl_gate 
                SET gateip = @GateIp,
                    gatename = @GateName,
                    amount = @Amount,
                    type = @Type,
                    parent = @Parent,
                    duration = @Duration,
                    mode = @Mode,
                    relay = @Relay,
                    msg = @Msg,
                    status = @Status,
                    denied = @Denied
                WHERE id = @Id AND locationid = @LocationId;
            ";

                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@GateIp", request.GateIp);
                command.Parameters.AddWithValue("@GateName", request.GateName);
                command.Parameters.AddWithValue("@Amount", request.Amount);
                command.Parameters.AddWithValue("@Type", request.Type);
                command.Parameters.AddWithValue("@Parent", request.Parent);
                command.Parameters.AddWithValue("@Duration", request.Duration);
                command.Parameters.AddWithValue("@Mode", request.Mode);
                command.Parameters.AddWithValue("@Relay", request.Relay);
                command.Parameters.AddWithValue("@Msg", request.Msg);
                command.Parameters.AddWithValue("@Status", request.Status);
                command.Parameters.AddWithValue("@Denied", request.Denied);
                command.Parameters.AddWithValue("@Id", request.Id);
                command.Parameters.AddWithValue("@LocationId", request.LocationId);

                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    return Ok(new { message = "Gate updated successfully." });
                }
                else
                {
                    return NotFound(new { message = "Gate not found or no changes made." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> UpdateRefundReasonById([FromBody] UpdateRefundReasonRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = @"
                UPDATE tbl_refund_reasons 
                SET reason = @reason, status = @status 
                WHERE id = @id AND locationid = @locationid";

                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@reason", request.Reason);
                command.Parameters.AddWithValue("@status", request.Status);
                command.Parameters.AddWithValue("@id", request.Id);
                command.Parameters.AddWithValue("@locationid", request.LocationId);

                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                    return Ok(new { message = "Refund reason updated successfully" });
                else
                    return NotFound(new { error = "Refund reason not found or not updated" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
       
       
        

        
        [HttpPost]
        public async Task<IActionResult> UpdateRefundReasonsById([FromBody] UpdateRefundReasonRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = @"
                UPDATE tbl_refund_reasons 
                SET reason = @reason, status = @status 
                WHERE id = @id AND locationid = @locationid";

                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@reason", request.Reason);
                command.Parameters.AddWithValue("@status", request.Status);
                command.Parameters.AddWithValue("@id", request.Id);
                command.Parameters.AddWithValue("@locationid", request.LocationId);

                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                    return Ok(new { message = "Refund reason updated successfully" });
                else
                    return NotFound(new { error = "Refund reason not found or not updated" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        
        [HttpPost("getGateGroupById")]
        public IActionResult GetGateGroupById([FromBody] GateGroupRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                // Fetch from tbl_gategroups
                var groupQuery = "SELECT * FROM tbl_gategroups WHERE id = @id AND locationid = @locationid";
                var groupCommand = new MySqlCommand(groupQuery, connection);
                groupCommand.Parameters.AddWithValue("@id", request.id);
                groupCommand.Parameters.AddWithValue("@locationid", request.locationid);

                var groupResults = new List<Dictionary<string, object>>();
                using (var reader = groupCommand.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var row = new Dictionary<string, object>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.GetValue(i);
                        }
                        groupResults.Add(row);
                    }
                }

                // Fetch from tbl_gategroupmap joined with tbl_gate
                var mapQuery = @"
                SELECT gt.* 
                FROM tbl_gategroupmap g
                JOIN tbl_gate gt ON gt.id = g.gateid 
                WHERE g.groupid = @groupid";
                var mapCommand = new MySqlCommand(mapQuery, connection);
                mapCommand.Parameters.AddWithValue("@groupid", request.id);

                var mapResults = new List<Dictionary<string, object>>();
                using (var reader = mapCommand.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var row = new Dictionary<string, object>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.GetValue(i);
                        }
                        mapResults.Add(row);
                    }
                }

                var response = new
                {
                    group = groupResults,
                    map = mapResults
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPost("addGateGroup")]
        public IActionResult AddGateGroup([FromBody] GateGroupRequest request)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("Default");
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                // Insert into tbl_gategroups
                string insertGroupQuery = @"
            INSERT INTO tbl_gategroups (groupname, status, categoryflag, locationid) 
            VALUES (@groupname, @status, @categoryflag, @locationid);
            SELECT LAST_INSERT_ID();";

                long groupId;
                using (var cmd = new MySqlCommand(insertGroupQuery, connection))
                {
                    cmd.Parameters.AddWithValue("@groupname", request.groupname);
                    cmd.Parameters.AddWithValue("@status", request.status);
                    cmd.Parameters.AddWithValue("@categoryflag", request.categoryflag);
                    cmd.Parameters.AddWithValue("@locationid", request.locationid); // from frontend, instead of token

                    groupId = Convert.ToInt64(cmd.ExecuteScalar());
                }

                // Insert into tbl_gategroupmap for each gate
                foreach (var gateId in request.gates)
                {
                    string insertMapQuery = @"
                INSERT INTO tbl_gategroupmap (gateid, groupid, mnts, locationid) 
                VALUES (@gateid, @groupid, 0, @locationid)";

                    using var mapCmd = new MySqlCommand(insertMapQuery, connection);
                    mapCmd.Parameters.AddWithValue("@gateid", gateId);
                    mapCmd.Parameters.AddWithValue("@groupid", groupId);
                    mapCmd.Parameters.AddWithValue("@locationid", request.locationid);
                    mapCmd.ExecuteNonQuery();
                }

                return Ok(new
                {
                    message = "GateGroup added successfully",
                    groupId = groupId
                });
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
        [HttpGet("details/{locationId}")]
        public async Task<IActionResult> GetLocationDetails(int locationId)
        {
            MySqlConnection connection = null;

            try
            {
                var connectionString = _configuration.GetConnectionString("Default");
                connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string query = "SELECT * FROM tbl_location WHERE id = @id";
                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", locationId);

                var reader = await cmd.ExecuteReaderAsync();
                var result = new List<Dictionary<string, object>>();

                while (await reader.ReadAsync())
                {
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                        row[reader.GetName(i)] = reader.GetValue(i);
                    result.Add(row);
                }

                return Ok(result);
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
        [HttpPut("update")]
        public async Task<IActionResult> UpdateLocationDetails([FromBody] UpdateLocationRequest request)
        {
            MySqlConnection connection = null;

            try
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection");
                connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var query = @"UPDATE tbl_location 
                          SET name = @name, address = @address, phoneno = @phoneno, taxid = @taxid, 
                              decimalpt = @decimalpt, cashsymbol = @cashsymbol, addresst = @addresst, 
                              trfromtime = @trfromtime, trtotime = @trtotime, locationfooter = @locationfooter 
                          WHERE id = @id";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@name", request.Name);
                cmd.Parameters.AddWithValue("@address", request.Address);
                cmd.Parameters.AddWithValue("@phoneno", request.PhoneNo);
                cmd.Parameters.AddWithValue("@taxid", request.TaxId);
                cmd.Parameters.AddWithValue("@decimalpt", request.DecimalPt);
                cmd.Parameters.AddWithValue("@cashsymbol", request.CashSymbol);
                cmd.Parameters.AddWithValue("@addresst", request.AddressT);
                cmd.Parameters.AddWithValue("@trfromtime", request.TrFromTime);
                cmd.Parameters.AddWithValue("@trtotime", request.TrToTime);
                cmd.Parameters.AddWithValue("@locationfooter", request.LocationFooter);
                cmd.Parameters.AddWithValue("@id", request.Id);

                var result = await cmd.ExecuteNonQueryAsync();

                return Ok(new { message = "Location updated successfully", rowsAffected = result });
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
        [HttpPost("getFirstReport")]
        public IActionResult GetFirstReport([FromBody] ReportRequest request)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("Default");
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string startTime = GetStartTimeForDay(request.StartDate, connection);
                string endTime = GetEndTimeForDay(request.EndDate, connection);
                string nextDay = DateTime.Parse(request.EndDate).AddDays(1).ToString("yyyy-MM-dd");

                // First query
                string firstQuery = @"
                SELECT b.productname AS Product,
                       SUM(b.quantity) AS Quantity,
                       ROUND(SUM(total) / SUM(quantity), 2) AS `Average Cost`,
                       ROUND(SUM(total) - SUM(taxtotal), 2) AS Revenue,
                       SUM(taxtotal) AS Tax,
                       SUM(tdiscount) AS Discount,
                       SUM(total) AS Total
                FROM tbl_bill b
                WHERE b.createddate BETWEEN CONCAT(@startDate, ' ', @startTime) AND CONCAT(@nextDay, ' ', @endTime)
                  AND locationid = @locationId AND `delete` = '0'
                GROUP BY b.productname";

                var firstResults = new List<Dictionary<string, object>>();
                using (var command1 = new MySqlCommand(firstQuery, connection))
                {
                    command1.Parameters.AddWithValue("@startDate", request.StartDate);
                    command1.Parameters.AddWithValue("@startTime", startTime);
                    command1.Parameters.AddWithValue("@nextDay", nextDay);
                    command1.Parameters.AddWithValue("@endTime", endTime);
                    command1.Parameters.AddWithValue("@locationId", request.LocationId);

                    using var reader = command1.ExecuteReader();
                    while (reader.Read())
                    {
                        var row = new Dictionary<string, object>();
                        for (int i = 0; i < reader.FieldCount; i++)
                            row[reader.GetName(i)] = reader.GetValue(i);
                        firstResults.Add(row);
                    }
                }

                string secondQuery = @"
    SELECT IFNULL(SUM(tdiscount), 0) AS discount
    FROM (
        SELECT SUM(tdiscount) AS tdiscount
        FROM tbl_bill
        WHERE tdiscount > 0
          AND locationid = @locationId
          AND createddate BETWEEN CONCAT(@startDate, ' ', @startTime) AND CONCAT(@nextDay, ' ', @endTime)
          AND `delete` = 0
        GROUP BY uuid
    ) AS inq";


                decimal discount = 0;
                using (var command2 = new MySqlCommand(secondQuery, connection))
                {
                    command2.Parameters.AddWithValue("@startDate", request.StartDate);
                    command2.Parameters.AddWithValue("@startTime", startTime);
                    command2.Parameters.AddWithValue("@nextDay", nextDay);
                    command2.Parameters.AddWithValue("@endTime", endTime);
                    command2.Parameters.AddWithValue("@locationId", request.LocationId);

                    using var reader = command2.ExecuteReader();
                    if (reader.Read())
                    {
                        discount = reader.GetDecimal("discount");
                    }
                }

                return Ok(new
                {
                    firstReport = firstResults,
                    discount = discount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private string GetStartTimeForDay(string date, MySqlConnection connection)
        {
            string dayOfWeek = DateTime.Parse(date).ToString("dddd", CultureInfo.InvariantCulture);
            string query = "SELECT from_time FROM tbl_workinghours WHERE day = @day";

            using var command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@day", dayOfWeek);
            var result = command.ExecuteScalar();
            return result?.ToString() ?? "00:00:00";
        }

        private string GetEndTimeForDay(string date, MySqlConnection connection)
        {
            string dayOfWeek = DateTime.Parse(date).ToString("dddd", CultureInfo.InvariantCulture);
            string query = "SELECT to_time FROM tbl_workinghours WHERE day = @day";

            using var command = new MySqlCommand(query, connection);
            command.Parameters.AddWithValue("@day", dayOfWeek);
            var result = command.ExecuteScalar();
            return result?.ToString() ?? "23:59:59";
        }
        [HttpPost]
        public IActionResult GetCategorywiseReport([FromBody] ReportRequest request)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("Default");
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string startTime = GetStartTimeForDay(request.StartDate, connection);
                string endTime = GetEndTimeForDay(request.EndDate, connection);
                string nextDay = DateTime.Parse(request.EndDate).AddDays(1).ToString("yyyy-MM-dd");

                var firstQuery = @"
            SELECT p.category AS `Product Category`,
                   COUNT(DISTINCT b.id) AS `No of Bills`,
                   SUM(b.quantity) AS Quantity,
                   ROUND(SUM(total)) AS Revenue
            FROM tbl_bill b
            LEFT JOIN tbl_product p ON p.productname = b.productname
            WHERE b.createddate BETWEEN CONCAT(@startDate, ' ', @startTime) AND CONCAT(@nextDay, ' ', @endTime)
              AND b.locationid = @locationid
              AND b.`delete` = 0
            GROUP BY p.category;"; // Removed ORDER BY b.cashname to avoid ONLY_FULL_GROUP_BY issue

                using var command = new MySqlCommand(firstQuery, connection);
                command.Parameters.AddWithValue("@startDate", request.StartDate);
                command.Parameters.AddWithValue("@startTime", startTime);
                command.Parameters.AddWithValue("@nextDay", nextDay);
                command.Parameters.AddWithValue("@endTime", endTime);
                command.Parameters.AddWithValue("@locationid", request.LocationId);

                var firstReport = new List<Dictionary<string, object>>();
                using var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                        row[reader.GetName(i)] = reader.GetValue(i);
                    firstReport.Add(row);
                }
                reader.Close();

                var secondQuery = @"
    SELECT ROUND(SUM(tdiscount), 2) AS discount
    FROM (
        SELECT MAX(tdiscount) AS tdiscount
        FROM tbl_bill
        WHERE tdiscount > 0
          AND locationid = @locationid
          AND createddate BETWEEN CONCAT(@startDate, ' ', @startTime) AND CONCAT(@nextDay, ' ', @endTime)
          AND `delete` = 0
        GROUP BY uuid
    ) AS inq;";


                using var discountCommand = new MySqlCommand(secondQuery, connection);
                discountCommand.Parameters.AddWithValue("@locationid", request.LocationId);
                discountCommand.Parameters.AddWithValue("@startDate", request.StartDate);
                discountCommand.Parameters.AddWithValue("@startTime", startTime);
                discountCommand.Parameters.AddWithValue("@nextDay", nextDay);
                discountCommand.Parameters.AddWithValue("@endTime", endTime);

                var discount = Convert.ToDecimal(discountCommand.ExecuteScalar());

                return Ok(new
                {
                    firstReport,
                    discount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
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
        [HttpPost("GetSecondReport")]
        public async Task<IActionResult> GetSecondReport([FromBody] ReportRequest request)
        {
            var results = new List<PaymentSummary>();
            var connectionString = _configuration.GetConnectionString("Default");
            try
            {
                using (var connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                    SELECT 
                        p.usr AS `DeviceName`,
                        IFNULL(ROUND(SUM(CASE WHEN mode = 'Cash' THEN p.amount END), 2), 0) AS Cash,
                        IFNULL(ROUND(SUM(CASE WHEN mode = 'Card' THEN p.amount END), 2), 0) AS CreditCard,
                        IFNULL(ROUND(SUM(CASE WHEN mode = 'CustomerCard' THEN p.amount END), 2), 0) AS CustomerCard
                    FROM tbl_payment p
                    WHERE 
                        p.deleted = 0
                        AND p.createdon BETWEEN @StartDate AND @EndDate
                        AND p.locationid = @LocationId
                    GROUP BY p.usr;
                ";

                    var command = new MySqlCommand(query, connection);
                    command.Parameters.AddWithValue("@StartDate", $"{request.StartDate} 00:00:00");
                    command.Parameters.AddWithValue("@EndDate", $"{request.EndDate} 59:59:59");
                    command.Parameters.AddWithValue("@LocationId", request.UserId); // Replace with actual value

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            results.Add(new PaymentSummary
                            {
                                DeviceName = reader["DeviceName"].ToString(),
                                Cash = Convert.ToDecimal(reader["Cash"]),
                                CreditCard = Convert.ToDecimal(reader["CreditCard"]),
                                CustomerCard = Convert.ToDecimal(reader["CustomerCard"])
                            });
                        }
                    }
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("get-third-report")]
        public async Task<IActionResult> GetThirdReport([FromBody] ReportRequest request)
        {
            var results = new List<ThirdReportResult>();

            try
            {
                string connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string startTime = await GetStartTimeForDay2(request.StartDate, connection);
                string endTime = await GetEndTimeForDay2(request.EndDate, connection);
                string nextDay = DateTime.Parse(request.EndDate).AddDays(1).ToString("yyyy-MM-dd");

                string query = @"
                SELECT g.type AS category, g.gatename, COUNT(*) AS `Play Count`
                FROM tbl_gate g
                JOIN tbl_transaction t ON t.ipaddress = g.gateip
                WHERE g.mode = 'Entry'
                AND t.createdon BETWEEN CONCAT(@startDate, ' ', @startTime)
                                  AND CONCAT(@nextDay, ' ', @endTime)
                AND g.locationid = @locationId
                GROUP BY g.type, g.gatename
                ORDER BY g.type, COUNT(*) DESC";

                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@startDate", request.StartDate);
                command.Parameters.AddWithValue("@startTime", startTime);
                command.Parameters.AddWithValue("@nextDay", nextDay);
                command.Parameters.AddWithValue("@endTime", endTime);
                command.Parameters.AddWithValue("@locationId", request.UserId); // assuming it's passed in

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    results.Add(new ThirdReportResult
                    {
                        Category = reader["category"].ToString(),
                        GateName = reader["gatename"].ToString(),
                        PlayCount = Convert.ToInt32(reader["Play Count"])
                    });
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // Replace with your actual logic
        private Task<string> GetStartTimeForDay2(string date, MySqlConnection connection) => Task.FromResult("00:00:00");
        private Task<string> GetEndTimeForDay2(string date, MySqlConnection connection) => Task.FromResult("23:59:59");





        [HttpPost]
        public async Task<IActionResult> GetGameRevenueReport([FromBody] ReportRequest request)
        {
            var result = new List<GameRevenueReport>();
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var startTime = await GetStartTimeForDay3(request.StartDate, connection);
                var endTime = await GetEndTimeForDay3(request.EndDate, connection);
                var nextDay = DateTime.ParseExact(request.EndDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture).AddDays(1).ToString("yyyy-MM-dd");

                string query = @"
        SELECT g.type AS category, g.gatename, COUNT(*) AS PlayCount, SUM(debit) AS TotalAmount
        FROM tbl_gate g
        JOIN tbl_transaction t ON t.ipaddress = g.gateip
        WHERE g.type = 'Card'
        AND t.createdon BETWEEN CONCAT(@startDate, ' ', @startTime)
                          AND CONCAT(@nextDay, ' ', @endTime)
        AND g.locationid = @locationId
        GROUP BY g.type, g.gatename";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@startDate", request.StartDate);
                cmd.Parameters.AddWithValue("@startTime", startTime);
                cmd.Parameters.AddWithValue("@nextDay", nextDay);
                cmd.Parameters.AddWithValue("@endTime", endTime);
                cmd.Parameters.AddWithValue("@locationId", request.UserId);

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    result.Add(new GameRevenueReport
                    {
                        Category = reader["category"].ToString(),
                        GateName = reader["gatename"].ToString(),
                        PlayCount = Convert.ToInt32(reader["PlayCount"]),
                        TotalAmount = Convert.ToDecimal(reader["TotalAmount"])
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private async Task<string> GetStartTimeForDay3(string date, MySqlConnection connection)
        {
            return "00:00:00";
        }

        private async Task<string> GetEndTimeForDay3(string date, MySqlConnection connection)
        {
            return "23:59:59";
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ReportRequest request)
        {
            if (string.IsNullOrEmpty(request.Duration))
                return BadRequest(new { message = "Duration is required" });

            if (string.IsNullOrEmpty(request.FromDate))
                return BadRequest(new { message = "From date is required" });

            if (string.IsNullOrEmpty(request.ToDate))
                return BadRequest(new { message = "To date is required" });

            DateTime frmDt = DateTime.ParseExact(request.FromDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDt = DateTime.ParseExact(request.ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (request.Duration == "Month")
            {
                if (frmDt.Day != 1) frmDt = new DateTime(frmDt.Year, frmDt.Month, 1).AddMonths(1);
                if (toDt.Day != DateTime.DaysInMonth(toDt.Year, toDt.Month))
                    toDt = new DateTime(toDt.Year, toDt.Month, 1).AddDays(-1).AddMonths(1).AddDays(-1);
            }
            else if (request.Duration == "Week")
            {
                frmDt = frmDt.AddDays(-(int)frmDt.DayOfWeek);
                toDt = toDt.AddDays(6 - (int)toDt.DayOfWeek);
            }

            if (toDt < frmDt)
                return NotFound(new { message = "No Reports" });

            string connectionString = _configuration.GetConnectionString("Default");

            using MySqlConnection conn = new(connectionString);
            await conn.OpenAsync();

            try
            {
                var discountQuery = @"SELECT SUM(tdiscount) AS discount 
                          FROM (SELECT DISTINCT uuid, tdiscount 
                                FROM tbl_bill 
                                WHERE createddate BETWEEN @from AND @to 
                                AND `delete` = '0') AS subquery";

                using var discountCmd = new MySqlCommand(discountQuery, conn);
                discountCmd.Parameters.AddWithValue("@from", frmDt.ToString("yyyy-MM-dd"));
                discountCmd.Parameters.AddWithValue("@to", toDt.ToString("yyyy-MM-dd"));
                var discountResult = await discountCmd.ExecuteScalarAsync();
                var discount = Convert.ToDecimal(discountResult ?? 0);

                string selectCol = request.Duration switch
                {
                    "Month" => "DATE_FORMAT(b.createddate, '%Y-%m') as Month",
                    "Week" => "YEARWEEK(b.createddate, 1) as Week, CONCAT('Week ', DENSE_RANK() OVER (ORDER BY YEARWEEK(b.createddate, 1))) AS WeekLabel",
                    "Day" => "DATE_FORMAT(b.createddate, '%Y-%m-%d') as Date",
                    _ => throw new Exception("Invalid duration")
                };

                string groupBy = request.Duration switch
                {
                    "Month" => "GROUP BY DATE_FORMAT(b.createddate, '%Y-%m') ORDER BY Month",
                    "Week" => "GROUP BY YEARWEEK(b.createddate, 1) ORDER BY Week",
                    "Day" => "GROUP BY DATE_FORMAT(b.createddate, '%Y-%m-%d') ORDER BY Date",
                    _ => ""
                };

                var query = $@"SELECT {selectCol}, 
                          ROUND(SUM(total) - SUM(taxtotal), 2) AS Revenue, 
                          SUM(taxtotal) AS Tax, 
                          SUM(tdiscount) AS Discount, 
                          SUM(total) AS Total 
                   FROM tbl_bill b 
                   WHERE b.createddate BETWEEN @from AND @to 
                     AND b.delete = '0' 
                   {groupBy}";

                using var cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@from", frmDt.ToString("yyyy-MM-dd"));
                cmd.Parameters.AddWithValue("@to", toDt.ToString("yyyy-MM-dd"));

                using var reader = await cmd.ExecuteReaderAsync();
                var results = new List<Dictionary<string, object>>();
                while (await reader.ReadAsync())
                {
                    var row = Enumerable.Range(0, reader.FieldCount)
                        .ToDictionary(reader.GetName, reader.GetValue);
                    results.Add(row);
                }

                if (results.Count == 0)
                    return NotFound(new { message = "No product sales found" });

                return Ok(new
                {
                    message = "Product sales fetched successfully",
                    data = results,
                    discount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> GetRevenueGroupReport([FromBody] ReportRequest request)
        {
            if (string.IsNullOrEmpty(request.Duration))
                return BadRequest(new { message = "Duration is required" });

            if (string.IsNullOrEmpty(request.FromDate))
                return BadRequest(new { message = "From date is required" });

            if (string.IsNullOrEmpty(request.ToDate))
                return BadRequest(new { message = "To date is required" });

            // Normalize duration to lower case to avoid case-sensitivity issues
            var duration = request.Duration?.Trim().ToLowerInvariant();

            if (!new[] { "day", "week", "month" }.Contains(duration))
                return BadRequest(new { message = "Invalid duration. Must be Day, Week, or Month." });

            if (!DateTime.TryParseExact(request.FromDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out var frmDt))
                return BadRequest(new { message = "Invalid FromDate format. Expected format: yyyy-MM-dd HH:mm:ss" });

            if (!DateTime.TryParseExact(request.ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out var toDt))
                return BadRequest(new { message = "Invalid ToDate format. Expected format: yyyy-MM-dd HH:mm:ss" });

            // Adjust dates based on duration
            if (duration == "month")
            {
                if (frmDt.Day != 1)
                    frmDt = new DateTime(frmDt.Year, frmDt.Month, 1).AddMonths(1);

                if (toDt.Day != DateTime.DaysInMonth(toDt.Year, toDt.Month))
                    toDt = new DateTime(toDt.Year, toDt.Month, 1).AddMonths(1).AddDays(-1);
            }
            else if (duration == "week")
            {
                frmDt = frmDt.AddDays(-(int)frmDt.DayOfWeek); // move to Sunday
                toDt = toDt.AddDays(6 - (int)toDt.DayOfWeek); // move to Saturday
            }

            if (toDt < frmDt)
                return NotFound(new { message = "No Reports" });

            var connectionString = _configuration.GetConnectionString("Default");

            using var conn = new MySqlConnection(connectionString);
            await conn.OpenAsync();

            try
            {
                // Get discount first
                string discountQuery = @"
        SELECT SUM(tdiscount) AS discount
        FROM (
            SELECT DISTINCT uuid, tdiscount
            FROM tbl_bill
            WHERE createddate BETWEEN @from AND @to AND `delete` = '0'
        ) AS subquery";

                using var disCmd = new MySqlCommand(discountQuery, conn);
                disCmd.Parameters.AddWithValue("@from", frmDt.ToString("yyyy-MM-dd HH:mm:ss"));
                disCmd.Parameters.AddWithValue("@to", toDt.ToString("yyyy-MM-dd HH:mm:ss"));
                var discountResult = await disCmd.ExecuteScalarAsync();
                var discount = Convert.ToDecimal(discountResult ?? 0);

                // Dynamic column selection and grouping
                string selectCol = duration switch
                {
                    "month" => "DATE_FORMAT(b.createddate, '%Y-%m') AS Month",
                    "week" => "YEARWEEK(b.createddate, 1) AS Week, CONCAT('Week ', DENSE_RANK() OVER (ORDER BY YEARWEEK(b.createddate, 1))) AS WeekLabel",
                    "day" => "DATE_FORMAT(b.createddate, '%Y-%m-%d') AS Date",
                    _ => throw new Exception("Invalid duration")
                };

                string groupBy = duration switch
                {
                    "month" => "GROUP BY DATE_FORMAT(b.createddate, '%Y-%m') ORDER BY Month",
                    "week" => "GROUP BY YEARWEEK(b.createddate, 1) ORDER BY Week",
                    "day" => "GROUP BY DATE_FORMAT(b.createddate, '%Y-%m-%d') ORDER BY Date",
                    _ => ""
                };

                string reportQuery = $@"
        SELECT {selectCol},
               ROUND(SUM(total) - SUM(taxtotal), 2) AS Revenue,
               SUM(taxtotal) AS Tax,
               SUM(tdiscount) AS Discount,
               SUM(total) AS Total
        FROM tbl_bill b
        WHERE b.createddate BETWEEN @from AND @to AND b.delete = '0'
        {groupBy}";

                using var cmd = new MySqlCommand(reportQuery, conn);
                cmd.Parameters.AddWithValue("@from", frmDt.ToString("yyyy-MM-dd HH:mm:ss"));
                cmd.Parameters.AddWithValue("@to", toDt.ToString("yyyy-MM-dd HH:mm:ss"));

                using var reader = await cmd.ExecuteReaderAsync();
                var results = new List<Dictionary<string, object>>();
                while (await reader.ReadAsync())
                {
                    var row = Enumerable.Range(0, reader.FieldCount)
                        .ToDictionary(reader.GetName, reader.GetValue);
                    results.Add(row);
                }

                if (results.Count == 0)
                    return NotFound(new { message = "Product sales are not found" });

                return Ok(new
                {
                    message = "Product sales fetched successfully",
                    data = results,
                    discount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }
        [HttpPost("RevenueReport2")]
        public async Task<IActionResult> GetRevenueReport([FromBody] RevenueReportRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.StartDate) || string.IsNullOrEmpty(request.EndDate))
                return BadRequest(new { error = "StartDate and EndDate are required." });

            try
            {
                // Ensure the dates are in the correct format 'yyyy-MM-dd HH:mm:ss'
                DateTime startDate = DateTime.ParseExact(request.StartDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime endDate = DateTime.ParseExact(request.EndDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                // Adding one day to the end date to handle the next day's time frame
                DateTime nextDay = endDate.AddDays(1);

                using (var connection = new MySqlConnection(_configuration.GetConnectionString("Default")))
                {
                    await connection.OpenAsync();

                    var query = @"
                SELECT p1.mode, ROUND(p2.total_amount, 2) AS amount
                FROM (
                    SELECT p.mode
                    FROM tbl_payment p
                    WHERE p.locationid = @userid
                        AND p.mode IS NOT NULL
                        AND p.deleted = 0
                        AND p.createdon BETWEEN CONCAT(@startDate, ' ', @startTime) AND CONCAT(@nextDay, ' ', @endTime)
                    GROUP BY p.mode
                ) p1
                LEFT JOIN (
                    SELECT p.mode, SUM(amount) AS total_amount
                    FROM tbl_payment p
                    WHERE p.locationid = @userid
                        AND p.mode IS NOT NULL
                        AND p.deleted = 0
                        AND p.createdon BETWEEN CONCAT(@startDate, ' ', @startTime) AND CONCAT(@nextDay, ' ', @endTime)
                    GROUP BY p.mode
                ) p2 ON p1.mode = p2.mode;";

                    var cmd = new MySqlCommand(query, connection);

                    // Replace parameters with request values
                    cmd.Parameters.AddWithValue("@userid", request.UserId);
                    cmd.Parameters.AddWithValue("@startDate", startDate.ToString("yyyy-MM-dd"));
                    cmd.Parameters.AddWithValue("@startTime", "00:00:00"); // Assuming start time is midnight, adjust if needed
                    cmd.Parameters.AddWithValue("@endTime", "23:59:59");   // Assuming end time is end of the day
                    cmd.Parameters.AddWithValue("@nextDay", nextDay.ToString("yyyy-MM-dd"));

                    var results = new List<RevenueReportResult>();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            results.Add(new RevenueReportResult
                            {
                                Mode = reader["mode"].ToString(),
                                Amount = Convert.ToDecimal(reader["amount"])
                            });
                        }
                    }

                    return Ok(results);
                }
            }
            catch (FormatException ex)
            {
                return BadRequest(new { error = "Invalid date format.", details = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal server error.", details = ex.Message });
            }
        }

        [HttpPost("GetRevenueReportByUser")]
        public async Task<IActionResult> GetRevenueReportByUser([FromBody] RevenueReportRequest request)
        {
            MySqlConnection connection = null;

            try
            {
                // Assuming the user ID is passed in the request body (for simplicity)
                var userId = request.UserId;
                if (userId == 0)
                {
                    return Unauthorized(new { error = "Unauthorized: UserId is required" });
                }

                // Get the connection string from appsettings.json
                var connectionString = _configuration.GetConnectionString("Default");
                connection = new MySqlConnection(connectionString);

                await connection.OpenAsync();

                var startDate = request.StartDate;
                var endDate = request.EndDate;
                var selectedOption = request.SelectedOption; // You can further process this option as per your requirements

                // Get Start and End times
                var startTime = await GetStartTimeForDay4(startDate, connection);
                var endTime = await GetEndTimeForDay4(endDate, connection);
                var nextDay = AddOneDay(endDate);

                var query = @"
                    SELECT p2.usr AS Username, p1.mode, ROUND(p2.total_amount, 2) AS amount
                    FROM (
                        SELECT p.mode
                        FROM tbl_payment p
                        WHERE p.locationid = @UserId
                            AND p.mode IS NOT NULL
                            AND p.deleted = 0
                            AND p.createdon BETWEEN CONCAT(@StartDate, ' ', @StartTime) AND CONCAT(@NextDay, ' ', @EndTime)
                        GROUP BY p.mode
                    ) p1
                    LEFT JOIN (
                        SELECT p.usr, p.mode, SUM(amount) AS total_amount
                        FROM tbl_payment p
                        WHERE p.locationid = @UserId
                            AND p.mode IS NOT NULL
                            AND p.deleted = 0
                            AND p.createdon BETWEEN CONCAT(@StartDate, ' ', @StartTime) AND CONCAT(@NextDay, ' ', @EndTime)
                        GROUP BY p.usr, p.mode
                    ) p2 ON p1.mode = p2.mode
                    ORDER BY p2.usr";

                using (var cmd = new MySqlCommand(query, connection))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    cmd.Parameters.AddWithValue("@StartDate", startDate);
                    cmd.Parameters.AddWithValue("@StartTime", startTime);
                    cmd.Parameters.AddWithValue("@EndTime", endTime);
                    cmd.Parameters.AddWithValue("@NextDay", nextDay);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        var results = new List<RevenueReportResult>();

                        while (await reader.ReadAsync())
                        {
                            results.Add(new RevenueReportResult
                            {
                                Username = reader["Username"].ToString(),
                                Mode = reader["mode"].ToString(),
                                Amount = reader.GetDecimal("amount")
                            });
                        }

                        if (results.Count == 0)
                        {
                            return NotFound(new { error = "No data found" });
                        }

                        return Ok(results);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
            finally
            {
                if (connection != null)
                {
                    await connection.CloseAsync();
                }
            }
        }

        private async Task<string> GetStartTimeForDay4(string date, MySqlConnection connection)
        {
            // Implement logic to retrieve the start time based on the date.
            return "00:00:00"; // Placeholder
        }

        private async Task<string> GetEndTimeForDay4(string date, MySqlConnection connection)
        {
            // Implement logic to retrieve the end time based on the date.
            return "23:59:59"; // Placeholder
        }

        private string AddOneDay(string date)
        {
            var parsedDate = DateTime.Parse(date);
            return parsedDate.AddDays(1).ToString("yyyy-MM-dd");
        }
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
        [HttpPost("update-cash-mode")]
        public async Task<IActionResult> UpdateCashModeById([FromHeader] string userId, [FromBody] PaymentUpdateModel model)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "Unauthorized: Missing user ID" });
            }

            try
            {
                using var connection = new MySqlConnection(_configuration.GetConnectionString("Default"));
                await connection.OpenAsync();

                string query = @"UPDATE tbl_payment_modes 
                                 SET mode = @Mode, status = IFNULL(@Status, 0) 
                                 WHERE id = @Id AND locationid = @LocationId";

                var parameters = new
                {
                    Mode = model.Mode,
                    Status = model.Status,
                    Id = model.Id,
                    LocationId = userId
                };

                int affectedRows = await connection.ExecuteAsync(query, parameters);

                if (affectedRows > 0)
                {
                    return Ok(new { message = "Payment Mode updated successfully" });
                }
                else
                {
                    return NotFound(new { error = "Payment Mode not found or already up to date" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpPost("add-cash-mode")]
        public async Task<IActionResult> AddCashMode([FromHeader] string userId, [FromBody] PaymentAddModel model)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "Unauthorized: Missing user ID" });
            }

            try
            {
                using var connection = new MySqlConnection(_configuration.GetConnectionString("Default"));
                await connection.OpenAsync();

                var query = @"INSERT INTO tbl_payment_modes (mode, status, locationid) 
                              VALUES (@Mode, @Status, @LocationId)";

                var parameters = new
                {
                    Mode = model.Mode,
                    Status = model.Status,
                    LocationId = userId
                };

                await connection.ExecuteAsync(query, parameters);

                return Ok(new { message = "Payment Mode added successfully" });
            }
            catch (MySqlException ex) when (ex.Number == 1062) // ER_DUP_ENTRY
            {
                return BadRequest(new { error = "Payment Mode already exists, Try again" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message ?? "Internal Server Error" });
            }
        }
        [HttpPost("get-reason-by-id")]
        public async Task<IActionResult> GetRefundReasonById([FromHeader] string userId, [FromBody] RefundReasonRequest request)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "Unauthorized: Missing user ID" });
            }

            try
            {
                using var connection = new MySqlConnection(_configuration.GetConnectionString("Default"));
                await connection.OpenAsync();

                var query = @"SELECT * FROM tbl_refund_reasons 
                              WHERE id = @Id AND locationid = @LocationId";

                var result = await connection.QueryFirstOrDefaultAsync<dynamic>(query, new
                {
                    Id = request.Id,
                    LocationId = userId
                });

                if (result == null)
                {
                    return NotFound(new { error = "Refund reason not found" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message ?? "Internal Server Error" });
            }
        }
        [HttpPost("update-reason-by-id")]
        public async Task<IActionResult> UpdateReasonById([FromHeader] string userId, [FromBody] UpdateReasonRequest model)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "Unauthorized: Missing user ID" });
            }

            try
            {
                using var connection = new MySqlConnection(_configuration.GetConnectionString("Default"));
                await connection.OpenAsync();

                var query = @"UPDATE tbl_refund_reasons 
                              SET reason = @Reason, status = @Status 
                              WHERE id = @Id AND locationid = @LocationId";

                var affectedRows = await connection.ExecuteAsync(query, new
                {
                    Reason = model.Reason,
                    Status = model.Status,
                    Id = model.Id,
                    LocationId = userId
                });

                if (affectedRows == 0)
                {
                    return NotFound(new { error = "Refund reason not found or not updated" });
                }

                return Ok(new { message = "Category updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message ?? "Internal Server Error" });
            }
        }
        [HttpPost("get-cash-mode-by-id")]
        public async Task<IActionResult> GetCashModeById([FromBody] GetCashModeRequest model)
        {
            if (model.LocationId <= 0)
            {
                return BadRequest(new { error = "Invalid location ID" });
            }

            try
            {
                using var connection = new MySqlConnection(_configuration.GetConnectionString("Default"));
                await connection.OpenAsync();

                var query = "SELECT * FROM tbl_payment_modes WHERE id = @Id AND locationid = @LocationId";

                var result = await connection.QueryFirstOrDefaultAsync<dynamic>(query, new
                {
                    model.Id,
                    model.LocationId
                });

                if (result == null)
                {
                    return NotFound(new { error = "Payment mode not found" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message ?? "Internal Server Error" });
            }
        }
    }
}
