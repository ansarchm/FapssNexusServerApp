import React from "react";
import "./Gamereports.css";
import logo from '../assets/logo.png';
import vectorIcon from "../assets/Vector_1.png";
import vector1Icon from "../assets/Vector_2.png";
import vector2Icon from "../assets/Vector_3.png";
import vector3Icon from "../assets/Vector_4.png";
import vector4Icon from "../assets/left-arrow.png";
import refresh from "../assets/refresh.png";
import print from "../assets/print.png";
import pdf from "../assets/down-arrow.png";
import email from "../assets/email.png";
import close1 from "../assets/close1.png";
import exports from "../assets/export.png";
import date from "../assets/Date.png";
import date1  from "../assets/Date1.png";
import date2  from "../assets/Date2.png";
const filtered = [
  {
    product: "Revalue",
    quantity: 1,
    revenue: "JOD20.00",
    averageCost: "JOD5.00",
    tax: "JOD0.00",
    percentRevenue: 5.67,
    percentQuantity: 5.67,
  },
  {
    product: "New Card",
    quantity: 13,
    revenue: "JOD30.00",
    averageCost: "JOD10.00",
    tax: "JOD0.00",
    percentRevenue: 9.67,
    percentQuantity: 9.67,
  },
   { product: "20 JD", quantity: 26, revenue: "JOD40.00", averageCost: "JOD15.00", tax: "JOD0.00", percentRevenue: 35.67, percentQuantity: 35.67 },
      { product: "Mubin 234", quantity: 34, revenue: "JOD50.00", averageCost: "JOD20.00", tax: "JOD0.00", percentRevenue: 2.67, percentQuantity: 2.67 },
      { product: "New 345", quantity: 45, revenue: "JOD60.00", averageCost: "JOD20.00", tax: "JOD0.00", percentRevenue: 1.67, percentQuantity: 1.67 },

];




