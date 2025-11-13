import React, { useState, useEffect } from "react";
import "./timeproduct.css";
import { useNavigate } from "react-router-dom";
import { timeProductService } from "../../services/api";

import searchIcon from "../../components/assets/search.png";
import filterIcon from "../../components/assets/filter.png";
import glass2Icon from "../../components/assets/glass2.png";
import timeIcon from "../../components/assets/time.png";

const HeaderCell = ({ label }) => (
  <div className="time-product-header-container">
    <span className="time-product-header-text">{label}</span>
    <div className="time-product-sort-icons">
      <span className="time-product-arrow time-product-up1"></span>
      <span className="time-product-arrow time-product-down1"></span>
    </div>
  </div>
);

const TimeProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProductsOnly, setActiveProductsOnly] = useState(false);
  const [productFilter, setProductFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const navigate = useNavigate();

  // Fetch time products on component mount
  useEffect(() => {
    fetchTimeProducts();
  }, []);

  const fetchTimeProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching time products...");

      const products = await timeProductService.getTimeProducts();
      console.log("✅ Products received:", products);

      setData(products);
    } catch (err) {
      console.error("❌ Error fetching time products:", err);
      setError(err.message || "Failed to load time products");
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on active status and search
  const filteredData = data.filter((row) => {
    const matchesActive =
      !activeProductsOnly || row.status === "1" || row.status === 1;
    const matchesSearch =
      !productFilter ||
      row.productname?.toLowerCase().includes(productFilter.toLowerCase()) ||
      row.id?.toString().includes(productFilter);
    return matchesActive && matchesSearch;
  });

  // Format date for display
  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    try {
      const date = new Date(dateValue);
      return date.toISOString().split("T")[0];
    } catch {
      return dateValue;
    }
  };

  if (loading) {
    return (
      <div className="time-product-table-wrapper">
        <div style={{ padding: "20px", textAlign: "center" }}>
          Loading time products...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="time-product-table-wrapper">
        <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
          Error: {error}
          <br />
          <button onClick={fetchTimeProducts} style={{ marginTop: "10px" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="time-product-table-wrapper">
      {/* Section Header */}
      <div className="time-product-section-header">
        <div className="time-product-section-title-container">
          <img
            src={timeIcon}
            alt="Time Icon"
            className="time-product-section-icon"
          />
          <h2 className="time-product-section-title">Time Product</h2>

          <div className="time-product-checkbox-container">
            <input
              type="checkbox"
              id="activeOnly"
              checked={activeProductsOnly}
              onChange={(e) => setActiveProductsOnly(e.target.checked)}
            />
            <label
              htmlFor="activeOnly"
              className="time-product-checkbox-label22"
            >
              Active Products Only
            </label>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="time-product-header-actions">
        <div className="time-product-search-container2">
          <img
            src={searchIcon}
            alt="Search"
            className="time-product-search-input2-icon"
          />
          <input
            type="text"
            placeholder="Search"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="time-product-search-input2"
          />
        </div>

        <div className="time-product-filter-container">
          <button
            className="time-product-filter-btn"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <img
              src={filterIcon}
              alt="Filter"
              className="time-product-filter-icon"
            />
          </button>
          {showFilterDropdown && (
            <div className="time-product-filter-dropdown">
              <div className="time-product-filter-option">Product</div>
              <div className="time-product-filter-option">Display Group</div>
              <div className="time-product-filter-option">POS Counter</div>
            </div>
          )}
        </div>

        <button className="time-product-btn-search">
          <img
            src={glass2Icon}
            alt="Search"
            className="time-product-search-btn-icon"
          />
          Search
        </button>

        <div className="time-product-action-buttons">
          <button
            className="time-product-btn-add"
            onClick={() => navigate("/time-productform")}
          >
            Add
          </button>
          <button
            className="time-product-btn-refresh"
            onClick={fetchTimeProducts}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="time-product-table-scroll">
        <table className="time-product-custom-table">
          <thead>
            <tr>
              <th>
                <HeaderCell label="Product Id" />
              </th>
              <th>
                <HeaderCell label="Product Name" />
              </th>
              <th>
                <HeaderCell label="Active" />
              </th>
              <th>
                <HeaderCell label="Product Category" />
              </th>
              <th>
                <HeaderCell label="Display Group" />
              </th>
              <th>
                <HeaderCell label="Display Order" />
              </th>
              <th>
                <HeaderCell label="Display in POS" />
              </th>
              <th>
                <HeaderCell label="Face Value" />
              </th>
              <th>
                <HeaderCell label="Selling Price" />
              </th>
              <th>
                <HeaderCell label="Time Balance" />
              </th>
              <th>
                <HeaderCell label="Card Quantity" />
              </th>
              <th>
                <HeaderCell label="Access Profile" />
              </th>
              <th>
                <HeaderCell label="Membership" />
              </th>
              <th>
                <HeaderCell label="Card Validity (in days)" />
              </th>
              <th>
                <HeaderCell label="Card Expiry date" />
              </th>
              <th>
                <HeaderCell label="POS Counter" />
              </th>
              <th>
                <HeaderCell label="Tax Category" />
              </th>
              <th>
                <HeaderCell label="Tax %" />
              </th>
              <th>
                <HeaderCell label="Price no Tax" />
              </th>
              <th>
                <HeaderCell label="kiosk" />
              </th>
              <th>
                <HeaderCell label="KOT" />
              </th>
              <th>
                <HeaderCell label="Customer Card" />
              </th>
              <th>
                <HeaderCell label="Last Updated Date" />
              </th>
              <th>
                <HeaderCell label="Last Updated User" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="24"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No time products found
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
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
                    <select value={row.category || ""} readOnly>
                      <option>{row.category}</option>
                    </select>
                  </td>
                  <td>
                    <select value={row.ptype || ""} readOnly>
                      <option>{row.ptype}</option>
                    </select>
                  </td>
                  <td>{row.sequence || 0}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={
                        row.displayinpos === "1" || row.displayinpos === 1
                      }
                      readOnly
                    />
                  </td>
                  <td>${row.facevalue || row.rate || 0}</td>
                  <td>${row.sellingprice || row.rate || 0}</td>
                  <td>{row.duration || 0}</td>
                  <td>{row.cardquantity || 0}</td>
                  <td>
                    {row.accessprofile ? (
                      <div className="time-product-text-box">
                        {row.accessprofile}
                      </div>
                    ) : (
                      <select readOnly>
                        <option>-</option>
                      </select>
                    )}
                  </td>
                  <td>
                    <select value={row.membership || ""} readOnly>
                      <option>{row.membership || "-"}</option>
                    </select>
                  </td>
                  <td>{row.cardvalidity || row.duration || 0}</td>
                  <td>
                    <input
                      type="date"
                      value={formatDate(row.cardexpirydate)}
                      readOnly
                    />
                  </td>
                  <td>{row.poscounter || ""}</td>
                  <td>
                    <select value={row.taxcategory || ""} readOnly>
                      <option>{row.taxcategory || "-"}</option>
                    </select>
                  </td>
                  <td>{row.taxpercent || row.tax || 0}%</td>
                  <td>{row.pricenotax || row.rate || 0}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={row.kiosk === "1" || row.kiosk === 1}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={row.kot === "1" || row.kot === 1}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={
                        row.customercard === "1" || row.customercard === 1
                      }
                      readOnly
                    />
                  </td>
                  <td>{formatDate(row.lastupdateddate)}</td>
                  <td>{row.lastupdateduser || ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeProduct;
