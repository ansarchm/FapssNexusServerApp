using fabsss.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace fabsss.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public LocationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET: api/Location/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllLocations()
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string query = "SELECT * FROM tbl_location ORDER BY id";
                using var cmd = new MySqlCommand(query, connection);

                using var reader = await cmd.ExecuteReaderAsync();
                var result = new List<Dictionary<string, object>>();

                while (await reader.ReadAsync())
                {
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                        row[reader.GetName(i)] = reader.GetValue(i);
                    result.Add(row);
                }

                return Ok(new { data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // GET: api/Location/details/{locationId}
        [HttpGet("details/{locationId}")]
        public async Task<IActionResult> GetLocationDetails(int locationId)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string query = "SELECT * FROM tbl_location WHERE id = @id";
                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", locationId);

                using var reader = await cmd.ExecuteReaderAsync();
                var result = new List<Dictionary<string, object>>();

                while (await reader.ReadAsync())
                {
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                        row[reader.GetName(i)] = reader.GetValue(i);
                    result.Add(row);
                }

                if (result.Count == 0)
                    return NotFound(new { message = "Location not found" });

                return Ok(new { data = result[0] });
            }

            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // PUT: api/Location/update
        [HttpPut("update")]
        public async Task<IActionResult> UpdateLocationDetails([FromBody] UpdateLocationRequest request)
        {
            MySqlConnection connection = null;

            try
            {
                var connectionString = _configuration.GetConnectionString("Default");
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

                if (result == 0)
                    return NotFound(new { message = "Location not found or no changes made" });

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
    }
}