using fabsss.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace fabsss.Controllers
{
    [ApiController]
    [Route("api/[Action]")]
    public class ComboProductController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ComboProductController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Get all combo products (Combo List category only)
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetComboProducts()
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
                                WHERE category = 'Combo List'
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

                Console.WriteLine($"✅ Found {products.Count} combo products");

                return Ok(products);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Get combo product by ID
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetComboProductById([FromBody] ComboProductRequest request)
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
                                WHERE id = @id AND category = 'Combo List'";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", request.Id);

                using var reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                {
                    return NotFound(new { error = "Combo product not found" });
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

        // Add new combo product
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddComboProduct([FromBody] ComboProductRequest request)
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

                string insertQuery = @"
                    INSERT INTO tbl_product 
                    (productname, category, ptype, rate, tax, status, sequence, bonus, duration, 
                     cashbalance, timebandtype, taxtype, gateip, depositamount, kot, favoriteflag, 
                     customercard, kiosk, regman, typegate, gatevalue, commonflag, expiry, 
                     enableled, green, blue, red, locationid, membership, cardvalidity, cardexpirydate, 
                     vipcard, poscounter, taxcategory, taxpercent, pricenotax, lastupdateddate, lastupdateduser, 
                     displayinpos, facevalue, sellingprice, cardquantity, accessprofile) 
                    VALUES 
                    (@productname, @category, @ptype, @rate, @tax, @status, @sequence, @bonus, 
                     @duration, @cashbalance, @timebandtype, @taxtype, @gateip, @depositamount, 
                     @kot, @favoriteflag, @customercard, @kiosk, @regman, @typegate, @gatevalue, 
                     @commonflag, @expiry, @enableled, @green, @blue, @red, @locationid, @membership, 
                     @cardvalidity, @cardexpirydate, @vipcard, @poscounter, @taxcategory, @taxpercent, 
                     @pricenotax, @lastupdateddate, @lastupdateduser, @displayinpos, @facevalue, 
                     @sellingprice, @cardquantity, @accessprofile)";

                using var cmd = new MySqlCommand(insertQuery, connection);

                cmd.Parameters.AddWithValue("@productname", request.ProductName ?? "");
                cmd.Parameters.AddWithValue("@category", "Combo List");
                cmd.Parameters.AddWithValue("@ptype", request.PType ?? "Combo");
                cmd.Parameters.AddWithValue("@rate", request.Rate);
                cmd.Parameters.AddWithValue("@tax", request.Tax);
                cmd.Parameters.AddWithValue("@status", request.Status ?? "1");
                cmd.Parameters.AddWithValue("@sequence", request.Sequence);
                cmd.Parameters.AddWithValue("@bonus", request.Bonus);
                cmd.Parameters.AddWithValue("@duration", request.Duration);
                cmd.Parameters.AddWithValue("@cashbalance", request.CashBalance > 0 ? request.CashBalance : request.Rate);
                cmd.Parameters.AddWithValue("@timebandtype", request.TimebandType ?? "Flexible");
                cmd.Parameters.AddWithValue("@taxtype", request.TaxType ?? "Included");
                cmd.Parameters.AddWithValue("@gateip", request.GateIp ?? "");
                cmd.Parameters.AddWithValue("@depositamount", request.DepositAmount);
                cmd.Parameters.AddWithValue("@kot", request.Kot);
                cmd.Parameters.AddWithValue("@favoriteflag", request.FavoriteFlag);
                cmd.Parameters.AddWithValue("@customercard", request.CustomerCard);
                cmd.Parameters.AddWithValue("@kiosk", request.Kiosk);
                cmd.Parameters.AddWithValue("@regman", request.RegMan);
                cmd.Parameters.AddWithValue("@typegate", request.TypeGate ?? "");
                cmd.Parameters.AddWithValue("@gatevalue", request.GateValue ?? "");
                cmd.Parameters.AddWithValue("@commonflag", request.CommonFlag);
                cmd.Parameters.AddWithValue("@expiry", request.Expiry);
                cmd.Parameters.AddWithValue("@enableled", request.EnableLed);
                cmd.Parameters.AddWithValue("@green", request.Green);
                cmd.Parameters.AddWithValue("@blue", request.Blue);
                cmd.Parameters.AddWithValue("@red", request.Red);
                cmd.Parameters.AddWithValue("@locationid", int.Parse(userId));

                // Combo-specific fields
                cmd.Parameters.AddWithValue("@membership", request.Membership ?? "");
                cmd.Parameters.AddWithValue("@cardvalidity", request.CardValidity ?? request.Duration);
                cmd.Parameters.AddWithValue("@cardexpirydate", request.CardExpiryDate);
                cmd.Parameters.AddWithValue("@vipcard", request.VipCard);
                cmd.Parameters.AddWithValue("@poscounter", request.PosCounter ?? "");
                cmd.Parameters.AddWithValue("@taxcategory", request.TaxCategory ?? "");
                cmd.Parameters.AddWithValue("@taxpercent", request.TaxPercent ?? request.Tax);
                cmd.Parameters.AddWithValue("@pricenotax", request.PriceNoTax ?? request.Rate);
                cmd.Parameters.AddWithValue("@lastupdateddate", DateTime.Now);
                cmd.Parameters.AddWithValue("@lastupdateduser", userName);
                cmd.Parameters.AddWithValue("@displayinpos", request.DisplayInPos ?? "1");
                cmd.Parameters.AddWithValue("@facevalue", request.FaceValue ?? request.Rate);
                cmd.Parameters.AddWithValue("@sellingprice", request.SellingPrice ?? request.Rate);
                cmd.Parameters.AddWithValue("@cardquantity", request.CardQuantity ?? 0);
                cmd.Parameters.AddWithValue("@accessprofile", request.AccessProfile ?? "");

                await cmd.ExecuteNonQueryAsync();

                return Ok(new { message = "Combo product added successfully" });
            }
            catch (MySqlException ex) when (ex.Number == 1062)
            {
                return BadRequest(new { error = "Combo product already exists" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Update combo product
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UpdateComboProduct([FromBody] ComboProductModel product)
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
                        membership = @membership,
                        cardvalidity = @cardvalidity,
                        cardexpirydate = @cardexpirydate,
                        vipcard = @vipcard,
                        poscounter = @poscounter,
                        taxcategory = @taxcategory,
                        taxpercent = @taxpercent,
                        pricenotax = @pricenotax,
                        lastupdateddate = @lastupdateddate,
                        lastupdateduser = @lastupdateduser,
                        displayinpos = @displayinpos,
                        facevalue = @facevalue,
                        sellingprice = @sellingprice,
                        cardquantity = @cardquantity,
                        accessprofile = @accessprofile
                    WHERE id = @id";

                using var cmd = new MySqlCommand(query, connection);

                cmd.Parameters.AddWithValue("@productname", product.productname ?? "");
                cmd.Parameters.AddWithValue("@category", "Combo List");
                cmd.Parameters.AddWithValue("@ptype", product.ptype ?? "Combo");
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

                // Combo-specific fields
                cmd.Parameters.AddWithValue("@membership", product.membership ?? "");
                cmd.Parameters.AddWithValue("@cardvalidity", product.cardvalidity ?? product.duration);
                cmd.Parameters.AddWithValue("@cardexpirydate", product.cardexpirydate);
                cmd.Parameters.AddWithValue("@vipcard", product.vipcard);
                cmd.Parameters.AddWithValue("@poscounter", product.poscounter ?? "");
                cmd.Parameters.AddWithValue("@taxcategory", product.taxcategory ?? "");
                cmd.Parameters.AddWithValue("@taxpercent", product.taxpercent ?? product.tax);
                cmd.Parameters.AddWithValue("@pricenotax", product.pricenotax ?? product.rate);
                cmd.Parameters.AddWithValue("@lastupdateddate", DateTime.Now);
                cmd.Parameters.AddWithValue("@lastupdateduser", userName);
                cmd.Parameters.AddWithValue("@displayinpos", product.displayinpos ?? "1");
                cmd.Parameters.AddWithValue("@facevalue", product.facevalue ?? product.rate);
                cmd.Parameters.AddWithValue("@sellingprice", product.sellingprice ?? product.rate);
                cmd.Parameters.AddWithValue("@cardquantity", product.cardquantity ?? 0);
                cmd.Parameters.AddWithValue("@accessprofile", product.accessprofile ?? "");

                cmd.Parameters.AddWithValue("@id", product.id);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    return Ok(new { message = "Combo product updated successfully" });
                }
                else
                {
                    return NotFound(new { error = "Combo product not found" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Delete combo product (soft delete by setting status to 0)
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> DeleteComboProduct([FromBody] ComboProductRequest request)
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

                string query = @"UPDATE tbl_product 
                                SET status = '0' 
                                WHERE id = @id";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", request.Id);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    return Ok(new { message = "Combo product deleted successfully" });
                }
                else
                {
                    return NotFound(new { error = "Combo product not found" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }
    }
}