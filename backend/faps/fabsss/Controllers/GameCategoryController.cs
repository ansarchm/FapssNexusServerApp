using fabsss.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace fabsss.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")] // ✅ prevents Swagger conflicts
    public class GameCategoryController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public GameCategoryController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // ✅ Get all categories
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = new List<GameCategoryModel>();
            var connectionString = _configuration.GetConnectionString("Default");

            using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            string query = "SELECT * FROM tbl_GameCategory ORDER BY Id ASC";
            using var cmd = new MySqlCommand(query, connection);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                categories.Add(new GameCategoryModel
                {
                    Id = reader.GetInt32("Id"),
                    Description = reader.GetString("Description"),
                    CreatedDate = reader.GetDateTime("CreatedDate"),
                    LastUsedDate = reader.GetDateTime("LastUsedDate")
                });
            }

            return Ok(categories);
        }

        // ✅ Add new category
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] GameCategoryModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Description))
                return BadRequest(new { error = "Description is required" });

            var connectionString = _configuration.GetConnectionString("Default");

            using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            string query = @"INSERT INTO tbl_GameCategory (Description, CreatedDate, LastUsedDate)
                             VALUES (@desc, @created, @lastUsed)";

            using var cmd = new MySqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@desc", model.Description);
            cmd.Parameters.AddWithValue("@created", DateTime.Now);
            cmd.Parameters.AddWithValue("@lastUsed", DateTime.Now);

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Category added successfully" });
        }

        // ✅ Delete category
        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var connectionString = _configuration.GetConnectionString("Default");
            using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            string query = "DELETE FROM tbl_GameCategory WHERE Id = @id";
            using var cmd = new MySqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@id", id);

            int rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
                return NotFound(new { error = "Category not found" });

            return Ok(new { message = "Category deleted successfully" });
        }

        // ✅ Get all subcategories
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllSubCategories()
        {
            var subCategories = new List<GameSubCategoryModel>();
            var connectionString = _configuration.GetConnectionString("Default");

            using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            string query = "SELECT * FROM tbl_GameSubCategory ORDER BY Id ASC";
            using var cmd = new MySqlCommand(query, connection);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                subCategories.Add(new GameSubCategoryModel
                {
                    Id = reader.GetInt32("Id"),
                    Description = reader.GetString("Description"),
                    CreatedDate = reader.GetDateTime("CreatedDate"),
                    LastUsedDate = reader.GetDateTime("LastUsedDate")
                });
            }

            return Ok(subCategories);
        }

        // ✅ Add new subcategory
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddSubCategory([FromBody] GameSubCategoryModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Description))
                return BadRequest(new { error = "Description is required" });

            var connectionString = _configuration.GetConnectionString("Default");
            using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            string query = @"INSERT INTO tbl_GameSubCategory (Description, CreatedDate, LastUsedDate)
                             VALUES (@desc, @created, @lastUsed)";
            using var cmd = new MySqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@desc", model.Description);
            cmd.Parameters.AddWithValue("@created", DateTime.Now);
            cmd.Parameters.AddWithValue("@lastUsed", DateTime.Now);

            await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Sub-category added successfully" });
        }

        // ✅ Delete subcategory
        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteSubCategory(int id)
        {
            var connectionString = _configuration.GetConnectionString("Default");
            using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            string query = "DELETE FROM tbl_GameSubCategory WHERE Id = @id";
            using var cmd = new MySqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@id", id);

            int rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
                return NotFound(new { error = "Sub-category not found" });

            return Ok(new { message = "Sub-category deleted successfully" });
        }
    }
}
