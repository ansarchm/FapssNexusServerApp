import React, { useState } from "react";
import "./stock.css"; 
import searchIcon from "../../components/assets/search.png";
import logo from "../../components/assets/item copy.png";
import refresh from '../../components/assets/Vector.png';
import print from '../../components/assets/Group 1000004904.png';
import exporticon from '../../components/assets/solar_export-broken.png';
import cancelIcon from '../../components/assets/iconoir_cancel.png';

import { useNavigate } from "react-router-dom";

const data = [
  { id: 1, ProductName: "Coffee", Barcode: "434567", Quantity: 20, BOM: "Pcs", SellingPrice: 2000, TicketPrice: 2000, status: "green" },
  { id: 2, ProductName: "Water", Barcode: "434567", Quantity: 20, BOM: "Pcs", SellingPrice: 6000, TicketPrice: 6000, status: "green" },
  { id: 3, ProductName: "Card 10 JD", Barcode: "434567", Quantity: 20, BOM: "Nos", SellingPrice: 9000, TicketPrice: 9000, status: "blue" },
  { id: 4, ProductName: "Card 20 JD", Barcode: "134567", Quantity: 20, BOM: "Nos", SellingPrice: 10500, TicketPrice: 10500, status: "green" },
  { id: 5, ProductName: "Time Band 1 Hr", Barcode: "234567", Quantity: 20, BOM: "Pcs", SellingPrice: 10500, TicketPrice: 10500, status: "green" },
  { id: 6, ProductName: "Hot Choco", Barcode: "434567", Quantity: 12, BOM: "Nos", SellingPrice: 10500, TicketPrice: 10500, status: "red" },
  { id: 7, ProductName: "Card 20 JD", Barcode: "434567", Quantity: 20, BOM: "Nos", SellingPrice: 10500, TicketPrice: 10500, status: "red" },
  { id: 8, ProductName: "Card 20 JD", Barcode: "134567", Quantity: 20, BOM: "Nos", SellingPrice: 10500, TicketPrice: 10500, status: "green" },
  { id: 9, ProductName: "Hot Choco", Barcode: "434567", Quantity: 12, BOM: "Nos", SellingPrice: 10500, TicketPrice: 10500, status: "blue" },
  { id: 10, ProductName: "Card 20 JD", Barcode: "134567", Quantity: 20, BOM: "Nos", SellingPrice: 10500, TicketPrice: 10500, status: "blue" },
  { id: 11, ProductName: "Hot Choco", Barcode: "434567", Quantity: 12, BOM: "Nos", SellingPrice: 10500, TicketPrice: 10500, status: "blue" },
];

const StockTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [activeProductOnly, setActiveProductOnly] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Wonderland');
  const navigate = useNavigate();

  const filtered = data.filter((row) =>
    row.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.Barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.Quantity.toString().includes(searchTerm.toLowerCase()) || 
    row.BOM.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="separated-table-container">
      {/* Stock Header with Logo, Title, Checkbox and Action Buttons */}
      <div className="stock-headers">
        <div className="stock-header-left">
          <img src={logo} alt="Stock Logo" className="stock-logo" />
          <h2 className="stock-title">Stock</h2>
          <div className="active-product-checkbox">
            <input 
              type="checkbox" 
              id="activeProduct" 
              checked={activeProductOnly}
              onChange={(e) => setActiveProductOnly(e.target.checked)}
            />
            <label htmlFor="activeProduct">Active Product Only</label>
          </div>
        </div>
        
        <div className="stock-header-actions">
          <button className="header-action-btn refresh-btn">
            <img src={refresh} className="buttonicon"  />
            Refresh</button>
          <button className="header-action-btn print-btn">
            <img src={print}  className="buttonicon" />
            Print</button>
          <button className="header-action-btn export-btn">
            <img src={exporticon}  className="buttonicon"/>
            Export</button>
          <button className="header-action-btn save-btn">Save</button>
        </div>
      </div>

      {/* Location Bar with Dropdown and Inventory Buttons */}
      <div className="location-bar">
        <div className="location-section">
          <label className="location-label">Location</label>
          <select 
            className="location-dropdown"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="Wonderland">Wonderland</option>
            <option value="Location 2">Location 2</option>
            <option value="Location 3">Location 3</option>
          </select>

          {/* Inventory buttons right next to dropdown */}
          <div className="inventory-actions">
            <button 
              className="inventory-btn quick-inventory-btn"
              onClick={() => navigate('/quickinventory')}
            >
              Quick Inventory
            </button>
            <button 
              className="inventory-btn adjust-inventory-btn"
              onClick={() => setShowAdjustModal(true)}
            >
              Adjust Inventory
            </button>
            <button 
              className="inventory-btn transfer-inventory-btn"
              onClick={() => navigate('/transferstock')}
            >
              Transfer Inventory
            </button>
            
          </div>
        </div>
      </div>
    
      {/* Filter Toggles and Search Bar */}
      <div className="separated-top-bar">
        <div className="filter-toggles">
          <label className="switch">
            <input type="checkbox" />
            <span className="slider red"></span>
            Negative quantity
          </label>

          <label className="switch">
            <input type="checkbox" />
            <span className="slider green"></span>
            Non Zero quantity
          </label>

          <label className="switch">
            <input type="checkbox" />
            <span className="slider gray"></span>
            Zero quantity
          </label>

          <div className="separated-search-container">
            <img src={searchIcon} alt="Search" className="separated-search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="separated-search-input"
              placeholder="product search"
            />
          </div>
        </div>

        {/* Product Count Section - Moved to right end */}
        <div className="product-count-section">
          <span className="product-count-label">Product count: 8</span>
          <div className="count-btns">
            <button className="count-btn red">-2</button>
            <button className="count-btn blue">3</button>
            <button className="count-btn green">8</button>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="separated-table-header">
        <div className="separated-header-cell separated-col-active">
    <span>Active</span>
    <div className="separated-sort-arrows">
      <div className="separated-arrow-up"></div>
      <div className="separated-arrow-down"></div>
    </div>
  </div>
        {/* <div className="separated-header-cell separated-col-status"></div> */}
        <div className="separated-header-cell separated-col-id">
          <span>Id</span>
          <div className="separated-sort-arrows">
            <div className="separated-arrow-up"></div>
            <div className="separated-arrow-down"></div>
          </div>
        </div>
        <div className="separated-header-cell separated-col-productname">
          <span>Product name</span>
          <div className="separated-sort-arrows">
            <div className="separated-arrow-up"></div>
            <div className="separated-arrow-down"></div>
          </div>
        </div>
        <div className="separated-header-cell separated-col-barcode">
          <span>Barcode</span>
          <div className="separated-sort-arrows">
            <div className="separated-arrow-up"></div>
            <div className="separated-arrow-down"></div>
          </div>
        </div>
        <div className="separated-header-cell separated-col-quantity">
          <span>Quantity</span>
          <div className="separated-sort-arrows">
            <div className="separated-arrow-up"></div>
            <div className="separated-arrow-down"></div>
          </div>
        </div>
        <div className="separated-header-cell separated-col-bom">
          <span>BOM</span>
          <div className="separated-sort-arrows">
            <div className="separated-arrow-up"></div>
            <div className="separated-arrow-down"></div>
          </div>
        </div>
        <div className="separated-header-cell separated-col-sellingprice">
          <span>Selling Price</span>
          <div className="separated-sort-arrows">
            <div className="separated-arrow-up"></div>
            <div className="separated-arrow-down"></div>
          </div>
        </div>
        <div className="separated-header-cell separated-col-ticketprice">
          <span>Ticket Price</span>
          <div className="separated-sort-arrows">
            <div className="separated-arrow-up"></div>
            <div className="separated-arrow-down"></div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="separated-table-content">
        {filtered.map((row, index) => (
          <div key={index} className={`separated-table-row ${index % 2 === 1 ? 'separated-row-yellow' : ''}`}>
            <div className="separated-cell separated-col-status">
              <span className={`status-dot ${row.status}`}></span>
            </div>
            <div className="separated-cell separated-col-id">
              {row.id}
            </div>
            <div className="separated-cell separated-col-productname">{row.ProductName}</div>
            <div className="separated-cell separated-col-barcode">{row.Barcode}</div>
            <div className="separated-cell separated-col-quantity">{row.Quantity}</div>
            <div className="separated-cell separated-col-bom">{row.BOM}</div>
            <div className="separated-cell separated-col-sellingprice">{row.SellingPrice}</div>
            <div className="separated-cell separated-col-ticketprice">{row.TicketPrice}</div>
          </div>
        ))}
      </div>

      {/* Adjust Inventory Modal */}
      {showAdjustModal && (
        <div className="adjust-overlay">
          <div className="adjust-container">
            {/* Header */}
            <div className="adjust-header">
              <h2 className="adjust-title">Adjust Inventory</h2>
              <button onClick={() => setShowAdjustModal(false)} className="adjust-button">
                <img src={cancelIcon} alt="Close button" className="adjust-close"/>
              </button>
            </div>

            {/* Content */}
            <div className="adjust-body">
              <div className="adjust-box">
                {/* Product Details */}
                <div className="adjust-product-info">
                  <p>Product : Pepsi 330 ML</p>
                  <p>Barcode : 2323845</p>
                </div>

                {/* Body */}
                <div className="adjust-details">
                  {/* Received Quantity */}
                  <div className="adjust-quantity">
                    <label>Received Quantity</label>
                    <input
                      type="number"
                      defaultValue="12"
                      className="adjust-qty-input"
                    />
                  </div>

                  {/* Stock Info */}
                  <div className="adjust-stock-info">
                    <p>Current Counter Stock : 100</p>
                    <p>Adjusted Counter Stock : 100</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="adjust-divider" />

            {/* Footer */}
            <div className="adjust-actions">
              <button className="adjust-save-btn">Save</button>
              <button className="adjust-cancel-btn" onClick={() => setShowAdjustModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTable;