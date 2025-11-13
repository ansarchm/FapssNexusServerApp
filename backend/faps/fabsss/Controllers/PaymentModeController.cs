using Dapper;
using fabsss.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace fabsss.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentModeController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public PaymentModeController(IConfiguration configuration)
        {
            _configuration = configuration;
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
        [HttpPost("get-cash-mode")]
        public async Task<IActionResult> GetCashMode([FromBody] GetCashModeRequest model)
        {
            if (model.LocationId <= 0)
            {
                return BadRequest(new { error = "Invalid location ID" });
            }

            try
            {
                using var connection = new MySqlConnection(_configuration.GetConnectionString("Default"));
                await connection.OpenAsync();

                var query = @"SELECT * 
                      FROM tbl_payment_modes 
                      WHERE locationid = @LocationId";

                var result = await connection.QueryAsync<dynamic>(query, new
                {
                    model.LocationId
                });

                if (result == null || !result.Any())
                {
                    return NotFound(new { error = "No payment modes found" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message ?? "Internal Server Error" });
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



    }
}
