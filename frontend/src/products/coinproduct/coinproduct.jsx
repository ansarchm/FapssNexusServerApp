import React, { useState } from "react";
import "./coinproduct.css";
import { useNavigate } from "react-router-dom";

import searchIcon from "../../components/assets/search.png";
import filterIcon from "../../components/assets/filter.png";
import glass2Icon from "../../components/assets/glass2.png"; 
import coinIcon from "../../components/assets/coin1.png"; 

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
  coinBalance: "12",
  cardQuantity: 9,
  accessProfile: "attraction: content",
  membership: "Happy monday",
  cardValidity: 360,
  cardExpiry: "2025-04-23",
  posCounter: "Pos 1, Pos 2",
  taxCategory: "TAX001",
  taxPercent: "10%",
  priceNoTax: "90.00",
  kiosk: true,
  kot: true,
  CustomerCard: true,
  lastUpdatedDate: "2024-12-09 12:11",
  lastUpdatedUser: "Ahmed bin jaseel"
}));

const HeaderCell = ({ label }) => (
  <div className="coin-product-header-container">
    <span className="coin-product-header-text">{label}</span>
    <div className="coin-product-sort-icons">
      <span className="coin-product-arrow coin-product-up1"></span>
      <span className="coin-product-arrow coin-product-down1"></span>
    </div>
  </div>
);

const CardProduct = () => {
  const [selectedLocation, setSelectedLocation] = useState("Wonderland 1");
  const [productFilter, setProductFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="coin-product-table-wrapper">
      {/* ---------- Section Header ---------- */}
      <div className="coin-product-section-header">
        <div className="coin-product-section-title-container">
          <img src={coinIcon} alt="Card Icon" className="coin-product-section-icon" /> 
          <h2 className="coin-product-section-title">Coin Product</h2>

          <div className="coin-product-location-container">
            <label htmlFor="location" className="coin-product-location-label">
              Location
            </label>
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="coin-product-location-select"
            >
              <option value="Wonderland 1">Wonderland 1</option>
              <option value="Wonderland 2">Wonderland 2</option>
              <option value="Wonderland 3">Wonderland 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---------- Action Row ---------- */}
      <div className="coin-product-header-actions">
        {/* Search box with icon inside */}
        <div className="coin-product-search-container2">
          <img src={searchIcon} alt="Search" className="coin-product-search-input2-icon" />
          <input
            type="text"
            placeholder="Search"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="coin-product-search-input2"
          />
        </div>

        {/* Filter Button with Icon and Dropdown */}
        <div className="coin-product-filter-container">
          <button 
            className="coin-product-filter-btn"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <img src={filterIcon} alt="Filter" className="coin-product-filter-icon" />
          </button>
          {showFilterDropdown && (
            <div className="coin-product-filter-dropdown">
              <div className="coin-product-filter-option">Product</div>
              <div className="coin-product-filter-option">Display Group</div>
              <div className="coin-product-filter-option">POS Counter</div>
            </div>
          )}
        </div>

        {/* Blue Search Button with Icon */}
        <button className="coin-product-btn-search">
          <img src={glass2Icon} alt="Search" className="coin-product-search-btn-icon" />
          Search
        </button>

        {/* Right aligned Add + Refresh */}
        <div className="coin-product-action-buttons">
          <button 
            className="coin-product-btn-add"
            onClick={() => navigate("/coin-productform")}
          >
            Add
          </button>

          <button className="coin-product-btn-refresh">Refresh</button>
        </div>
      </div>

      {/* Table */}
      <div className="coin-product-table-scroll">
        <table className="coin-product-custom-table">
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
              <th><HeaderCell label="Coin Balance" /></th>
              <th><HeaderCell label="Card Quantity" /></th>
              <th><HeaderCell label="Access Profile" /></th>
              <th><HeaderCell label="Membership" /></th>
              <th><HeaderCell label="Card Validity (in days)" /></th>
              <th><HeaderCell label="Card Expiry date" /></th>
              <th><HeaderCell label="POS Counter" /></th>
              <th><HeaderCell label="Tax Category" /></th>
              <th><HeaderCell label="Tax %" /></th>
              <th><HeaderCell label="Price no Tax" /></th>
              <th><HeaderCell label="kiosk" /></th>
              <th><HeaderCell label="KOT" /></th>
              <th><HeaderCell label="Customer Card" /></th>
              <th><HeaderCell label="Last Updated Date" /></th>
              <th><HeaderCell label="Last Updated User" /></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.productId}</td>
                <td>{row.productName}</td>
                <td><input type="checkbox" checked={row.active} readOnly /></td>
                <td>
                  <select value={row.category} readOnly>
                    <option>{row.category}</option>
                  </select>
                </td>
                <td>
                  <select value={row.displayGroup} readOnly>
                    <option>{row.displayGroup}</option>
                  </select>
                </td>
                <td>{row.displayOrder}</td>
                <td><input type="checkbox" checked={row.displayInPOS} readOnly /></td>
                <td>{row.faceValue}</td>
                <td>{row.sellingPrice}</td>
                <td>{row.coinBalance}</td>
                <td>{row.cardQuantity}</td>
                <td>
                  {row.accessProfile === "attraction: content" ? (
                    <div className="coin-product-text-box">{row.accessProfile}</div>
                  ) : (
                    <select value={row.accessProfile} readOnly>
                      <option>{row.accessProfile}</option>
                    </select>
                  )}
                </td>
                <td>
                  <select value={row.membership} readOnly>
                    <option>{row.membership}</option>
                  </select>
                </td>
                <td>{row.cardValidity}</td>
                <td><input type="date" value={row.cardExpiry} readOnly /></td>
                <td>{row.posCounter}</td>
                <td>
                  <select value={row.taxCategory} readOnly>
                    <option>{row.taxCategory}</option>
                  </select>
                </td>
                <td>{row.taxPercent}</td>
                <td>{row.priceNoTax}</td>
                <td><input type="checkbox" checked={row.kiosk} readOnly /></td>
                <td><input type="checkbox" checked={row.kot} readOnly /></td>
                <td><input type="checkbox" checked={row.CustomerCard} readOnly /></td>
                <td>{row.lastUpdatedDate}</td>
                <td>{row.lastUpdatedUser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CardProduct;