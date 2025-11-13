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
    public class CardProductController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CardProductController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Get all card products (Card category only)
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetCardProducts()
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

                string query = @"SELECT * FROM tbl_product 
                                WHERE category = 'Card category'
                                ORDER BY id DESC";

                using var cmd = new MySqlCommand(query, connection);
                using var reader = await cmd.ExecuteReaderAsync();

                var products = new List<Dictionary<string, object>>();
                while (await reader.ReadAsync())
                {
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                    }
                    products.Add(row);
                }

                Console.WriteLine($"✅ Found {products.Count} card products");

                return Ok(products);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Get card product by ID
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetCardProductById([FromBody] JsonElement request)
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
                    return BadRequest(new { error = "Product ID is required" });
                }

                var id = idElement.GetInt32();
                if (id == 0)
                {
                    return BadRequest(new { error = "Product ID is required" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string query = @"SELECT * FROM tbl_product 
                                WHERE id = @id AND category = 'Card category'";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", id);

                using var reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                {
                    return NotFound(new { error = "Card product not found" });
                }

                var product = new Dictionary<string, object>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    product[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Add new card product
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddCardProduct([FromBody] Dictionary<string, object> request)
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                var userName = User.FindFirst("name")?.Value ?? "Admin";

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Token missing user ID" });
                }

                Console.WriteLine($"📥 Received request: {System.Text.Json.JsonSerializer.Serialize(request)}");

                // Helper function to safely get values - FIXED for JsonElement
                T GetValue<T>(string key, T defaultValue = default(T))
                {
                    try
                    {
                        if (!request.ContainsKey(key) || request[key] == null)
                        {
                            Console.WriteLine($"⚠️ Key '{key}' not found or null, using default: {defaultValue}");
                            return defaultValue;
                        }

                        var value = request[key];
                        Console.WriteLine($"🔍 Key '{key}' found with raw value: {value} (Type: {value.GetType().Name})");

                        // Handle JsonElement type (from System.Text.Json)
                        if (value is JsonElement jsonElement)
                        {
                            Console.WriteLine($"   JsonElement ValueKind: {jsonElement.ValueKind}");

                            if (typeof(T) == typeof(string))
                            {
                                var result = jsonElement.ValueKind == JsonValueKind.String ? jsonElement.GetString() : jsonElement.ToString();
                                Console.WriteLine($"✅ Converted '{key}' to string: {result}");
                                return (T)(object)result;
                            }
                            if (typeof(T) == typeof(int) || typeof(T) == typeof(int?))
                            {
                                var result = jsonElement.GetInt32();
                                Console.WriteLine($"✅ Converted '{key}' to int: {result}");
                                return (T)(object)result;
                            }
                            if (typeof(T) == typeof(decimal) || typeof(T) == typeof(decimal?))
                            {
                                var result = jsonElement.GetDecimal();
                                Console.WriteLine($"✅ Converted '{key}' to decimal: {result}");
                                return (T)(object)result;
                            }
                            if (typeof(T) == typeof(bool))
                            {
                                var result = jsonElement.GetBoolean();
                                Console.WriteLine($"✅ Converted '{key}' to bool: {result}");
                                return (T)(object)result;
                            }
                        }

                        // Fallback to standard conversion
                        if (typeof(T) == typeof(string))
                            return (T)(object)value.ToString();
                        if (typeof(T) == typeof(int) || typeof(T) == typeof(int?))
                            return (T)(object)Convert.ToInt32(value);
                        if (typeof(T) == typeof(decimal) || typeof(T) == typeof(decimal?))
                        {
                            var decimalValue = Convert.ToDecimal(value);
                            Console.WriteLine($"✅ Converted '{key}' to decimal: {decimalValue}");
                            return (T)(object)decimalValue;
                        }
                        if (typeof(T) == typeof(bool))
                            return (T)(object)Convert.ToBoolean(value);

                        return defaultValue;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Error getting value for key '{key}': {ex.Message}");
                        Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
                        return defaultValue;
                    }
                }

                // Validation - only ProductName is required
                var productName = GetValue<string>("ProductName", null);

                if (string.IsNullOrWhiteSpace(productName))
                {
                    Console.WriteLine($"❌ ProductName validation failed");
                    return BadRequest(new { error = "Product name is required" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string insertQuery = @"
                    INSERT INTO tbl_product 
                    (productname, category, ptype, rate, tax, status, sequence, bonus, duration, 
                     cashbalance, timebandtype, taxtype, gateip, depositamount, kot, favoriteflag, 
                     customercard, kiosk, regman, typegate, gatevalue, commonflag, expiry, 
                     enableled, green, blue, red, locationid, 
                     taxpercent, pricenotax, lastupdateddate, lastupdateduser, 
                     displayinpos, facevalue, sellingprice, membership, cardvalidity, 
                     cardexpirydate, vipcard, poscounter, taxcategory, cardquantity, accessprofile) 
                    VALUES 
                    (@productname, @category, @ptype, @rate, @tax, @status, @sequence, @bonus, 
                     @duration, @cashbalance, @timebandtype, @taxtype, @gateip, @depositamount, 
                     @kot, @favoriteflag, @customercard, @kiosk, @regman, @typegate, @gatevalue, 
                     @commonflag, @expiry, @enableled, @green, @blue, @red, @locationid, 
                     @taxpercent, @pricenotax, @lastupdateddate, @lastupdateduser, @displayinpos, 
                     @facevalue, @sellingprice, @membership, @cardvalidity, @cardexpirydate, 
                     @vipcard, @poscounter, @taxcategory, @cardquantity, @accessprofile)";

                using var cmd = new MySqlCommand(insertQuery, connection);

                var rate = GetValue<decimal>("Rate", 0);
                var faceValue = GetValue<decimal>("FaceValue", 0);
                var cashBalance = GetValue<decimal>("CashBalance", 0);
                var sellingPrice = GetValue<decimal>("SellingPrice", 0);
                var bonus = GetValue<decimal>("Bonus", 0);
                var taxPercent = GetValue<decimal>("TaxPercent", 0);
                var priceNoTax = GetValue<decimal>("PriceNoTax", 0);
                var cardExpiryDate = GetValue<string>("CardExpiryDate", null);

                Console.WriteLine($"📊 Parsed values - FaceValue: {faceValue}, SellingPrice: {sellingPrice}, CashBalance: {cashBalance}, Bonus: {bonus}");

                cmd.Parameters.AddWithValue("@productname", productName);
                cmd.Parameters.AddWithValue("@category", "Card category");
                cmd.Parameters.AddWithValue("@ptype", GetValue("PType", "New Card"));
                cmd.Parameters.AddWithValue("@rate", faceValue > 0 ? faceValue : rate);
                cmd.Parameters.AddWithValue("@tax", GetValue<decimal>("Tax", 0));
                cmd.Parameters.AddWithValue("@status", GetValue("Status", "1"));
                cmd.Parameters.AddWithValue("@sequence", GetValue<int>("Sequence", 0));
                cmd.Parameters.AddWithValue("@bonus", bonus);
                cmd.Parameters.AddWithValue("@duration", GetValue<int>("Duration", 0));
                cmd.Parameters.AddWithValue("@cashbalance", cashBalance);
                cmd.Parameters.AddWithValue("@timebandtype", GetValue("TimebandType", "Flexible"));
                cmd.Parameters.AddWithValue("@taxtype", GetValue("TaxType", "Included"));
                cmd.Parameters.AddWithValue("@gateip", GetValue("GateIp", ""));
                cmd.Parameters.AddWithValue("@depositamount", GetValue<decimal>("DepositAmount", 0));
                cmd.Parameters.AddWithValue("@kot", GetValue<int>("Kot", 0));
                cmd.Parameters.AddWithValue("@favoriteflag", GetValue<int>("FavoriteFlag", 0));
                cmd.Parameters.AddWithValue("@customercard", GetValue<int>("CustomerCard", 0));
                cmd.Parameters.AddWithValue("@kiosk", GetValue<int>("Kiosk", 0));
                cmd.Parameters.AddWithValue("@regman", GetValue<int>("RegMan", 0));
                cmd.Parameters.AddWithValue("@typegate", GetValue("TypeGate", ""));
                cmd.Parameters.AddWithValue("@gatevalue", GetValue("GateValue", ""));
                cmd.Parameters.AddWithValue("@commonflag", GetValue<int>("CommonFlag", 0));
                cmd.Parameters.AddWithValue("@expiry", GetValue<int>("Expiry", 0));
                cmd.Parameters.AddWithValue("@enableled", GetValue<int>("EnableLed", 0));
                cmd.Parameters.AddWithValue("@green", GetValue<int>("Green", 0));
                cmd.Parameters.AddWithValue("@blue", GetValue<int>("Blue", 0));
                cmd.Parameters.AddWithValue("@red", GetValue<int>("Red", 0));
                cmd.Parameters.AddWithValue("@locationid", int.Parse(userId));
                cmd.Parameters.AddWithValue("@taxpercent", taxPercent);
                cmd.Parameters.AddWithValue("@pricenotax", priceNoTax > 0 ? priceNoTax : faceValue);
                cmd.Parameters.AddWithValue("@lastupdateddate", DateTime.Now);
                cmd.Parameters.AddWithValue("@lastupdateduser", userName);
                cmd.Parameters.AddWithValue("@displayinpos", GetValue("DisplayInPos", "1"));
                cmd.Parameters.AddWithValue("@facevalue", faceValue);
                cmd.Parameters.AddWithValue("@sellingprice", sellingPrice > 0 ? sellingPrice : faceValue);
                cmd.Parameters.AddWithValue("@membership", GetValue("Membership", ""));
                cmd.Parameters.AddWithValue("@cardvalidity", GetValue<int>("CardValidity", 0));
                cmd.Parameters.AddWithValue("@cardexpirydate", string.IsNullOrWhiteSpace(cardExpiryDate) ? (object)DBNull.Value : DateTime.Parse(cardExpiryDate));
                cmd.Parameters.AddWithValue("@vipcard", GetValue<int>("VipCard", 0));
                cmd.Parameters.AddWithValue("@poscounter", GetValue("PosCounter", ""));
                cmd.Parameters.AddWithValue("@taxcategory", GetValue("TaxCategory", ""));
                cmd.Parameters.AddWithValue("@cardquantity", GetValue<int>("CardQuantity", 0));
                cmd.Parameters.AddWithValue("@accessprofile", GetValue("AccessProfile", ""));

                Console.WriteLine("✅ All parameters added successfully");
                await cmd.ExecuteNonQueryAsync();

                Console.WriteLine("✅ Card product added successfully");
                return Ok(new { message = "Card product added successfully" });
            }
            catch (MySqlException ex) when (ex.Number == 1062)
            {
                return BadRequest(new { error = "Card product already exists" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error details: {ex.Message}");
                Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Update card product
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UpdateCardProduct([FromBody] CardProductModel product)
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                var userName = User.FindFirst("name")?.Value ?? "Admin";

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Token missing user ID" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

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
                        depositamount = @depositamount,
                        kot = @kot,
                        favoriteflag = @favoriteflag,
                        customercard = @customercard,
                        kiosk = @kiosk,
                        regman = @regman,
                        typegate = @typegate,
                        gatevalue = @gatevalue,
                        commonflag = @commonflag,
                        expiry = @expiry,
                        enableled = @enableled,
                        green = @green,
                        blue = @blue,
                        red = @red,
                        taxpercent = @taxpercent,
                        pricenotax = @pricenotax,
                        lastupdateddate = @lastupdateddate,
                        lastupdateduser = @lastupdateduser,
                        displayinpos = @displayinpos,
                        facevalue = @facevalue,
                        sellingprice = @sellingprice,
                        membership = @membership,
                        cardvalidity = @cardvalidity,
                        cardexpirydate = @cardexpirydate,
                        vipcard = @vipcard,
                        poscounter = @poscounter,
                        taxcategory = @taxcategory,
                        cardquantity = @cardquantity,
                        accessprofile = @accessprofile
                    WHERE id = @id";

                using var cmd = new MySqlCommand(query, connection);

                cmd.Parameters.AddWithValue("@productname", product.productname ?? "");
                cmd.Parameters.AddWithValue("@category", "Card category");
                cmd.Parameters.AddWithValue("@ptype", product.ptype ?? "New Card");
                cmd.Parameters.AddWithValue("@rate", product.rate);
                cmd.Parameters.AddWithValue("@tax", product.tax);
                cmd.Parameters.AddWithValue("@status", product.status ?? "1");
                cmd.Parameters.AddWithValue("@sequence", product.sequence);
                cmd.Parameters.AddWithValue("@bonus", product.bonus);
                cmd.Parameters.AddWithValue("@duration", product.duration);
                cmd.Parameters.AddWithValue("@cashbalance", product.cashbalance);
                cmd.Parameters.AddWithValue("@timebandtype", product.timebandtype ?? "Flexible");
                cmd.Parameters.AddWithValue("@taxtype", product.taxtype ?? "Included");
                cmd.Parameters.AddWithValue("@gateip", product.gateip ?? "");
                cmd.Parameters.AddWithValue("@depositamount", product.depositamount);
                cmd.Parameters.AddWithValue("@kot", product.kot);
                cmd.Parameters.AddWithValue("@favoriteflag", product.favoriteflag);
                cmd.Parameters.AddWithValue("@customercard", product.customercard);
                cmd.Parameters.AddWithValue("@kiosk", product.kiosk);
                cmd.Parameters.AddWithValue("@regman", product.regman);
                cmd.Parameters.AddWithValue("@typegate", product.typegate ?? "");
                cmd.Parameters.AddWithValue("@gatevalue", product.gatevalue ?? "");
                cmd.Parameters.AddWithValue("@commonflag", product.commonflag);
                cmd.Parameters.AddWithValue("@expiry", product.expiry);
                cmd.Parameters.AddWithValue("@enableled", product.enableled);
                cmd.Parameters.AddWithValue("@green", product.green);
                cmd.Parameters.AddWithValue("@blue", product.blue);
                cmd.Parameters.AddWithValue("@red", product.red);
                cmd.Parameters.AddWithValue("@taxpercent", product.taxpercent.HasValue ? product.taxpercent.Value : 0);
                cmd.Parameters.AddWithValue("@pricenotax", product.pricenotax.HasValue ? product.pricenotax.Value : product.rate);
                cmd.Parameters.AddWithValue("@lastupdateddate", DateTime.Now);
                cmd.Parameters.AddWithValue("@lastupdateduser", userName);
                cmd.Parameters.AddWithValue("@displayinpos", product.displayinpos ?? "1");
                cmd.Parameters.AddWithValue("@facevalue", product.facevalue.HasValue ? product.facevalue.Value : product.rate);
                cmd.Parameters.AddWithValue("@sellingprice", product.sellingprice.HasValue ? product.sellingprice.Value : product.rate);
                cmd.Parameters.AddWithValue("@membership", product.membership ?? "");
                cmd.Parameters.AddWithValue("@cardvalidity", product.cardvalidity.HasValue ? product.cardvalidity.Value : 0);
                cmd.Parameters.AddWithValue("@cardexpirydate", product.cardexpirydate.HasValue ? (object)product.cardexpirydate.Value : DBNull.Value);
                cmd.Parameters.AddWithValue("@vipcard", product.vipcard);
                cmd.Parameters.AddWithValue("@poscounter", product.poscounter ?? "");
                cmd.Parameters.AddWithValue("@taxcategory", product.taxcategory ?? "");
                cmd.Parameters.AddWithValue("@cardquantity", product.cardquantity.HasValue ? product.cardquantity.Value : 0);
                cmd.Parameters.AddWithValue("@accessprofile", product.accessprofile ?? "");
                cmd.Parameters.AddWithValue("@id", product.id);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    Console.WriteLine("✅ Card product updated successfully");
                    return Ok(new { message = "Card product updated successfully" });
                }
                else
                {
                    return NotFound(new { error = "Card product not found" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error details: {ex.Message}");
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Delete card product (soft delete by setting status to 0)
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> DeleteCardProduct([FromBody] JsonElement request)
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
                    return BadRequest(new { error = "Product ID is required" });
                }

                var id = idElement.GetInt32();
                if (id == 0)
                {
                    return BadRequest(new { error = "Product ID is required" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string query = @"UPDATE tbl_product 
                                SET status = '0' 
                                WHERE id = @id";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", id);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    return Ok(new { message = "Card product deleted successfully" });
                }
                else
                {
                    return NotFound(new { error = "Card product not found" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }
    }
}