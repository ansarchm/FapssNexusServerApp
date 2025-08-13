import React, { useState } from "react";
import "./cardproduct.css";
import cardIcon from "../components/assets/card-icon.png"; // adjust path if needed
import searchIcon from "../components/assets/magnifying-glass 1.png"; // adjust path if needed


const data = Array.from({ length: 12 }, () => ({
  productId: 34569,
  productName: "New Card $100",
  active: true,
  category: "Card Product",
  displayGroup: "New Card",
  displayOrder: 34,
  displayInPOS: true,
  faceValue: "$90.00",
  sellingPrice: "$100.00",
  cashBalance: "$100.00",
  bonusBalance: "$20.00",
  cardQuantity: 9,
  accessProfile: "attraction: content",
  membership: "Happy monday",
  cardValidity: 360,
  cardExpiry: "2025-04-23",
  vipCard: false,
  posCounter: "Pos 1, Pos 2",
  taxCategory: "TAX001",
  taxPercent: "10%",
  priceNoTax: "90.00",
  favourite: true,
  kiosk: true,
  kot: true,
  customerCard: false,
  lastUpdatedDate: "2024-12-09 12:11",
  lastUpdatedUser: "Ahmed bin jaseel"
}));

const HeaderCell = ({ label }) => (
  <div className="header-container">
    <span className="header-text">{label}</span>
    <span className="sort-icons">
      <span className="arrow up"></span>
      <span className="arrow down"></span>
    </span>
  </div>
);

const CustomTable = () => {
  const [activeProductsOnly, setActiveProductsOnly] = useState(false);
  const [productFilter, setProductFilter] = useState("");
  const [displayGroupFilter, setDisplayGroupFilter] = useState("");
  const [posCounterFilter, setPosCounterFilter] = useState("");

  return (
    <div className="table-wrapper">

  {/* Header + Filters in one block */}
  <div className="section-container">
    {/* Section Header */}
    <div className="section-header">
  <div className="section-title-container">
    <img src={cardIcon} alt="Card Icon" className="section-icon" />
    <h2 className="section-title">Card Product</h2>

    <div className="checkbox-container">
      <input
        type="checkbox"
        id="activeOnly"
        checked={activeProductsOnly}
        onChange={(e) => setActiveProductsOnly(e.target.checked)}
      />
      <label htmlFor="activeOnly" className="checkbox-label">
        Active Products Only
      </label>
    </div>
  </div>
</div>


    {/* Filters Section */}
    <div className="filters-row">
      <div className="filter-pair">
        <label className="filter-label">Product</label>
        <input
          type="text"
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-pair">
        <label className="filter-label">Display Group</label>
        <select
          value={displayGroupFilter}
          onChange={(e) => setDisplayGroupFilter(e.target.value)}
          className="filter-select"
        >
          <option value=""></option>
          <option value="New Card">New Card</option>
          <option value="Premium Card">Premium Card</option>
        </select>
      </div>

      <div className="filter-pair">
        <label className="filter-label">POS Counter</label>
        <select
          value={posCounterFilter}
          onChange={(e) => setPosCounterFilter(e.target.value)}
          className="filter-select"
        >
          <option value=""></option>
          <option value="Pos 1">Pos 1</option>
          <option value="Pos 2">Pos 2</option>
        </select>
      </div>

<button className="search-button">
  <img src={searchIcon} alt="Search" className="search-icon" />
  Search
</button>
    </div>
  </div>


      {/* Table */}
      <div className="table-scroll">
        <table className="custom-table">
          <thead>
            <tr>
              <th><HeaderCell label="Product Id" /></th>
              <th><HeaderCell label="Product Name" /></th>
              <th><HeaderCell label="Active" /></th>
              <th><HeaderCell label="Product Category" /></th>
              <th><HeaderCell label="Display Group" /></th>
              <th><HeaderCell label="Display Order" /></th>
              <th><HeaderCell label="Display in POS" /></th>
              <th><HeaderCell label="Face Value" /></th>
              <th><HeaderCell label="Selling Price" /></th>
              <th><HeaderCell label="Cash Balance" /></th>
              <th><HeaderCell label="Bonus Balance" /></th>
              <th><HeaderCell label="Card Quantity" /></th>
              <th><HeaderCell label="Access Profile" /></th>
              <th><HeaderCell label="Membership" /></th>
              <th><HeaderCell label="Card Validity (in days)" /></th>
              <th><HeaderCell label="Card Expiry date" /></th>
              <th><HeaderCell label="VIP Card" /></th>
              <th><HeaderCell label="POS Counter" /></th>
              <th><HeaderCell label="Tax Category" /></th>
              <th><HeaderCell label="Tax %" /></th>
              <th><HeaderCell label="Price no Tax" /></th>
              <th><HeaderCell label="Favourite" /></th>
              <th><HeaderCell label="Kiosk" /></th>
              <th><HeaderCell label="KOT" /></th>
              <th><HeaderCell label="Customer Card" /></th>
              <th><HeaderCell label="Last Updated Date" /></th>
              <th><HeaderCell label="Last Updated User" /></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "alt-row" : ""}>
                <td>{row.productId}</td>
                <td>{row.productName}</td>
                <td><input type="checkbox" checked={row.active} readOnly /></td>
                <td><select value={row.category} readOnly><option>{row.category}</option></select></td>
                <td><select value={row.displayGroup} readOnly><option>{row.displayGroup}</option></select></td>
                <td>{row.displayOrder}</td>
                <td><input type="checkbox" checked={row.displayInPOS} readOnly /></td>
                <td>{row.faceValue}</td>
                <td>{row.sellingPrice}</td>
                <td>{row.cashBalance}</td>
                <td>{row.bonusBalance}</td>
                <td>{row.cardQuantity}</td>
                <td><select value={row.accessProfile} readOnly><option>{row.accessProfile}</option></select></td>
                <td><select value={row.membership} readOnly><option>{row.membership}</option></select></td>
                <td>{row.cardValidity}</td>
                <td><input type="date" value={row.cardExpiry} readOnly /></td>
                <td><input type="checkbox" checked={row.vipCard} readOnly /></td>
                <td>{row.posCounter}</td>
                <td><select value={row.taxCategory} readOnly><option>{row.taxCategory}</option></select></td>
                <td>{row.taxPercent}</td>
                <td>{row.priceNoTax}</td>
                <td><input type="checkbox" checked={row.favourite} readOnly /></td>
                <td><input type="checkbox" checked={row.kiosk} readOnly /></td>
                <td><input type="checkbox" checked={row.kot} readOnly /></td>
                <td><input type="checkbox" checked={row.customerCard} readOnly /></td>
                <td>{row.lastUpdatedDate}</td>
                <td>{row.lastUpdatedUser}</td>
              </tr>
            ))}
          </tbody>
        </table>












        
      </div>
      {/* Table */}
      <div className="table-scroll">
        <table className="custom-table">
          {/* table head and body as you already have */}
        </table>
      </div>

      {/* Action Buttons */}
      <div className="table-actions">
        <button className="btn btn-add">Add</button>
        <button className="btn btn-save">Save</button>
        <button className="btn btn-refresh">Refresh</button>
        <button className="btn btn-delete">Delete</button>
        <button className="btn btn-close">Close</button>
      </div>

    </div>
  );
};

export default CustomTable;
