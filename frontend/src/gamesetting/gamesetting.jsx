import React, { useState } from "react";
import "./gamesetting.css";
import { useNavigate } from "react-router-dom";

import searchIcon from "../components/assets/search.png";
import filterIcon from "../components/assets/filter.png";
import glass2Icon from "../components/assets/glass2.png"; 
import coinIcon from "../components/assets/gamesetting.png"; 

// Sample data
const data = Array.from({ length: 15 }, (_, index) => ({
  select: index % 3 === 0, // Some rows selected
  gameId: 34569,
  description: "Trampoline",
  active: true,
  macId: "CC-AS-AB-7B-89-AS",
  category: "Group-2 video",
  subCategory: "Video",
  cashPrice: "10.00",
  vpDiscountPrice: "5",
  coinPlayPrice: "50",
  allowBonusPlay: true,
  allowTimePlay: true,
  displayOrientation: "Landscape",
  ledPattern: "Multi Color",
  lastUpdatedDate: "09-Dec-2024 12:11",
  lastUpdatedUser: "Ahmed bin jaseel"
}));

const HeaderCell = ({ label }) => (
  <div className="game-setting-header-container">
    <span className="game-setting-header-text">{label}</span>
    <div className="game-setting-sort-icons">
      <span className="game-setting-arrow game-setting-up1"></span>
      <span className="game-setting-arrow game-setting-down1"></span>
    </div>
  </div>
);

const CardProduct = () => {
  const [activeProductsOnly, setActiveProductsOnly] = useState(false);
  const [productFilter, setProductFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();

  const handleCheckboxChange = (index) => {
    setSelectedRow(index);
  };

  const handleUpdate = () => {
    if (selectedRow !== null) {
      console.log("Update row:", data[selectedRow]);
      // Navigate to update form or open modal
      navigate(`/game-setting-update/${data[selectedRow].gameId}`);
    }
  };

  return (
    <div className="game-setting-table-wrapper">
      {/* ---------- Section Header ---------- */}
      <div className="game-setting-section-header">
        <div className="game-setting-section-title-container">
          <img src={coinIcon} alt="Card Icon" className="game-setting-section-icon" /> 
          <h2 className="game-setting-section-title">Game Setting</h2>

          <div className="game-setting-checkbox-container">
            <input
              type="checkbox"
              id="activeOnly"
              checked={activeProductsOnly}
              onChange={(e) => setActiveProductsOnly(e.target.checked)}
            />
            <label htmlFor="activeOnly" className="game-setting-checkbox-label22">
              Active Games Only
            </label>
          </div>
        </div>
      </div>

      {/* ---------- Action Row ---------- */}
      <div className="game-setting-header-actions">
        {/* Search box */}
        <div className="game-setting-search-container2">
          <img src={searchIcon} alt="Search" className="game-setting-search-input2-icon" />
          <input
            type="text"
            placeholder="Search"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="game-setting-search-input2"
          />
        </div>

        {/* Filter Button */}
        <div className="game-setting-filter-container">
          <button 
            className="game-setting-filter-btn"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <img src={filterIcon} alt="Filter" className="game-setting-filter-icon" />
          </button>
          {showFilterDropdown && (
            <div className="game-setting-filter-dropdown">
              <div className="game-setting-filter-option">Game</div>
              <div className="game-setting-filter-option">Category</div>
              <div className="game-setting-filter-option">MAC ID</div>
            </div>
          )}
        </div>

        {/* Blue Search Button */}
        <button className="game-setting-btn-search">
          <img src={glass2Icon} alt="Search" className="game-setting-search-btn-icon" />
          Search
        </button>

        {/* Update + Add + Refresh */}
        <div className="game-setting-action-buttons">
          <button
            className="game-setting-btn-update"
            onClick={handleUpdate}
          
          >
            Update
          </button>
          <button 
            className="game-setting-btn-add"
            onClick={() => navigate("/gamesadd")}
          >
            Add
          </button>
          <button className="game-setting-btn-refresh">Refresh</button>
        </div>
      </div>

      {/* Table */}
      <div className="game-setting-table-scroll">
        <table className="game-setting-custom-table">
          <thead>
            <tr>
              <th><HeaderCell label="Select" /></th>
              <th><HeaderCell label="Game ID" /></th>
              <th><HeaderCell label="Description" /></th>
              <th><HeaderCell label="Active" /></th>
              <th><HeaderCell label="MAC ID" /></th>
              <th><HeaderCell label="Category" /></th>
              <th><HeaderCell label="Sub Category" /></th>
              <th><HeaderCell label="Cash Price" /></th>
              <th><HeaderCell label="VP Discount Price" /></th>
              <th><HeaderCell label="Coin Play Price" /></th>
              <th><HeaderCell label="Allow Bonus Play" /></th>
              <th><HeaderCell label="Allow Time Play" /></th>
              <th><HeaderCell label="Display Orientation" /></th>
              <th><HeaderCell label="LED Pattern" /></th>
              <th><HeaderCell label="Last Updated Date" /></th>
              <th><HeaderCell label="Last Updated User" /></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="16" style={{textAlign: 'center', padding: '40px', color: '#999'}}>
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRow === index}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td>{row.gameId}</td>
                  <td>{row.description}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.active} 
                      readOnly 
                      className="game-setting-active-checkbox" 
                    />
                  </td>
                  <td>
                    <div className="game-setting-mac-box">{row.macId}</div>
                  </td>
                  <td>
                    <select value={row.category} readOnly>
                      <option>{row.category}</option>
                    </select>
                  </td>
                  <td>
                    <select value={row.subCategory} readOnly>
                      <option>{row.subCategory}</option>
                    </select>
                  </td>
                  <td>{row.cashPrice}</td>
                  <td>{row.vpDiscountPrice}</td>
                  <td>{row.coinPlayPrice}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.allowBonusPlay} 
                      readOnly 
                      className="game-setting-active-checkbox" 
                    />
                  </td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.allowTimePlay} 
                      readOnly 
                      className="game-setting-active-checkbox" 
                    />
                  </td>
                  <td>
                    <select value={row.displayOrientation} readOnly>
                      <option>{row.displayOrientation}</option>
                    </select>
                  </td>
                  <td>
                    <select value={row.ledPattern} readOnly>
                      <option>{row.ledPattern}</option>
                    </select>
                  </td>
                  <td>{row.lastUpdatedDate}</td>
                  <td>{row.lastUpdatedUser}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CardProduct;
