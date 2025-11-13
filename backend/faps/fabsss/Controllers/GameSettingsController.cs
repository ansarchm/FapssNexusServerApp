using fabsss.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json;
using System.Net.Sockets;
using System.Text;

namespace fabsss.Controllers
{
    [ApiController]
    [Route("api/[Action]")]
    public class GameSettingsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public GameSettingsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Get all game settings
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetAllGameSettings()
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

                string query = @"SELECT * FROM GameSettings ORDER BY Id DESC";

                using var cmd = new MySqlCommand(query, connection);
                using var reader = await cmd.ExecuteReaderAsync();

                var gameSettings = new List<Dictionary<string, object>>();
                while (await reader.ReadAsync())
                {
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                    }
                    gameSettings.Add(row);
                }

                Console.WriteLine($"✅ Found {gameSettings.Count} game settings");

                return Ok(gameSettings);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Get game setting by ID
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GetGameSettingById([FromBody] JsonElement request)
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
                    return BadRequest(new { error = "Game setting ID is required" });
                }

                var id = idElement.GetInt32();
                if (id == 0)
                {
                    return BadRequest(new { error = "Game setting ID is required" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string query = @"SELECT * FROM GameSettings WHERE Id = @id";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", id);

                using var reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                {
                    return NotFound(new { error = "Game setting not found" });
                }

                var gameSetting = new Dictionary<string, object>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    gameSetting[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                }

                return Ok(gameSetting);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Add new game setting
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddGameSetting([FromBody] Dictionary<string, object> request)
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

                // Helper function to safely get values
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

                        // Handle JsonElement type
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
                        return defaultValue;
                    }
                }

                // Validation
                var description = GetValue<string>("Description", null);
                if (string.IsNullOrWhiteSpace(description))
                {
                    Console.WriteLine($"❌ Description validation failed");
                    return BadRequest(new { error = "Description is required" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string insertQuery = @"
                    INSERT INTO GameSettings 
                    (Description, MacId, Category, SubCategory, CashPlayPrice, VipDiscountPrice, 
                     CoinPlayPrice, GameInterface, CurrencyDecimalPlace, DebitOrder, PulseWidth, 
                     PulsePauseWidth, PulseToActuate, RfidTapDelay, DisplayOrientation, LedPattern, 
                     LastUpdatedDate, LastUpdatedUser, CreatedDate) 
                    VALUES 
                    (@Description, @MacId, @Category, @SubCategory, @CashPlayPrice, @VipDiscountPrice, 
                     @CoinPlayPrice, @GameInterface, @CurrencyDecimalPlace, @DebitOrder, @PulseWidth, 
                     @PulsePauseWidth, @PulseToActuate, @RfidTapDelay, @DisplayOrientation, @LedPattern, 
                     @LastUpdatedDate, @LastUpdatedUser, @CreatedDate)";

                using var cmd = new MySqlCommand(insertQuery, connection);

                cmd.Parameters.AddWithValue("@Description", description);
                cmd.Parameters.AddWithValue("@MacId", GetValue<string>("MacId", ""));
                cmd.Parameters.AddWithValue("@Category", GetValue<string>("Category", ""));
                cmd.Parameters.AddWithValue("@SubCategory", GetValue<string>("SubCategory", ""));
                cmd.Parameters.AddWithValue("@CashPlayPrice", GetValue<decimal>("CashPlayPrice", 0));
                cmd.Parameters.AddWithValue("@VipDiscountPrice", GetValue<decimal>("VipDiscountPrice", 0));
                cmd.Parameters.AddWithValue("@CoinPlayPrice", GetValue<decimal>("CoinPlayPrice", 0));
                cmd.Parameters.AddWithValue("@GameInterface", GetValue<string>("GameInterface", ""));
                cmd.Parameters.AddWithValue("@CurrencyDecimalPlace", GetValue<string>("CurrencyDecimalPlace", ""));
                cmd.Parameters.AddWithValue("@DebitOrder", GetValue<string>("DebitOrder", ""));
                cmd.Parameters.AddWithValue("@PulseWidth", GetValue<string>("PulseWidth", ""));
                cmd.Parameters.AddWithValue("@PulsePauseWidth", GetValue<string>("PulsePauseWidth", ""));
                cmd.Parameters.AddWithValue("@PulseToActuate", GetValue<string>("PulseToActuate", ""));
                cmd.Parameters.AddWithValue("@RfidTapDelay", GetValue<string>("RfidTapDelay", ""));
                cmd.Parameters.AddWithValue("@DisplayOrientation", GetValue<string>("DisplayOrientation", ""));
                cmd.Parameters.AddWithValue("@LedPattern", GetValue<string>("LedPattern", ""));
                cmd.Parameters.AddWithValue("@LastUpdatedDate", DateTime.Now);
                cmd.Parameters.AddWithValue("@LastUpdatedUser", userName);
                cmd.Parameters.AddWithValue("@CreatedDate", DateTime.Now);

                Console.WriteLine("✅ All parameters added successfully");
                await cmd.ExecuteNonQueryAsync();

                // Send TCP command after successful insert
                try
                {
                    SendTcpCommand("192.168.29.54", 6666, "RESTART");
                }
                catch (Exception tcpEx)
                {
                    Console.WriteLine($"⚠️ TCP command failed: {tcpEx.Message}");
                    // Don't fail the entire operation if TCP fails
                }

                Console.WriteLine("✅ Game setting added successfully");
                return Ok(new { message = "Game setting added successfully" });
            }
            catch (MySqlException ex) when (ex.Number == 1062)
            {
                return BadRequest(new { error = "Game setting already exists" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error details: {ex.Message}");
                Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Update game setting
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> UpdateGameSetting([FromBody] Dictionary<string, object> request)
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                var userName = User.FindFirst("name")?.Value ?? "Admin";

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { error = "Token missing user ID" });
                }

                // Helper function
                T GetValue<T>(string key, T defaultValue = default(T))
                {
                    try
                    {
                        if (!request.ContainsKey(key) || request[key] == null)
                            return defaultValue;

                        var value = request[key];

                        if (value is JsonElement jsonElement)
                        {
                            if (typeof(T) == typeof(string))
                                return (T)(object)(jsonElement.ValueKind == JsonValueKind.String ? jsonElement.GetString() : jsonElement.ToString());
                            if (typeof(T) == typeof(int) || typeof(T) == typeof(int?))
                                return (T)(object)jsonElement.GetInt32();
                            if (typeof(T) == typeof(decimal) || typeof(T) == typeof(decimal?))
                                return (T)(object)jsonElement.GetDecimal();
                        }

                        if (typeof(T) == typeof(string))
                            return (T)(object)value.ToString();
                        if (typeof(T) == typeof(int) || typeof(T) == typeof(int?))
                            return (T)(object)Convert.ToInt32(value);
                        if (typeof(T) == typeof(decimal) || typeof(T) == typeof(decimal?))
                            return (T)(object)Convert.ToDecimal(value);

                        return defaultValue;
                    }
                    catch
                    {
                        return defaultValue;
                    }
                }

                var id = GetValue<int>("Id", 0);
                if (id == 0)
                {
                    return BadRequest(new { error = "Game setting ID is required" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string query = @"
                    UPDATE GameSettings SET
                        Description = @Description,
                        MacId = @MacId,
                        Category = @Category,
                        SubCategory = @SubCategory,
                        CashPlayPrice = @CashPlayPrice,
                        VipDiscountPrice = @VipDiscountPrice,
                        CoinPlayPrice = @CoinPlayPrice,
                        GameInterface = @GameInterface,
                        CurrencyDecimalPlace = @CurrencyDecimalPlace,
                        DebitOrder = @DebitOrder,
                        PulseWidth = @PulseWidth,
                        PulsePauseWidth = @PulsePauseWidth,
                        PulseToActuate = @PulseToActuate,
                        RfidTapDelay = @RfidTapDelay,
                        DisplayOrientation = @DisplayOrientation,
                        LedPattern = @LedPattern,
                        LastUpdatedDate = @LastUpdatedDate,
                        LastUpdatedUser = @LastUpdatedUser
                    WHERE Id = @Id";

                using var cmd = new MySqlCommand(query, connection);

                cmd.Parameters.AddWithValue("@Description", GetValue<string>("Description", ""));
                cmd.Parameters.AddWithValue("@MacId", GetValue<string>("MacId", ""));
                cmd.Parameters.AddWithValue("@Category", GetValue<string>("Category", ""));
                cmd.Parameters.AddWithValue("@SubCategory", GetValue<string>("SubCategory", ""));
                cmd.Parameters.AddWithValue("@CashPlayPrice", GetValue<decimal>("CashPlayPrice", 0));
                cmd.Parameters.AddWithValue("@VipDiscountPrice", GetValue<decimal>("VipDiscountPrice", 0));
                cmd.Parameters.AddWithValue("@CoinPlayPrice", GetValue<decimal>("CoinPlayPrice", 0));
                cmd.Parameters.AddWithValue("@GameInterface", GetValue<string>("GameInterface", ""));
                cmd.Parameters.AddWithValue("@CurrencyDecimalPlace", GetValue<string>("CurrencyDecimalPlace", ""));
                cmd.Parameters.AddWithValue("@DebitOrder", GetValue<string>("DebitOrder", ""));
                cmd.Parameters.AddWithValue("@PulseWidth", GetValue<string>("PulseWidth", ""));
                cmd.Parameters.AddWithValue("@PulsePauseWidth", GetValue<string>("PulsePauseWidth", ""));
                cmd.Parameters.AddWithValue("@PulseToActuate", GetValue<string>("PulseToActuate", ""));
                cmd.Parameters.AddWithValue("@RfidTapDelay", GetValue<string>("RfidTapDelay", ""));
                cmd.Parameters.AddWithValue("@DisplayOrientation", GetValue<string>("DisplayOrientation", ""));
                cmd.Parameters.AddWithValue("@LedPattern", GetValue<string>("LedPattern", ""));
                cmd.Parameters.AddWithValue("@LastUpdatedDate", DateTime.Now);
                cmd.Parameters.AddWithValue("@LastUpdatedUser", userName);
                cmd.Parameters.AddWithValue("@Id", id);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    Console.WriteLine("✅ Game setting updated successfully");
                    return Ok(new { message = "Game setting updated successfully" });
                }
                else
                {
                    return NotFound(new { error = "Game setting not found" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error details: {ex.Message}");
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // Delete game setting
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> DeleteGameSetting([FromBody] JsonElement request)
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
                    return BadRequest(new { error = "Game setting ID is required" });
                }

                var id = idElement.GetInt32();
                if (id == 0)
                {
                    return BadRequest(new { error = "Game setting ID is required" });
                }

                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                string query = @"DELETE FROM GameSettings WHERE Id = @id";

                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", id);

                var rowsAffected = await cmd.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    return Ok(new { message = "Game setting deleted successfully" });
                }
                else
                {
                    return NotFound(new { error = "Game setting not found" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // TCP Command Helper
        private void SendTcpCommand(string ipAddress, int port, string command)
        {
            using (TcpClient client = new TcpClient())
            {
                client.Connect(ipAddress, port);
                using (NetworkStream stream = client.GetStream())
                {
                    byte[] data = Encoding.ASCII.GetBytes(command);
                    stream.Write(data, 0, data.Length);
                }
            }
        }
    }
}