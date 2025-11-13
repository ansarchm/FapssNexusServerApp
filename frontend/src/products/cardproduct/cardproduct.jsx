import React, { useState, useEffect } from "react";
import "./cardproduct.css";
import { useNavigate } from "react-router-dom";
import { cardProductService } from "../../services/api";

import searchIcon from "../../components/assets/search.png";
import filterIcon from "../../components/assets/filter.png";
import glass2Icon from "../../components/assets/glass2.png";
import cardIcon from "../../components/assets/card-icon.png";

const HeaderCell = ({ label }) => (
  <div className="cp-header-container">
    <span className="cp-header-text">{label}</span>
    <div className="cp-sort-icons">
      <span className="cp-arrow cp-up1"></span>
      <span className="cp-arrow cp-down1"></span>
    </div>
  </div>
);

const CardProduct = () => {
  const [selectedLocation, setSelectedLocation] = useState("Wonderland 1");
  const [productFilter, setProductFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCardProducts();
  }, []);

  useEffect(() => {
    let filtered = [...data];

    if (productFilter.trim()) {
      const searchLower = productFilter.toLowerCase();
      filtered = filtered.filter(product =>
        product.productname?.toLowerCase().includes(searchLower) ||
        product.id?.toString().includes(searchLower) ||
        product.ptype?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredData(filtered);
  }, [data, productFilter]);

  const fetchCardProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching card products...');
      
      const response = await cardProductService.getCardProducts();
      
      console.log('📦 API Response:', response);
      console.log('📦 Response type:', typeof response);
      console.log('📦 Is array:', Array.isArray(response));
      
      // Handle response - API now returns direct array
      let products = [];
      
      if (Array.isArray(response)) {
        products = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        products = response.data;
      } else if (response && typeof response === 'object') {
        // Single object, wrap in array
        products = [response];
      }
      
      console.log('✅ Processed products:', products.length, 'items');
      console.log('✅ First product:', products[0]);
      
      setData(products);
      setFilteredData(products);
      
      if (products.length === 0) {
        setError('No card products found in database. Click "Add" to create one.');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      console.error('❌ Error response:', err.response);
      
      if (err.response?.status === 401) {
        setError('Session expired. Redirecting to login...');
        setTimeout(() => navigate('/'), 2000);
      } else if (err.response?.status === 500) {
        const detail = err.response?.data?.detail || err.message;
        setError(`Database error: ${detail}`);
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to API. Check if API is running on https://localhost:7221');
      } else {
        setError(`Failed to load: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    console.log('Searching with filter:', productFilter);
  };

  const handleRefresh = () => {
    setProductFilter("");
    fetchCardProducts();
  };

  const handleRowClick = (product) => {
    console.log('Navigating to edit:', product.id);
    navigate(`/card-productform/${product.id}`);
  };

  const handleDeleteProduct = async (e, productId) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this card product?')) {
      try {
        await cardProductService.deleteCardProduct(productId);
        alert('Card product deleted successfully');
        fetchCardProducts();
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "$0.00";
    return `$${parseFloat(value).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const day = String(date.getDate()).padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const day = String(date.getDate()).padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  const isChecked = (value) => {
    return value === '1' || value === 1 || value === true;
  };

  return (
    <div className="cp-table-wrapper">
      {/* Section Header */}
      <div className="cp-section-header">
        <div className="cp-section-title-container">
          <img src={cardIcon} alt="Card Icon" className="cp-section-icon" />
          <h2 className="cp-section-title">Card Product</h2>

          <div className="cp-location-container">
            <label htmlFor="location" className="cp-location-label">
              Location
            </label>
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="cp-location-select"
            >
              <option value="Wonderland 1">Wonderland 1</option>
              <option value="Wonderland 2">Wonderland 2</option>
              <option value="Wonderland 3">Wonderland 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="cp-header-actions">
        <div className="cp-search-group">
          <div className="cp-search-container2">
            <img src={searchIcon} alt="Search" className="cp-search-input2-icon" />
            <input
              type="text"
              placeholder="Search by name, ID, or type..."
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="cp-search-input2"
            />
          </div>

          <div className="cp-filter-container">
            <button
              className="cp-filter-btn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <img src={filterIcon} alt="Filter" className="cp-filter-icon" />
            </button>
            {showFilterDropdown && (
              <div className="cp-filter-dropdown">
                <div className="cp-filter-option">Product Name</div>
                <div className="cp-filter-option">Display Group</div>
                <div className="cp-filter-option">Price Range</div>
              </div>
            )}
          </div>

          <button className="cp-btn-search" onClick={handleSearch}>
            <img src={glass2Icon} alt="Search" className="cp-search-btn-icon" />
            Search
          </button>
        </div>

        <div className="cp-action-buttons">
          <button
            className="cp-btn-add"
            onClick={() => navigate("/card-productform")}
          >
            Add
          </button>

          <button className="cp-btn-refresh" onClick={handleRefresh}>
            Refresh
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px', 
          fontSize: '18px',
          color: '#666',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Loading Card Products...</div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            Fetching data from database...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '30px', 
          color: '#d32f2f',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          margin: '20px',
          border: '2px solid #f44336'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚠️</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Error Loading Data</div>
          <div style={{ fontSize: '14px' }}>{error}</div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="cp-table-scroll">
          <table className="cp-custom-table">
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
                <th><HeaderCell label="Kiosk" /></th>
                <th><HeaderCell label="KOT" /></th>
                <th><HeaderCell label="Customer Card" /></th>
                <th><HeaderCell label="Last Updated Date" /></th>
                <th><HeaderCell label="Last Updated User" /></th>
                <th><HeaderCell label="Actions" /></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="27" style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    color: '#666',
                    fontSize: '16px'
                  }}>
                    {productFilter 
                      ? '🔍 No card products match your search criteria' 
                      : '📦 No card products found in database. Click "Add" to create your first product.'}
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr
                    key={row.id || index}
                    onClick={() => handleRowClick(row)}
                    style={{ cursor: 'pointer' }}
                    className="table-row-hover"
                  >
                    <td>{row.id}</td>
                    <td><strong>{row.productname}</strong></td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={isChecked(row.status)} 
                        readOnly 
                      />
                    </td>
                    <td>{row.category || 'Card category'}</td>
                    <td>{row.ptype || '-'}</td>
                    <td>{row.sequence || 0}</td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={isChecked(row.displayinpos)} 
                        readOnly 
                      />
                    </td>
                    <td>{formatCurrency(row.facevalue || row.rate)}</td>
                    <td>{formatCurrency(row.sellingprice || row.rate)}</td>
                    <td>{formatCurrency(row.cashbalance)}</td>
                    <td>{formatCurrency(row.bonus)}</td>
                    <td>{row.cardquantity || 0}</td>
                    <td>{row.accessprofile || '-'}</td>
                    <td>{row.membership || '-'}</td>
                    <td>{row.cardvalidity || row.duration || 0}</td>
                    <td>{formatDate(row.cardexpirydate)}</td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={isChecked(row.vipcard)} 
                        readOnly 
                      />
                    </td>
                    <td>{row.poscounter || '-'}</td>
                    <td>{row.taxcategory || '-'}</td>
                    <td>{row.taxpercent || row.tax || 0}%</td>
                    <td>{formatCurrency(row.pricenotax || row.rate)}</td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={isChecked(row.kiosk)} 
                        readOnly 
                      />
                    </td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={isChecked(row.kot)} 
                        readOnly 
                      />
                    </td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={isChecked(row.customercard)} 
                        readOnly 
                      />
                    </td>
                    <td>{formatDateTime(row.lastupdateddate)}</td>
                    <td>{row.lastupdateduser || 'Admin'}</td>
                    <td>
                      <button
                        onClick={(e) => handleDeleteProduct(e, row.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Footer */}
      {!loading && !error && filteredData.length > 0 && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderTop: '2px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px'
        }}>
          
        </div>
      )}
    </div>
  );
};

export default CardProduct;