const GameReportPage = () => {
  return (
    <div className="gamereport-page">

      {/* Header */}
      <div className="gamereport-header">
        {/* Top row with logo + filters */}
        <div className="header-top-row">
          <div className="header-left">
            <img src={logo} alt="FAPSS Logo" className="logo" />
          </div>
        <div className="header-filters">
          
  {/* Left Icon */}
  <img src={date} alt="date" className="date-icon-main" />

  {/* Date From */}
  <div className="date-box">
    <span className="label">Date From</span>
    <div className="date-display">
      <span>12-Aug-2025 6:00 AM</span>
      <img src={date1} alt="date1" className="date-icon" />
      <img src={date2} alt="date2" className="date-icon" />
    </div>
  </div>

  {/* Date To */}
  <div className="date-box">
  <span className="label">Date To</span>
  <div className="date-display">
    <span>14-Aug-2025 6:00 AM</span>
    <div className="icon-wrapper">
      <img src={date1} alt="calendar" className="date-icon" />
    </div>
    <div className="icon-wrapper">
      <img src={date2} alt="clock" className="date-icon" />
    </div>
  </div>
</div>

</div>


        </div>
        <hr className="header-divider" />
        {/* Navigation row with arrows */}
        <div className="header2">
      <div className="header-container">
<div className="header-navigation">
  <img src={vector4Icon} alt="Vector4" className="vector4-icon" />
 <img src={vectorIcon} alt="Vector" className="vector-icon" />
 <img src={vector3Icon} alt="Vector3" className="vector3-icon" />
<img src={vector1Icon} alt="Vector1" className="vector1-icon" />
<img src={vector2Icon} alt="Vector2" className="vector2-icon" />

</div>


        {/* Action buttons in correct order & colors */}
        <div className="header-actions">
          <button className="btn refresh"><img src={refresh} alt="refresh" className="refresh-icon" /> Refresh</button>
          <button className="btn print"><img src={print} alt="print" className="print" /> Print</button>
          <button className="btn pdf">PDF<img src={pdf} alt="pdf" className="pdf" /> </button>
          <button className="btn export"><img src={exports} alt="export" className="export" /> Export</button>
          <button className="btn email"><img src={email} alt="email" className="email" /> Email Report</button>
          <button className="btn close"><img src={close1} alt="close1" className="close1" /> Close</button>
        </div>
      </div>
      </div>
</div>
      {/* White card container */}
      <div className="container-body-card">
  <h2 className="container-title">Game Reports</h2>

  {/* Period Row */}
  
  <div className="report-period">
    Period (Sunday, June 1, 2025 to Wednesday, August 13, 2025)
  </div>

  {/* Meta Row */}
  <div className="report-meta">
    <span><strong>Location :</strong> Al Baron Rides</span>
    <span><strong>Department :</strong> Card Sales</span>
  </div>
{/* Headers */}
<div className="separated-table-header">
  <div className="separated-header-cell header-product">
    Product
  </div>
  <div className="separated-header-cell header-quantity">
    Quantity
  </div>
  <div className="separated-header-cell header-revenue">
    Revenue
  </div>
  <div className="separated-header-cell header-averagecost">
    Average Cost
  </div>
  <div className="separated-header-cell header-tax">
    Tax
  </div>
  <div className="separated-header-cell header-percent-revenue">
    Percent of Total Revenue
  </div>
  <div className="separated-header-cell header-percent-quantity">
    Percent of Total Quantity
  </div>
</div>

{/* Table data */}
<div className="scrollbar">
{/* Table data with scrollbar */}

  <div className="separated-table-content">
    {filtered.map((row, index) => (
      <div
        key={index}
        className={`separated-table-row ${index % 2 === 1 ? "separated-row-yellow" : ""}`}
      >
        <div className="separated-cell data-product">{row.product}</div>
        <div className="separated-cell data-quantity">{row.quantity}</div>
        <div className="separated-cell data-revenue">{row.revenue}</div>
        <div className="separated-cell data-averagecost">{row.averageCost}</div>
        <div className="separated-cell data-tax">{row.tax}</div>
        <div className="separated-cell data-percent-revenue">{row.percentRevenue}%</div>
        <div className="separated-cell data-percent-quantity">{row.percentQuantity}%</div>
      </div>
    ))}
    
  {/* Department Total Row */}
<div className="department-total">
  <span className="bold-text">Department Total: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 119</span>
   
  <span>JOD200</span>
  <span>JOD70</span>
  <span>JOD0</span>
</div>

{/* Department Name Row */}
<div className="department-name">
  <span className="bold-text">Department:</span> Rides
</div>
  </div>
<div className="separated-table-header">
  <div className="separated-header-cell header-product">
    Product
  </div>
  <div className="separated-header-cell header-quantity">
    Quantity
  </div>
  <div className="separated-header-cell header-revenue">
    Revenue
  </div>
  <div className="separated-header-cell header-averagecost">
    Average Cost
  </div>
  <div className="separated-header-cell header-tax">
    Tax
  </div>
  <div className="separated-header-cell header-percent-revenue">
    Percent of Total Revenue
  </div>
  <div className="separated-header-cell header-percent-quantity">
    Percent of Total Quantity
  </div>
</div>

<div className="separated-table-content">
  {filtered.map((row, index) => (
    <div key={index} className={`separated-table-row ${index % 2 === 1 ? "separated-row-yellow" : ""}`}>
      <div className="separated-cell data-product">{row.product}</div>
      <div className="separated-cell data-quantity">{row.quantity}</div>
      <div className="separated-cell data-revenue">{row.revenue}</div>
      <div className="separated-cell data-averagecost">{row.averageCost}</div>
      <div className="separated-cell data-tax">{row.tax}</div>
      <div className="separated-cell data-percent-revenue">{row.percentRevenue}%</div>
      <div className="separated-cell data-percent-quantity">{row.percentQuantity}%</div>
    </div>
  ))}
</div>
</div>
</div>
          
    
    
    </div>
  );
};

export default GameReportPage;
