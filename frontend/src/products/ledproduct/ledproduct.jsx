import React, { useState, useEffect } from "react";
import "./ledproduct.css";
import { useNavigate } from "react-router-dom";
import { ledProductService } from "../../services/api";

import searchIcon from "../../components/assets/search.png";
import filterIcon from "../../components/assets/filter.png";
import glass2Icon from "../../components/assets/glass2.png";
import ledIcon from "../../components/assets/led.png";

const HeaderCell = ({ label }) => (
  <div className="led-product-header-container">
    <span className="led-product-header-text">{label}</span>
    <div className="led-product-sort-icons">
      <span className="led-product-arrow led-product-up1"></span>
      <span className="led-product-arrow led-product-down1"></span>
    </div>
  </div>
);

const LedProduct = () => {
  const [selectedLocation, setSelectedLocation] = useState("Wonderland 1");
  const [productFilter, setProductFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [ledProducts, setLedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch LED products on component mount
  useEffect(() => {
    fetchLedProducts();
  }, []);

  const fetchLedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching LED products...');
      
      const data = await ledProductService.getLedProducts();
      console.log('✅ LED products fetched:', data);
      
      setLedProducts(data);
    } catch (err) {
      console.error('❌ Error fetching LED products:', err);
      setError(err.message || 'Failed to fetch LED products');
      
      // If unauthorized, redirect to login
      if (err.message?.includes('Unauthorized') || err.message?.includes('authenticated')) {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLedProducts();
  };

  const handleSearch = () => {
    if (productFilter.trim()) {
      const filtered = ledProducts.filter(product =>
        product.productname?.toLowerCase().includes(productFilter.toLowerCase()) ||
        product.id?.toString().includes(productFilter)
      );
      setLedProducts(filtered);
    } else {
      fetchLedProducts();
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "$0.00";
    return `$${parseFloat(value).toFixed(2)}`;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Format datetime
  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="led-product-table-wrapper">
      {/* ---------- Section Header ---------- */}
      <div className="led-product-section-header">
        <div className="led-product-section-title-container">
          <img
            src={ledIcon}
            alt="LED Icon"
            className="led-product-section-icon"
          />

          <h2 className="led-product-section-title">LED Product</h2>

          <div className="led-product-location-container">
            <label htmlFor="location" className="led-product-location-label">
              Location
            </label>
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="led-product-location-select"
            >
              <option value="Wonderland 1">Wonderland 1</option>
              <option value="Wonderland 2">Wonderland 2</option>
              <option value="Wonderland 3">Wonderland 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---------- Action Row ---------- */}
      <div className="led-product-header-actions">
        {/* Search box with icon inside */}
        <div className="led-product-search-container2">
          <img
            src={searchIcon}
            alt="Search"
            className="led-product-search-input2-icon"
          />
          <input
            type="text"
            placeholder="Search"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="led-product-search-input2"
          />
        </div>

        {/* Filter Button with Icon and Dropdown */}
        <div className="led-product-filter-container">
          <button
            className="led-product-filter-btn"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <img
              src={filterIcon}
              alt="Filter"
              className="led-product-filter-icon"
            />
          </button>
          {showFilterDropdown && (
            <div className="led-product-filter-dropdown">
              <div className="led-product-filter-option">Product</div>
              <div className="led-product-filter-option">Display Group</div>
              <div className="led-product-filter-option">POS Counter</div>
            </div>
          )}
        </div>

        {/* Blue Search Button with Icon */}
        <button className="led-product-btn-search" onClick={handleSearch}>
          <img
            src={glass2Icon}
            alt="Search"
            className="led-product-search-btn-icon"
          />
          Search
        </button>

        {/* Right aligned Add + Refresh */}
        <div className="led-product-action-buttons">
          <button
            className="led-product-btn-add"
            onClick={() => navigate("/led-product-add")}
          >
            Add
          </button>

          <button className="led-product-btn-refresh" onClick={handleRefresh}>
            Refresh
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px', fontSize: '16px', color: '#666' }}>
          ⏳ Loading LED products...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ textAlign: 'center', padding: '20px', fontSize: '16px', color: '#d32f2f', backgroundColor: '#ffebee', borderRadius: '4px', margin: '10px' }}>
          ❌ Error: {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && ledProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', fontSize: '16px', color: '#666' }}>
          📦 No LED products found. Click "Add" to create one.
        </div>
      )}

      {/* Table */}
      {!loading && !error && ledProducts.length > 0 && (
        <div className="led-product-table-scroll">
          <table className="led-product-custom-table">
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
                <th><HeaderCell label="Card Quantity" /></th>
                <th><HeaderCell label="Access Profile" /></th>
                <th><HeaderCell label="Membership" /></th>
                <th><HeaderCell label="Card Validity (in days)" /></th>
                <th><HeaderCell label="Card Expiry date" /></th>
                <th><HeaderCell label="POS Counter" /></th>
                <th><HeaderCell label="Tax Category" /></th>
                <th><HeaderCell label="Tax %" /></th>
                <th><HeaderCell label="Price no Tax" /></th>
                <th><HeaderCell label="KOT" /></th>
                <th><HeaderCell label="Customer Card" /></th>
                <th><HeaderCell label="Green (Minutes)" /></th>
                <th><HeaderCell label="Blue (Minutes)" /></th>
                <th><HeaderCell label="Red (Minutes)" /></th>
                <th><HeaderCell label="Bracelet Quantity" /></th>
                <th><HeaderCell label="Last Updated Date" /></th>
                <th><HeaderCell label="Last Updated User" /></th>
              </tr>
            </thead>
            <tbody>
              {ledProducts.map((row, index) => (
                <tr key={row.id || index}>
                  <td>{row.id}</td>
                  <td>{row.productname || 'N/A'}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.status === "1" || row.status === 1} 
                      readOnly 
                    />
                  </td>
                  <td>
                    <select value={row.category || "LED Products"} disabled>
                      <option>{row.category || "LED Products"}</option>
                    </select>
                  </td>
                  <td>
                    <select value={row.ptype || "Product"} disabled>
                      <option>{row.ptype || "Product"}</option>
                    </select>
                  </td>
                  <td>{row.sequence || 0}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.displayinpos === "1" || row.displayinpos === 1} 
                      readOnly 
                    />
                  </td>
                  <td>{formatCurrency(row.facevalue || row.rate)}</td>
                  <td>{formatCurrency(row.sellingprice || row.rate)}</td>
                  <td>{row.cardquantity || 0}</td>
                  <td>
                    {row.accessprofile ? (
                      <div className="led-product-text-box">
                        {row.accessprofile}
                      </div>
                    ) : (
                      <select disabled>
                        <option>-</option>
                      </select>
                    )}
                  </td>
                  <td>
                    <select value={row.membership || ""} disabled>
                      <option>{row.membership || "-"}</option>
                    </select>
                  </td>
                  <td>{row.cardvalidity || 0}</td>
                  <td>
                    <input 
                      type="date" 
                      value={formatDate(row.cardexpirydate)} 
                      readOnly 
                    />
                  </td>
                  <td>{row.poscounter || "-"}</td>
                  <td>
                    <select value={row.taxcategory || ""} disabled>
                      <option>{row.taxcategory || "-"}</option>
                    </select>
                  </td>
                  <td>{row.taxpercent ? `${row.taxpercent}%` : "0%"}</td>
                  <td>{formatCurrency(row.pricenotax)}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.kot === 1 || row.kot === true} 
                      readOnly 
                    />
                  </td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.customercard === 1 || row.customercard === true} 
                      readOnly 
                    />
                  </td>
                  <td>
                    <div className="led-product-minutes-box">
                      {row.green || 0}
                    </div>
                  </td>
                  <td>
                    <div className="led-product-minutes-box">
                      {row.blue || 0}
                    </div>
                  </td>
                  <td>
                    <div className="led-product-minutes-box">
                      {row.red || 0}
                    </div>
                  </td>
                  <td>
                    <div className="led-product-minutes-box">
                      {row.cardquantity || 0}
                    </div>
                  </td>
                  <td>{formatDateTime(row.lastupdateddate)}</td>
                  <td>{row.lastupdateduser || "Admin"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LedProduct;