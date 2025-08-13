using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace fabsss.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public int LocationId { get; set; }
    }
    //public class DashboardRequest
    //{
    //    public string Date { get; set; }
    //    public string UserId { get; set; }
    //}
    public class ProductCategory
    {
       
        public int Id { get; set; }

       
        public string CategoryName { get; set; }

        public int LocationId { get; set; }

    
    }
    [Table("tbl_gate")]
    public class Gate
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string GateName { get; set; }

        public int LocationId { get; set; }

        // Add other properties corresponding to the columns in tbl_gate
    }
    public class UserRequest
    {
        public int Id { get; set; }
        public int LocationId { get; set; }
    }
    public class GameItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
    }
    public class DiscountRequest
    {
        public string StartDate { get; set; } // Format: yyyy-MM-dd
        public string EndDate { get; set; }   // Format: yyyy-MM-dd
    }

    public class DiscountReportResult
    {
        public string Username { get; set; }
        public string BillNo { get; set; }
        public DateTime CreatedOn { get; set; }
        public decimal Total { get; set; }
        public decimal Discount { get; set; }
        public decimal BillAmount { get; set; }
    }
    public class VoidSalesRequest
    {
        public string StartDate { get; set; }  // Format: yyyy-MM-dd
        public string EndDate { get; set; }    // Format: yyyy-MM-dd
        public int UserId { get; set; }        // This should come from your token decoder logic
    }
    public class GateGroupUpdateRequest
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public int Status { get; set; }
        public int CategoryFlag { get; set; }
        public List<int> Gates { get; set; }
        public int UserId { get; set; } // Passed from client now
        public object LocationId { get; set; }
    }
    public class AddCategoryRequest
    {
        public string CategoryName { get; set; }
        public int Status { get; set; }
        public int LocationId { get; set; }
    }

    public class GetCategoryByIdRequest
    {
        public int Id { get; set; }
        public int LocationId { get; set; } // You’ll need to pass LocationId from the token
    }
    public class Category
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string Status { get; set; }
        public int LocationId { get; set; }
    }
    public class CategoryRequest
    {
        public int Id { get; set; }
        public int LocationId { get; set; } // replaces `decoded.id`
    }
    public class UpdateCategoryRequest
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string Status { get; set; }
        public int LocationId { get; set; } // Replaces userid from token
    }
    public class AddGateRequest
    {
        public string GateIp { get; set; }
        public string GateName { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; }
        public string Parent { get; set; }
        public int Duration { get; set; }
        public string Mode { get; set; }
        public string Relay { get; set; }
        public string Msg { get; set; }
        public string Status { get; set; }
        public string Denied { get; set; }
        public int LocationId { get; set; }
    }
    public class AddRefundReasonRequest
    {
        public string Reason { get; set; }
        public string Status { get; set; }
        public int LocationId { get; set; }
    }
    public class UpdateGateRequest
    {
        public string GateIp { get; set; }
        public string GateName { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; }
        public string Parent { get; set; }
        public int Duration { get; set; }
        public string Mode { get; set; }
        public string Relay { get; set; }
        public string Msg { get; set; }
        public string Status { get; set; }
        public string Denied { get; set; }
        public int Id { get; set; }
        public int LocationId { get; set; } // formerly `userid` from token
    }
    public class UpdateRefundReasonRequest
    {
        public int Id { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; }
        public int LocationId { get; set; }
    }
    public class AddUserRequest
    {
        public string Name { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string ComputerName { get; set; }
        public string Status { get; set; }
        public string UserRole { get; set; }
        public string CourtesyCard { get; set; }
        public string CourtesyType { get; set; }
        public int CourtesyCount { get; set; }
        public int LocationId { get; set; }
    }
    public class UpdateUserRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string ComputerName { get; set; }
        public string Status { get; set; }
        public string UserRole { get; set; }
        public string CourtesyCard { get; set; }
        public string CourtesyType { get; set; }
        public int CourtesyCount { get; set; }
        public int LocationId { get; set; }
    }
    public class AddUserRoleRequest
    {
        public string UserRole { get; set; }
        public string Status { get; set; }
        public int LocationId { get; set; }
    }

    public class UpdateUserRoleRequest
    {
        public List<UserRoleUpdateItem> Product { get; set; }
        public int LocationId { get; set; }
    }

    public class UserRoleUpdateItem
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public bool AdminPanel { get; set; }
        public bool CashierPanel { get; set; }
        public bool Release { get; set; }
        public bool ProfileEdit { get; set; }
        public bool CardValidation { get; set; }
        public bool VoidSale { get; set; }
        public bool Inventory { get; set; }
        public bool SalesEnable { get; set; }
        public bool ZOutAccess { get; set; }
        public bool DiscountAccess { get; set; }
        public bool FullTransactionAccess { get; set; }
        public bool RefundAccess { get; set; }
    }
    //public class ProductRequest
    //{
    //    public int Id { get; set; }
    //    public int LocationId { get; set; }  // this replaces `userid`
    //}

    public class ProductRequest
    {
        public int Id { get; set; }
        public int LocationId { get; set; }  // this replaces `userid`
        public string ProductName { get; set; }
        public string Category { get; set; }
        public string PType { get; set; }
        public decimal Rate { get; set; }
        public decimal Tax { get; set; }
        public int Status { get; set; }
        public int Sequence { get; set; }
        public int Bonus { get; set; }
        public int Duration { get; set; }
        public decimal CashBalance { get; set; }
        public string TimebandType { get; set; }
        public string TaxType { get; set; }
        public string GateIp { get; set; }
        public decimal DepositAmount { get; set; }
        public bool Kot { get; set; }
        public bool FavoriteFlag { get; set; }
        public bool CustomerCard { get; set; }
        public bool Kiosk { get; set; }
        public bool RegMan { get; set; }
        public string TypeGate { get; set; }
        public int GateValue { get; set; }
        public bool CommonFlag { get; set; }
        public string Expiry { get; set; }
        public bool EnableLed { get; set; }
        public int Green { get; set; }
        public int Blue { get; set; }
        public int Red { get; set; }
       
    }
    public class UpdateRefundReasonRequests
    {
        public int Id { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; }
        public int LocationId { get; set; }
    }
    public class ProductModel
    {
        public string productname { get; set; }
        public string category { get; set; }
        public string ptype { get; set; }
        public decimal rate { get; set; }
        public decimal tax { get; set; }
        public int status { get; set; }
        public int sequence { get; set; }
        public int bonus { get; set; }
        public int duration { get; set; }
        public decimal cashbalance { get; set; }
        public string timebandtype { get; set; }
        public string taxtype { get; set; }
        public string gateip { get; set; }
        public decimal? depositamount { get; set; }
        public int? kot { get; set; }
        public int? favoriteflag { get; set; }
        public int? customercard { get; set; }
        public string kiosk { get; set; }
        public string regman { get; set; }
        public string typegate { get; set; }
        public string gatevalue { get; set; }
        public int? commonflag { get; set; }
        public int? expiry { get; set; }
        public int? enableled { get; set; }
        public string green { get; set; }
        public string blue { get; set; }
        public string red { get; set; }
        public int id { get; set; }
        public int locationid { get; set; }
    }


    public class GateGroupRequest
    {
        public int id { get; set; }
        public int locationid { get; set; } // passed from frontend (instead of token)
        public string groupname { get; set; }
        public int status { get; set; }
        public int categoryflag { get; set; }
        public List<int> gates { get; set; }
    }
    public class UserRoleRequest
    {
        public int id { get; set; }
        public int locationid { get; set; } // comes from frontend
    }
    public class UserRoleUpdateRequest
    {
        public int Id { get; set; }
        public string UserRole { get; set; }
        public int Status { get; set; }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public long lastActivity { get; set; }
        public string locationmapid { get; set; }
    }

    public class UpdateUserRoleRequest1
    {
        public int Id { get; set; }
        public string UserRole { get; set; }
        public string Status { get; set; }
        public int LocationId { get; set; } // Only one declaration
    }
    public class UpdateLocationRequest
    {
        public int Id { get; set; } // Location ID
        public string Name { get; set; }
        public string Address { get; set; }
        public string PhoneNo { get; set; }
        public string TaxId { get; set; }
        public string DecimalPt { get; set; }
        public string CashSymbol { get; set; }
        public string AddressT { get; set; }
        public string TrFromTime { get; set; }
        public string TrToTime { get; set; }
        public string LocationFooter { get; set; }
    }
    public class ReportRequest
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int LocationId { get; set; }
        public string SelectedOption { get; set; }
        public string UserId { get;  set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Duration { get; set; }
    }
    public class PaymentSummary
    {
        public string DeviceName { get; set; }
        public decimal Cash { get; set; }
        public decimal CreditCard { get; set; }
        public decimal CustomerCard { get; set; }
    }
    public class ThirdReportResult
    {
        public string Category { get; set; }
        public string GateName { get; set; }
        public int PlayCount { get; set; }
    }
    public class GameRevenueReport
    {
        public string Category { get; set; }
        public string GateName { get; set; }
        public int PlayCount { get; set; }
        public decimal TotalAmount { get; set; }
    }
    public class RevenueReportRequest
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int UserId { get; set; }
        public int SelectedOption { get;set; }
    }

    // Result Model for the query
    public class RevenueReportResult
    {
        public string Mode { get; set; }
        public decimal Amount { get; set; }
        public string Username { get;  set; }
    }
    public class ProductData
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
    }
    public class PaymentUpdateModel
    {
        public string Mode { get; set; }
        public int? Status { get; set; }
        public int Id { get; set; }
    }
    public class PaymentAddModel
    {
        public string Mode { get; set; }
        public int Status { get; set; }
    }
    public class RefundReasonRequest
    {
        public int Id { get; set; }
    }
    public class UpdateReasonRequest
    {
        public int Id { get; set; }
        public string Reason { get; set; }
        public int Status { get; set; }
    }
    public class GetCashModeRequest
    {
        public int Id { get; set; }
        public int LocationId { get; set; }
    }
}
