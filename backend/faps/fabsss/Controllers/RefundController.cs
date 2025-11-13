using fabsss.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Dapper;

namespace fabsss.Controllers
{
    [ApiController]
    [Route("api/[Action]")]
    public class RefundReasonController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RefundReasonController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("get-reason-by-id")]
        public async Task<IActionResult> GetRefundReasonById(
            [FromHeader] string userId,
            [FromBody] RefundReasonRequest request)
        {
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { error = "Unauthorized: Missing user ID" });

            try
            {
                using var connection = new MySqlConnection(_configuration.GetConnectionString("Default"));
                await connection.OpenAsync();

                var query = @"SELECT * FROM tbl_refund_reasons 
                              WHERE id = @Id AND locationid = @LocationId";

                var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    query,
                    new { Id = request.Id, LocationId = userId }
                );

                if (result == null)
                    return NotFound(new { error = "Refund reason not found" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message ?? "Internal Server Error" });
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
       


        [HttpPost("update-reason-by-id")]
        public async Task<IActionResult> UpdateReasonById(
            [FromHeader] string userId,
            [FromBody] UpdateReasonRequest model)
        {
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { error = "Unauthorized: Missing user ID" });

            try
            {
                using var connection = new MySqlConnection(_configuration.GetConnectionString("Default"));
                await connection.OpenAsync();

                var query = @"UPDATE tbl_refund_reasons 
                              SET reason = @Reason, status = @Status 
                              WHERE id = @Id AND locationid = @LocationId";

                var affectedRows = await connection.ExecuteAsync(
                    query,
                    new { Reason = model.Reason, Status = model.Status, Id = model.Id, LocationId = userId }
                );

                if (affectedRows == 0)
                    return NotFound(new { error = "Refund reason not found or not updated" });

                return Ok(new { message = "Category updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message ?? "Internal Server Error" });
            }
        }
    }
}
