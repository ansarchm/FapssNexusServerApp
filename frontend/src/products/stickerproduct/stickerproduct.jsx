import React, { useState, useEffect } from "react";
import "./stickerproduct.css";
import { useNavigate } from "react-router-dom";
import { stickerProductService } from "../../services/api";

import searchIcon from "../../components/assets/search.png";
import filterIcon from "../../components/assets/filter.png";
import glass2Icon from "../../components/assets/glass2.png";
import stickerIcon from "../../components/assets/sticker.png";

const HeaderCell = ({ label }) => (
  <div className="sticker-product-header-container">
    <span className="sticker-product-header-text">{label}</span>
    <div className="sticker-product-sort-icons">
      <span className="sticker-product-arrow sticker-product-up1"></span>
      <span className="sticker-product-arrow sticker-product-down1"></span>
    </div>
  </div>
);

const StickerProduct = () => {
  const [selectedLocation, setSelectedLocation] = useState("Wonderland 1");
  const [productFilter, setProductFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch sticker products on component mount
  useEffect(() => {
    fetchStickerProducts();
  }, []);

  const fetchStickerProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🎯 Fetching sticker products...');
      
      const data = await stickerProductService.getStickerProducts();
      console.log('✅ Sticker products loaded:', data);
      
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error loading sticker products:', err);
      setError(err.message || 'Failed to load sticker products');
      
      // If unauthorized, redirect to login
      if (err.message?.includes('Unauthorized') || err.message?.includes('login')) {
        setTimeout(() => navigate('/'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStickerProducts();
  };

  const handleSearch = () => {
    // Implement search functionality if needed
    console.log('🔍 Searching for:', productFilter);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    if (!productFilter) return true;
    const searchTerm = productFilter.toLowerCase();
    return (
      product.productname?.toLowerCase().includes(searchTerm) ||
      product.id?.toString().includes(searchTerm) ||
      product.ptype?.toLowerCase().includes(searchTerm)
    );
  });

  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '$0.00';
    return `$${parseFloat(value).toFixed(2)}`;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Format datetime
  const formatDateTime = (date) => {
    if (!date) return '';
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
    <div className="sticker-product-table-wrapper">
      {/* ---------- Section Header ---------- */}
      <div className="sticker-product-section-header">
        <div className="sticker-product-section-title-container">
          <img
            src={stickerIcon}
            alt="Sticker Icon"
            className="sticker-product-section-icon"
          />

          <h2 className="sticker-product-section-title">Sticker Product</h2>

          <div className="sticker-product-location-container">
            <label htmlFor="location" className="sticker-product-location-label">
              Location
            </label>
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="sticker-product-location-select"
            >
              <option value="Wonderland 1">Wonderland 1</option>
              <option value="Wonderland 2">Wonderland 2</option>
              <option value="Wonderland 3">Wonderland 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---------- Action Row ---------- */}
      <div className="sticker-product-header-actions">
        {/* Search box with icon inside */}
        <div className="sticker-product-search-container2">
          <img
            src={searchIcon}
            alt="Search"
            className="sticker-product-search-input2-icon"
          />
          <input
            type="text"
            placeholder="Search"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="sticker-product-search-input2"
          />
        </div>

        {/* Filter Button with Icon and Dropdown */}
        <div className="sticker-product-filter-container">
          <button
            className="sticker-product-filter-btn"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <img
              src={filterIcon}
              alt="Filter"
              className="sticker-product-filter-icon"
            />
          </button>
          {showFilterDropdown && (
            <div className="sticker-product-filter-dropdown">
              <div className="sticker-product-filter-option">Product</div>
              <div className="sticker-product-filter-option">Display Group</div>
              <div className="sticker-product-filter-option">POS Counter</div>
            </div>
          )}
        </div>

        {/* Blue Search Button with Icon */}
        <button className="sticker-product-btn-search" onClick={handleSearch}>
          <img
            src={glass2Icon}
            alt="Search"
            className="sticker-product-search-btn-icon"
          />
          Search
        </button>

        {/* Right aligned Add + Refresh */}
        <div className="sticker-product-action-buttons">
          <button
            className="sticker-product-btn-add"
            onClick={() => navigate("/sticker-product-add")}
          >
            Add
          </button>

          <button 
            className="sticker-product-btn-refresh"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '15px', 
          margin: '10px 0', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px',
          border: '1px solid #ef5350'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          fontSize: '16px',
          color: '#666'
        }}>
          ⏳ Loading sticker products...
        </div>
      )}

      {/* No Data State */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          fontSize: '16px',
          color: '#666'
        }}>
          📦 No sticker products found
        </div>
      )}

      {/* Table */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="sticker-product-table-scroll">
          <table className="sticker-product-custom-table">
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
                <th><HeaderCell label="kiosk" /></th>
                <th><HeaderCell label="KOT" /></th>
                <th><HeaderCell label="Customer Card" /></th>
                <th><HeaderCell label="Inventory" /></th>
                <th><HeaderCell label="Game Time (Minutes)" /></th>
                <th><HeaderCell label="Last Updated Date" /></th>
                <th><HeaderCell label="Last Updated User" /></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((row, index) => (
                <tr key={row.id || index}>
                  <td>{row.id}</td>
                  <td>{row.productname}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.status === "1" || row.status === 1} 
                      readOnly 
                    />
                  </td>
                  <td>
                    <select value={row.category || "Sticker"} disabled>
                      <option>{row.category || "Sticker"}</option>
                    </select>
                  </td>
                  <td>
                    <select value={row.ptype || "Sticker"} disabled>
                      <option>{row.ptype || "Sticker"}</option>
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
                      <div className="sticker-product-text-box">
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
                  <td>{row.taxpercent || row.tax || 0}%</td>
                  <td>{formatCurrency(row.pricenotax || row.rate)}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.kiosk === 1 || row.kiosk === "1"} 
                      readOnly 
                    />
                  </td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.kot === 1 || row.kot === "1"} 
                      readOnly 
                    />
                  </td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.customercard === 1 || row.customercard === "1"} 
                      readOnly 
                    />
                  </td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.cardquantity > 0} 
                      readOnly 
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.gamed || 0}
                      className="sticker-product-text-box"
                      readOnly
                    />
                  </td>
                  <td>{formatDateTime(row.lastupdateddate)}</td>
                  <td>{row.lastupdateduser || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StickerProduct;