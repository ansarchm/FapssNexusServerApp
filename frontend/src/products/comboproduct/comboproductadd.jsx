import React, { useState } from "react";
import "./comboproductadd.css";
import { useNavigate } from "react-router-dom";

import cancelIcon from '../../components/assets/iconoir_cancel.png'; 
import plusIcon from "../../components/assets/plus_icon.png";
import deleteIcon from "../../components/assets/delete_icon.png";
import checklistIcon from "../../components/assets/Checklist.png";
import plusBoxIcon from "../../components/assets/plus_box_icon.png";
import comboIcon from "../../components/assets/combo.png";   // ✅ new import

const ComboProductAdd = () => {
  
  const navigate = useNavigate();

   const handleClose = () => {
  
    navigate("/combo-product"); // 👈 route to your ComboProduct.jsx page
  };

  // Sample entitlements data based on the Figma design
  const [entitlements, setEntitlements] = useState([
    { id: "121", childProduct: "Boiled Egg", kot:false, quantity: 1 },
    { id: "134", childProduct: "Card $ 100", kot: false, quantity: 2 },
    { id: "141", childProduct: "Boiled Egg", kot: false, quantity: 3 },
    { id: "150", childProduct: "Card $ 100", kot: false, quantity: 4 },
    { id: "174", childProduct: "Card $ 100", kot: false, quantity: 5 },
  ]);

  const handleEntitlementChange = (index, field, value) => {
    const updatedEntitlements = [...entitlements];
    updatedEntitlements[index][field] = value;
    setEntitlements(updatedEntitlements);
  };

  const handleKOTToggle = (index) => {
    const updatedEntitlements = [...entitlements];
    updatedEntitlements[index].kot = !updatedEntitlements[index].kot;
    setEntitlements(updatedEntitlements);
  };

  const handleAddRow = () => {
    const newEntitlements = [...entitlements];
    newEntitlements.push({
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      childProduct: "Boiled Egg",
      kot: false,
      quantity: 1,
    });
    setEntitlements(newEntitlements);
  };

  const handleDeleteRow = (index) => {
    const newEntitlements = [...entitlements];
    newEntitlements.splice(index, 1);
    setEntitlements(newEntitlements);
  };

 

  return (
    <div className="combo-add-modal-overlay-combo">
      <div className="combo-add-modal-container-combo">
        {/* Header */}
        <div className="combo-add-modal-header-combo">
          <div className="combo-add-header-title-combo">
            <img src={comboIcon} alt="Combo Icon" className="combo-add-folder-icon-combo" />

            <h2 className="combo-add-title-text-combo">Combo Product</h2>
          </div>
          <button onClick={() => navigate("/combo-product")} className="item-close-button">
            <img src={cancelIcon} alt="Close" className="item-close" />
          </button>
        </div>

        {/* Content Area */}
        <div className="combo-add-modal-content-combo">
          <div className="combo-add-content-wrapper-combo">
            <div className="combo-add-main-sections-combo">
              {/* First Row: Product and Active Days */}
              <div className="combo-add-first-row-combo">
                {/* Product Section */}
                <div className="combo-add-product-section-combo">
                  <div className="combo-add-section-header-combo">Product</div>
                  <div className="combo-add-product-content-combo">
                    {/* Row 1 */}
                    <div className="combo-add-form-row-combo">
                      <div className="combo-add-form-group-combo">
                        <label className="combo-add-form-label-combo">Product Id</label>
                        <input
                          type="text"
                          value="23456"
                          className="combo-add-form-input-combo combo-add-product-id-input"
                          readOnly
                        />
                      </div>
                      <div className="combo-add-form-group-combo">
                        <label className="combo-add-form-label-combo">Product Name</label>
                        <input
                          type="text"
                          value="New Card $100"
                          className="combo-add-form-input-combo combo-add-product-name-input"
                        />
                      </div>
                      <div className="combo-add-form-group-combo">
                        <label className="combo-add-form-label-combo">POS Counter</label>
                        <select className="combo-add-form-select-combo combo-add-pos-counter-select">
                          <option>Default</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="combo-add-form-row-combo">
                      <div className="combo-add-form-group-combo">
                        <label className="combo-add-form-label-combo">Department</label>
                        <select className="combo-add-form-select-combo combo-add-category-select">
                          <option>Card product</option>
                        </select>
                      </div>
                      <div className="combo-add-form-group-combo">
                        <label className="combo-add-form-label-combo">Display Group</label>
                        <select className="combo-add-form-select-combo combo-add-display-group-select">
                          <option>New Card</option>
                        </select>
                      </div>
                      <div className="combo-add-form-group-combo">
                        <label className="combo-add-form-label-combo">Display Order</label>
                        <input 
                          type="text" 
                          value="34" 
                          className="combo-add-form-input-combo combo-add-display-order-input" 
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="combo-add-checkbox-section-combo">
                      <div className="combo-add-checkbox-grid-combo">
                        {["Active", "Display in POS", "KOT", "Customer Card"].map(
                          (label, i) => (
                            <div key={i} className="combo-add-checkbox-item-combo">
                              <input
                                type="checkbox"
                                className="combo-add-checkbox-combo"
                                
                              />
                              <span className="combo-add-checkbox-label-combo">{label}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Days Section */}
                <div className="combo-add-active-days-section-combo">
                  <div className="combo-add-active-days-header-combo">Active days for sale</div>
                  <div className="combo-add-active-days-content-combo">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                      (day, index) => (
                        <div key={index} className="combo-add-day-row-combo">
                          <span className="combo-add-day-name-combo">{day}</span>
                          <input 
                            type="checkbox" 
                            className="combo-add-day-checkbox-combo" 
                            
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Second Row: Price and Entitlements */}
              <div className="combo-add-second-row-combo">
                {/* Price Section */}
                <div className="combo-add-price-section-combo">
                  <div className="combo-add-section-header-combo combo-add-price-header-combo">
                    Price
                  </div>
                  <div className="combo-add-section-content-combo">
                    {/* Face Value and Selling Price */}
                    <div className="combo-add-form-row-combo">
                      <div className="combo-add-form-group-combo">
                        <label className="combo-add-form-label-combo">Face Value</label>
                        <input 
                          type="text" 
                          value="$90.00" 
                          className="combo-add-form-input-combo combo-add-face-value-input" 
                        />
                      </div>
                      <div className="combo-add-form-group-combo">
                        <label className="combo-add-form-label-combo">Selling price</label>
                        <input 
                          type="text" 
                          value="$100.00" 
                          className="combo-add-form-input-combo combo-add-selling-price-input" 
                        />
                      </div>
                    </div>

                    {/* Tax Inclusive */}
                    <div className="combo-add-checkbox-item-combo combo-add-tax-inclusive-row-combo">
                      <label className="combo-add-checkbox-label-tax-combo">Tax Inclusive ?</label>
                      <input type="checkbox" className="combo-add-checkbox-tax-combo" />
                    </div>
                    {/* Separator Line */}
                      <div className="combo-add-separator-line"></div>

                    {/* Tax Category and Tax % */}
                    <div className="combo-add-form-row-combo">
                      <div className="combo-add-form-group-combo">
                        <label className="combo-add-form-label-combo">Tax Category</label>
                        <select className="combo-add-form-select-combo combo-add-tax-category-select">
                          <option>TAX001</option>
                        </select>
                      </div>
                      <div className="combo-add-form-group-combo">
                        <label className="combo-add-form-label-combo">Tax %</label>
                        <input
                          type="text"
                          value="10.000000%"
                          className="combo-add-form-input-combo combo-add-tax-percent-input"
                        />
                      </div>
                    </div>

                    {/* Tax and Price No Tax */}
                    <div className="combo-add-form-row-combo">
                      <div className="combo-add-form-group-combo">
                        <label className="combo-add-form-label-combo">Tax</label>
                        <input 
                          type="text" 
                          value="10.00" 
                          className="combo-add-form-input-combo combo-add-tax-input" 
                        />
                      </div>
                      <div className="combo-add-form-group-combo">
                        <label className="combo-add-form-label-combo">Price No Tax</label>
                        <input 
                          type="text" 
                          value="90.00" 
                          className="combo-add-form-input-combo combo-add-price-no-tax-input" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Updated Entitlements Section - Figma Measurements */}
                <div className="combo-add-entitlements-section-combo">
                  <div className="combo-add-section-header-combo combo-add-entitlements-header-combo">
                    Entitlements
                  </div>
                  <div className="combo-add-entitlements-content-wrapper-combo">
                    {/* Updated Table - Figma Measurements */}
                    <div className="combo-add-entitlements-table-container-combo">
                      <table className="combo-add-entitlements-table-combo">
                        <thead>
                          <tr>
                            <th className="combo-add-th-id-combo">ID</th>
                            <th className="combo-add-th-child-product-combo">Child Product</th>
                            <th className="combo-add-th-kot-combo">KOT</th>
                            <th className="combo-add-th-quantity-combo">Quantity</th>
                       <th>
  <button
    className="combo-add-plus-box-button-combo"
    onClick={handleAddRow}
  >
    <img
      src={plusBoxIcon}
      alt="Box"
      className="combo-add-plus-box-icon-combo"
    />
    <img
      src={plusIcon}
      alt="Plus"
      className="combo-add-plus-icon-combo"
    />
  </button>
</th>


                        </tr>
                      </thead>
                      <tbody>
                          {entitlements.map((item, index) => (
                            <tr key={index}>
                              <td>{item.id}</td>
                              <td>
                                <select
                                  value={item.childProduct}
                                  onChange={(e) =>
                                    handleEntitlementChange(index, "childProduct", e.target.value)
                                  }
                                  className="combo-add-child-product-select-combo"
                                  
                                
                                >
                                  <option value="Boiled Egg">Boiled Egg</option>
                                  <option value="Card $ 100">Card $ 100</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={item.kot}
                                  onChange={() => handleKOTToggle(index)}
                                  className="combo-add-kot-checkbox-combo"
                                   style={{
                                  backgroundImage: `url(${checklistIcon})`,
                                }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleEntitlementChange(index, "quantity", e.target.value)
                                  }
                                  className="combo-add-quantity-input-combo"
                                />
                              </td>
                              <td>
                                <img
                                src={deleteIcon}
                                alt="Delete"
                                className="combo-add-delete-icon-combo"
                                onClick={() => handleDeleteRow(index)}
                              />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Updated Product Image Section - Figma Measurements */}
                    <div className="combo-add-entitlements-image-section-combo">
                      <div className="combo-add-product-header-combo">Product Image</div>
                      <div className="combo-add-product-image-placeholder-combo"></div>
                      <button className="combo-add-reset-button-combo">Reset</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Updated Section */}
              <div className="combo-add-last-updated-section-combo">
                <div className="combo-add-last-updated-info-combo">
                  <span className="combo-add-last-updated-label-combo">Last Updated Date</span>
                  <span className="combo-add-last-updated-value-combo">09-Nov-2024 12:11</span>
                  <span className="combo-add-last-updated-label-combo">Last Updated User</span>
                  <span className="combo-add-last-updated-value-combo">Ahmed jaseel</span>
                </div>
              </div>

              {/* Footer */}
              <div className="combo-add-modal-footer-combo">
                                <button className="combo-add-footer-button-combo combo-add-edit-combo">Edit</button>

                <button className="combo-add-footer-button-combo combo-add-save-combo">Save</button>
                <button className="combo-add-footer-button-combo combo-add-new-combo">New</button>
                <button className="combo-add-footer-button-combo combo-add-duplicate-combo">Duplicate</button>
                <button className="combo-add-footer-button-combo combo-add-cancel-combo">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboProductAdd;