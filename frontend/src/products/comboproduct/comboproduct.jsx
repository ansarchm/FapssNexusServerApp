import React, { useState, useEffect } from "react";
import "./comboproduct.css";
import { useNavigate } from "react-router-dom";
import { comboProductService } from "../../services/api";

import searchIcon from "../../components/assets/search.png";
import filterIcon from "../../components/assets/filter.png";
import glass2Icon from "../../components/assets/glass2.png"; 
import comboIcon from "../../components/assets/combo.png"; 

const HeaderCell = ({ label }) => (
  <div className="combo-product-header-container">
    <span className="combo-product-header-text">{label}</span>
    <div className="combo-product-sort-icons">
      <span className="combo-product-arrow combo-product-up1"></span>
      <span className="combo-product-arrow combo-product-down1"></span>
    </div>
  </div>
);

const ComboProduct = () => {
  const [selectedLocation, setSelectedLocation] = useState("Wonderland 1");
  const [productFilter, setProductFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [comboProducts, setComboProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch combo products on component mount
  useEffect(() => {
    fetchComboProducts();
  }, []);

  const fetchComboProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🎁 Fetching combo products...');
      
      const products = await comboProductService.getComboProducts();
      console.log('📦 Received combo products:', products);
      
      setComboProducts(products || []);
    } catch (err) {
      console.error('❌ Error loading combo products:', err);
      setError(err.message || 'Failed to load combo products');
      
      // If unauthorized, redirect to login
      if (err.message?.includes('Unauthorized') || err.message?.includes('Not authenticated')) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchComboProducts();
  };

  // Filter products based on search
  const filteredProducts = comboProducts.filter(product => {
    if (!productFilter) return true;
    
    const searchLower = productFilter.toLowerCase();
    return (
      product.productname?.toLowerCase().includes(searchLower) ||
      product.ptype?.toLowerCase().includes(searchLower) ||
      product.membership?.toLowerCase().includes(searchLower) ||
      product.poscounter?.toLowerCase().includes(searchLower)
    );
  });

  // Format currency
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0.00';
    return `$${parseFloat(value).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="combo-product-table-wrapper">
      {/* ---------- Section Header ---------- */}
      <div className="combo-product-section-header">
        <div className="combo-product-section-title-container">
          {/* Combo Icon */}
          <img src={comboIcon} alt="Combo Icon" className="combo-product-section-icon" /> 
          
          <h2 className="combo-product-section-title">Combo Product</h2>

          <div className="combo-product-location-container">
            <label htmlFor="location" className="combo-product-location-label">
              Location
            </label>
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="combo-product-location-select"
            >
              <option value="Wonderland 1">Wonderland 1</option>
              <option value="Wonderland 2">Wonderland 2</option>
              <option value="Wonderland 3">Wonderland 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---------- Action Row ---------- */}
      <div className="combo-product-header-actions">
        {/* Search group - contains search input, filter, and search button */}
        <div className="combo-product-search-group">
          {/* Search box with icon inside */}
          <div className="combo-product-search-container2">
            <img src={searchIcon} alt="Search" className="combo-product-search-input2-icon" />
            <input
              type="text"
              placeholder="Search"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="combo-product-search-input2"
            />
          </div>

          {/* Filter Button with Icon and Dropdown */}
          <div className="combo-product-filter-container">
            <button 
              className="combo-product-filter-btn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <img src={filterIcon} alt="Filter" className="combo-product-filter-icon" />
            </button>
            {showFilterDropdown && (
              <div className="combo-product-filter-dropdown">
                <div className="combo-product-filter-option">Product</div>
                <div className="combo-product-filter-option">Display Group</div>
                <div className="combo-product-filter-option">POS Counter</div>
              </div>
            )}
          </div>

          {/* Blue Search Button with Icon */}
          <button className="combo-product-btn-search">
            <img src={glass2Icon} alt="Search" className="combo-product-search-btn-icon" />
            Search
          </button>
        </div>

        {/* Right aligned Add + Refresh */}
        <div className="combo-product-action-buttons">
          <button 
            className="combo-product-btn-add"
            onClick={() => navigate("/combo-product-add")}
          >
            Add
          </button>

          <button 
            className="combo-product-btn-refresh"
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
          backgroundColor: '#fee', 
          border: '1px solid #fcc', 
          borderRadius: '4px',
          margin: '10px 0',
          color: '#c00'
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
          ⏳ Loading combo products...
        </div>
      )}

      {/* No Products Message */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontSize: '16px',
          color: '#666'
        }}>
          {productFilter ? '🔍 No combo products found matching your search.' : '📦 No combo products available.'}
        </div>
      )}

      {/* Table */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="combo-product-table-scroll">
          <table className="combo-product-custom-table">
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
                <th><HeaderCell label="KOT" /></th>
                <th><HeaderCell label="Customer Card" /></th>
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
                    <select value={row.category || "Combo List"} disabled>
                      <option>{row.category || "Combo List"}</option>
                    </select>
                  </td>
                  <td>
                    <select value={row.ptype || "Combo"} disabled>
                      <option>{row.ptype || "Combo"}</option>
                    </select>
                  </td>
                  <td>{row.sequence}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.displayinpos === "1" || row.displayinpos === 1} 
                      readOnly 
                    />
                  </td>
                  <td>{formatCurrency(row.facevalue)}</td>
                  <td>{formatCurrency(row.sellingprice)}</td>
                  <td>{formatCurrency(row.cashbalance)}</td>
                  <td>{formatCurrency(row.bonus)}</td>
                  <td>{row.cardquantity || 0}</td>
                  <td>
                    {row.accessprofile ? (
                      <div className="combo-product-text-box">{row.accessprofile}</div>
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
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.vipcard === 1} 
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
                  <td>
                    <div className="combo-product-text-box">
                      {formatCurrency(row.pricenotax)}
                    </div>
                  </td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.kot === 1} 
                      readOnly 
                    />
                  </td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.customercard === 1} 
                      readOnly 
                    />
                  </td>
                  <td>
                    {row.lastupdateddate 
                      ? new Date(row.lastupdateddate).toLocaleString()
                      : "-"}
                  </td>
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

export default ComboProduct;