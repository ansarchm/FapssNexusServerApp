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

namespace fabsss.Controllers
{
    [Route("api/[action]")]
    [ApiController]
    public class GateController : ControllerBase
    {

        private readonly IConfiguration _configuration;

        public GateController(IConfiguration configuration)
        {
            _configuration = configuration;
        }




    }
}
