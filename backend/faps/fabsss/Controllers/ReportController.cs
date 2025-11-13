using fabsss.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Globalization;

namespace fabsss.Controllers
{
    [ApiController]
    [Route("api/[Action]")]
    public class ReportController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ReportController(IConfiguration configuration)
        {
            _configuration = configuration;
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

            var duration = request.Duration?.Trim().ToLowerInvariant();

            if (!new[] { "day", "week", "month" }.Contains(duration))
                return BadRequest(new { message = "Invalid duration. Must be Day, Week, or Month." });

            if (!DateTime.TryParseExact(request.FromDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out var frmDt))
                return BadRequest(new { message = "Invalid FromDate format. Expected format: yyyy-MM-dd HH:mm:ss" });

            if (!DateTime.TryParseExact(request.ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out var toDt))
                return BadRequest(new { message = "Invalid ToDate format. Expected format: yyyy-MM-dd HH:mm:ss" });

            if (duration == "month")
            {
                if (frmDt.Day != 1)
                    frmDt = new DateTime(frmDt.Year, frmDt.Month, 1).AddMonths(1);

                if (toDt.Day != DateTime.DaysInMonth(toDt.Year, toDt.Month))
                    toDt = new DateTime(toDt.Year, toDt.Month, 1).AddMonths(1).AddDays(-1);
            }
            else if (duration == "week")
            {
                frmDt = frmDt.AddDays(-(int)frmDt.DayOfWeek);
                toDt = toDt.AddDays(6 - (int)toDt.DayOfWeek);
            }

            if (toDt < frmDt)
                return NotFound(new { message = "No Reports" });

            var connectionString = _configuration.GetConnectionString("Default");

            using var conn = new MySqlConnection(connectionString);
            await conn.OpenAsync();

            try
            {
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
                var discount = discountResult == DBNull.Value ? 0 : Convert.ToDecimal(discountResult);

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
           IFNULL(ROUND(SUM(total) - SUM(taxtotal), 2), 0) AS Revenue,
           IFNULL(SUM(taxtotal), 0) AS Tax,
           IFNULL(SUM(tdiscount), 0) AS Discount,
           IFNULL(SUM(total), 0) AS Total
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
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        var value = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        row[reader.GetName(i)] = value;
                    }
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
                GROUP BY b.uuid, b.cashname, b.billno, b.maintotal 
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
        b.cashname AS 'Username',  
        b.billno AS 'BillNo', 
        b.createddate AS 'CreatedOn', 
        b.maintotal AS 'Total', 
        b.tdiscount AS 'Discount', 
        b.afterdiscount AS 'Bill Amount' 
    FROM tbl_bill b 
    WHERE b.tdiscount > 0 
      AND b.createddate BETWEEN @startDate AND @endDate  
    GROUP BY b.billno, b.uuid, b.cashname, b.createddate, b.maintotal, b.tdiscount, b.afterdiscount
    ORDER BY b.createddate DESC;";

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


        [HttpPost("RevenueReport2")]
        public async Task<IActionResult> GetRevenueReport([FromBody] RevenueReportRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.StartDate) || string.IsNullOrEmpty(request.EndDate))
                return BadRequest(new { error = "StartDate and EndDate are required." });

            try
            {
                DateTime startDate = DateTime.ParseExact(request.StartDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime endDate = DateTime.ParseExact(request.EndDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
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
                    cmd.Parameters.AddWithValue("@userid", request.UserId);
                    cmd.Parameters.AddWithValue("@startDate", startDate.ToString("yyyy-MM-dd"));
                    cmd.Parameters.AddWithValue("@startTime", "00:00:00");
                    cmd.Parameters.AddWithValue("@endTime", "23:59:59");
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

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ReportRequest request)
        {
            if (string.IsNullOrEmpty(request.Duration))
                return BadRequest(new { message = "Duration is required" });

            if (string.IsNullOrEmpty(request.FromDate))
                return BadRequest(new { message = "From date is required" });

            if (string.IsNullOrEmpty(request.ToDate))
                return BadRequest(new { message = "To date is required" });

            string[] formats = { "yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss" };

            DateTime frmDt = DateTime.ParseExact(request.FromDate, formats, CultureInfo.InvariantCulture, DateTimeStyles.None);
            DateTime toDt = DateTime.ParseExact(request.ToDate, formats, CultureInfo.InvariantCulture, DateTimeStyles.None);


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
                var discount = discountResult == DBNull.Value ? 0 : Convert.ToDecimal(discountResult);


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
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        var value = await reader.IsDBNullAsync(i) ? null : reader.GetValue(i);
                        row[reader.GetName(i)] = value;
                    }
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

                var discount = 0m;
                object discountObj = discountCommand.ExecuteScalar();
                if (discountObj != null && discountObj != DBNull.Value)
                {
                    discount = Convert.ToDecimal(discountObj);
                }

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

                const string V = @"
                SELECT g.type AS category, g.gatename, COUNT(*) AS `Play Count`
                FROM tbl_gate g
                JOIN tbl_transaction t ON t.ipaddress = g.gateip
                WHERE g.mode = 'Entry'
                AND t.createdon BETWEEN CONCAT(@startDate, ' ', @startTime)
                                  AND CONCAT(@nextDay, ' ', @endTime)
                AND g.locationid = @locationId
                GROUP BY g.type, g.gatename
                ORDER BY g.type, COUNT(*) DESC";
                string query = V;

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
                var nextDay = DateTime.ParseExact(
                    request.EndDate,
                    "yyyy-MM-dd",
                    CultureInfo.InvariantCulture
                ).AddDays(1).ToString("yyyy-MM-dd");


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


    }
}
