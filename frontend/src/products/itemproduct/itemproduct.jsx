import React, { useState } from "react";
import "./itemproduct.css";
import { useNavigate } from "react-router-dom";

import searchIcon from "../../components/assets/search.png";
import filterIcon from "../../components/assets/filter.png";
import glass2Icon from "../../components/assets/glass2.png";
import itemIcon from "../../components/assets/item.png";

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
  inventory: true,
  barcode: "231356723145",
  unitMeasure: "Box",
  lastUpdatedDate: "2024-12-09 12:11",
  lastUpdatedUser: "Ahmed bin jaseel",
}));

const HeaderCell = ({ label }) => (
  <div className="item-product-header-container">
    <span className="item-product-header-text">{label}</span>
    <div className="item-product-sort-icons">
      <span className="item-product-arrow item-product-up1"></span>
      <span className="item-product-arrow item-product-down1"></span>
    </div>
  </div>
);

const CardProduct = () => {
  const [selectedLocation, setSelectedLocation] = useState("Wonderland 1");
  const [productFilter, setProductFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="item-product-table-wrapper">
      {/* ---------- Section Header ---------- */}
      <div className="item-product-section-header">
        <div className="item-product-section-title-container">
          <img
            src={itemIcon}
            alt="Item Icon"
            className="item-product-section-icon"
          />

          <h2 className="item-product-section-title">Item Product</h2>

          <div className="item-product-location-container">
            <label htmlFor="location" className="item-product-location-label">
              Location
            </label>
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="item-product-location-select"
            >
              <option value="Wonderland 1">Wonderland 1</option>
              <option value="Wonderland 2">Wonderland 2</option>
              <option value="Wonderland 3">Wonderland 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---------- Action Row ---------- */}
      <div className="item-product-header-actions">
        {/* Search box with icon inside */}
        <div className="item-product-search-container2">
          <img
            src={searchIcon}
            alt="Search"
            className="item-product-search-input2-icon"
          />
          <input
            type="text"
            placeholder="Search"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="item-product-search-input2"
          />
        </div>

        {/* Filter Button with Icon and Dropdown */}
        <div className="item-product-filter-container">
          <button
            className="item-product-filter-btn"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <img
              src={filterIcon}
              alt="Filter"
              className="item-product-filter-icon"
            />
          </button>
          {showFilterDropdown && (
            <div className="item-product-filter-dropdown">
              <div className="item-product-filter-option">Product</div>
              <div className="item-product-filter-option">Display Group</div>
              <div className="item-product-filter-option">POS Counter</div>
            </div>
          )}
        </div>

        {/* Blue Search Button with Icon */}
        <button className="item-product-btn-search">
          <img
            src={glass2Icon}
            alt="Search"
            className="item-product-search-btn-icon"
          />
          Search
        </button>

        {/* Right aligned Add + Refresh */}
        <div className="item-product-action-buttons">
          <button
            className="item-product-btn-add"
            onClick={() => navigate("/item-productform")}
          >
            Add
          </button>

          <button className="item-product-btn-refresh">Refresh</button>
        </div>
      </div>

      {/* Table */}
      <div className="item-product-table-scroll">
        <table className="item-product-custom-table">
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
                <HeaderCell label="Kiosk" />
              </th>
              <th>
                <HeaderCell label="KOT" />
              </th>
              <th>
                <HeaderCell label="Customer Card" />
              </th>
              <th>
                <HeaderCell label="Inventory" />
              </th>
              <th>
                <HeaderCell label="Barcode" />
              </th>
              <th>
                <HeaderCell label="Unit Measure" />
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
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.productId}</td>
                <td>{row.productName}</td>
                <td>
                  <input type="checkbox" checked={row.active} readOnly />
                </td>
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
                <td>
                  <input type="checkbox" checked={row.displayInPOS} readOnly />
                </td>
                <td>{row.faceValue}</td>
                <td>{row.sellingPrice}</td>
                <td>{row.cardQuantity}</td>
                <td>
                  {row.accessProfile === "attraction: content" ? (
                    <div className="item-product-text-box">
                      {row.accessProfile}
                    </div>
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
                <td>
                  <input type="date" value={row.cardExpiry} readOnly />
                </td>
                <td>{row.posCounter}</td>
                <td>
                  <select value={row.taxCategory} readOnly>
                    <option>{row.taxCategory}</option>
                  </select>
                </td>
                <td>{row.taxPercent}</td>
                <td>{row.priceNoTax}</td>
                <td>
                  <input type="checkbox" checked={row.kiosk} readOnly />
                </td>
                <td>
                  <input type="checkbox" checked={row.kot} readOnly />
                </td>
                <td>
                  <input type="checkbox" checked={row.CustomerCard} readOnly />
                </td>
                <td>
                  <input type="checkbox" checked={row.inventory} readOnly />
                </td>
                <td>
                  <div className="item-product-barcode-field">
                    {row.barcode}
                  </div>
                </td>
                <td>
                  <select value={row.unitMeasure} readOnly>
                    <option>{row.unitMeasure}</option>
                  </select>
                </td>
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