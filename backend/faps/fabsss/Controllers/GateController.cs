using fabsss.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Security.Claims;
using System.Threading.Tasks;

namespace fabsss.Controllers
{
    [ApiController]
    [Route("api/[action]")]
    public class GateController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public GateController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private string GetUserDatabaseConnection(string userId)
        {
            var defaultConn = _configuration.GetConnectionString("Default");
            var connFront = _configuration.GetConnectionString("UserConnectionfront");
            var connLast = _configuration.GetConnectionString("UserConnectionlast");

            using var connection = new MySqlConnection(defaultConn);
            connection.Open();

            string dbname = null;
            string query = "SELECT dbname FROM tbl_location WHERE id = @id";

            using var cmd = new MySqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@id", userId);
            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                dbname = reader["dbname"].ToString();
            }

            if (string.IsNullOrEmpty(dbname))
            {
                throw new Exception("No database found for this user.");
            }

            return connFront + dbname + connLast;
        }

        // 1. GetGateByLocation
        [HttpGet]
        public IActionResult GetGateByLocation(int locationId)
        {
            var gates = new List<Dictionary<string, object>>();

            try
            {
                var connectionString = _configuration.GetConnectionString("Default");
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
                        gate[reader.GetName(i)] = reader.GetValue(i);

                    gates.Add(gate);
                }

                return Ok(gates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // 2. GetGateById
        [Authorize]
        [HttpPost]
        public IActionResult GetGateById(int id)
        {
            var gate = new Dictionary<string, object>();

            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string query = "SELECT * FROM tbl_gate WHERE id = @id";
                using var cmd = new MySqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id", id);

                using var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    for (int i = 0; i < reader.FieldCount; i++)
                        gate[reader.GetName(i)] = reader.GetValue(i);

                    return Ok(gate);
                }

                return NotFound(new { error = "Gate not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // 3. AddGate
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

        // 4. UpdateGateById
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

        // 5. GetGateGroupByLocation
        [HttpGet]
        public IActionResult GetGateGroupByLocation(int locationId)
        {
            var gateGroups = new List<Dictionary<string, object>>();

            try
            {
                var connectionString = _configuration.GetConnectionString("Default");
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
                        group[reader.GetName(i)] = reader.GetValue(i);

                    gateGroups.Add(group);
                }

                return Ok(gateGroups);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database error", detail = ex.Message });
            }
        }

        // 6. GetGateGroupById
        [HttpPost("getGateGroupById")]
        public IActionResult GetGateGroupById([FromBody] GateGroupRequest request)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("Default");

                using var connection = new MySqlConnection(connectionString);
                connection.Open();

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

        // 7. AddGateGroup
        [HttpPost("addGateGroup")]
        public IActionResult AddGateGroup([FromBody] GateGroupRequest request)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("Default");
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

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
                    cmd.Parameters.AddWithValue("@locationid", request.locationid);
                    groupId = Convert.ToInt64(cmd.ExecuteScalar());
                }

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

                return Ok(new { message = "GateGroup added successfully", groupId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // 8. UpdateGateGroupById
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

                var deleteQuery = "DELETE FROM `tbl_gategroupmap` WHERE `groupid` = @groupId";
                using (var deleteCmd = new MySqlCommand(deleteQuery, connection))
                {
                    deleteCmd.Parameters.AddWithValue("@groupId", request.GroupId);
                    await deleteCmd.ExecuteNonQueryAsync();
                }

                foreach (var gateId in request.Gates)
                {
                    var insertQuery = @"INSERT INTO `tbl_gategroupmap` 
                                (`gateid`, `groupid`, `mnts`, `locationid`) 
                                VALUES (@gateid, @groupid, @mnts, @locationid)";
                    using (var insertCmd = new MySqlCommand(insertQuery, connection))
                    {
                        insertCmd.Parameters.AddWithValue("@gateid", gateId);
                        insertCmd.Parameters.AddWithValue("@groupid", request.GroupId);
                        insertCmd.Parameters.AddWithValue("@mnts", 0);
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

        // 9. UpdateGateGroupDetails
        [HttpPost]
        public async Task<IActionResult> UpdateGateGroupDetails([FromBody] GateGroupUpdateRequest request)
        {
            var connectionString = _configuration.GetConnectionString("Default");

            await using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();
            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
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

                var deleteCommand = new MySqlCommand("DELETE FROM tbl_gategroupmap WHERE groupid = @groupId", connection, (MySqlTransaction)transaction);
                deleteCommand.Parameters.AddWithValue("@groupId", request.GroupId);
                await deleteCommand.ExecuteNonQueryAsync();

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
    }
}
