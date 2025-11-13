import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./timeproductform.css";
import AddGamesModal from "./timeproductadd";
import cancelIcon from "../../components/assets/iconoir_cancel.png"; 
import calendarIcon from "../../components/assets/calander.png"; 
import cardIcon from "../../components/assets/91 2.png"; 


const TimeProduct = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAddGamesModal, setShowAddGamesModal] = useState(false);
  const navigate = useNavigate();
  
  if (!isOpen) {
    return (
      <div className="timeform-demo-container">
        <button onClick={() => setIsOpen(true)} className="timeform-open-modal-button">
          Open Time Product Modal
        </button>
      </div>
    );
  }
  
  return (
    <div className="timeform-modal-overlay">
      <div className="timeform-modal-container">
        {/* Header */}
        <div className="timeform-modal-header">
          <div className="timeform-header-title">
            <img src={cardIcon} alt="Card Icon" className="timeform-folder-icon" />
            <h2 className="timeform-title-text">Time Product</h2>
          </div>
          <button onClick={() => navigate("/time-product")} className="timeform-close-button">
            <img src={cancelIcon} alt="Close" className="timeform-close-icon" />
          </button>
        </div>
        
        {/* Content Area */}
        <div className="timeform-modal-content">
          {/* Main Content */}
          <div className="timeform-main-content">
            <div className="timeform-content-wrapper">
              <div className="timeform-main-sections">
                {/* Product Section */}
                <div className="timeform-product-section">
                  <div className="timeform-section-header">Product</div>
                  <div className="timeform-product-content">
                    {/* Row 1 - Product Id, Product Name, Category */}
                    <div className="timeform-form-row timeform-cols-3">
                      <div className="timeform-form-group">
                        <label className="timeform-form-label">Product Id</label>
                        <input
                          type="text"
                          value="23456"
                          className="timeform-form-input"
                          readOnly
                        />
                      </div>
                      <div className="timeform-form-group">
                        <label className="timeform-form-label">Product Name</label>
                        <input
                          type="text"
                          value="New card $100"
                          className="timeform-form-input"
                        />
                      </div>
                      <div className="timeform-form-group">
                        <label className="timeform-form-label">Category</label>
                        <select className="timeform-form-select">
                          <option>Card product</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Row 2 - Location, POS Counter, Display Group */}
                    <div className="timeform-form-row timeform-cols-3">
                      <div className="timeform-form-group">
                        <label className="timeform-form-label">Location</label>
                        <select className="timeform-form-select">
                          <option>Default</option>
                        </select>
                      </div>
                      <div className="timeform-form-group">
                        <label className="timeform-form-label">POS Counter</label>
                        <select className="timeform-form-select">
                          <option>Default</option>
                        </select>
                      </div>
                      <div className="timeform-form-group">
                        <label className="timeform-form-label">Display Group</label>
                        <select className="timeform-form-select">
                          <option>New Card</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Row 3 - Display Order, Active, Display in POS, Kiosk, KOT, Customer Card */}
                    <div className="timeform-form-row timeform-cols-3">
                      <div className="timeform-form-group">
                        <label className="timeform-form-label">Display Order</label>
                        <input type="text" value="45" className="timeform-form-input" />
                      </div>
                      <div className="timeform-form-group">
                        <label className="timeform-form-label">Active</label>
                        <input
                          type="checkbox"
                          className="timeform-checkbox"
                          defaultChecked
                        />
                      </div>
                      <div className="timeform-form-group">
                        <label className="timeform-form-label">Display in POS</label>
                        <input
                          type="checkbox"
                          className="timeform-checkbox"
                        />
                      </div>
                      <div className="timeform-form-group">
                        <label className="timeform-form-label">Kiosk</label>
                        <input
                          type="checkbox"
                          className="timeform-checkbox"
                        />
                      </div>
                      <div className="timeform-form-group">
                        <label className="timeform-form-label">KOT</label>
                        <input
                          type="checkbox"
                          className="timeform-checkbox"
                        />
                      </div>
                      <div className="timeform-form-group">
                        <label className="timeform-form-label">Customer Card</label>
                        <input
                          type="checkbox"
                          className="timeform-checkbox"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Sections */}
                <div className="timeform-bottom-sections">
                  {/* Price Section */}
                  <div className="timeform-price-section">
                    <div className="timeform-section-header timeform-price-header">Price</div>
                    <div className="timeform-section-content">
                      {/* Face Value and Selling Price */}
                      <div className="timeform-form-row timeform-cols-2">
                        <div className="timeform-form-group">
                          <label className="timeform-form-label">Price </label>
                          <input
                            type="text"
                            value="$90.00"
                            className="timeform-form-input"
                          />
                        </div>
                        <div className="timeform-form-group">
                          <label className="timeform-form-label">Selling price</label>
                          <input
                            type="text"
                            value="$100.00"
                            className="timeform-form-input"
                          />
                        </div>
                      </div>
                      
                      {/* Tax Inclusive */}
                      <div className="timeform-checkbox-item-tax timeform-tax-inclusive-row">
                        <label className="timeform-checkbox-label-tax">Tax Inclusive ?</label>
                        <input type="checkbox" className="timeform-checkbox-tax" />
                      </div>
                      
                      {/* Separator Line */}
                      <div className="timeform-separator-line"></div>
                      
                      {/* Tax Category */}
                      <div className="timeform-form-row timeform-cols-2">
                        <div className="timeform-form-group">
                          <label className="timeform-form-label">Tax Category</label>
                          <select className="timeform-form-select">
                            <option>TAX001</option>
                          </select>
                        </div>
                        <div className="timeform-form-group">
                          <label className="timeform-form-label">Tax%</label>
                          <input
                            type="text"
                            value="10.000000%"
                            className="timeform-form-input"
                          />
                        </div>
                      </div>
                      
                      {/* Tax and Price No Tax */}
                      <div className="timeform-form-row timeform-cols-2">
                        <div className="timeform-form-group">
                          <label className="timeform-form-label">Tax</label>
                          <input
                            type="text"
                            value="10.00"
                            className="timeform-form-input"
                          />
                        </div>
                        <div className="timeform-form-group">
                          <label className="timeform-form-label">Price No Tax</label>
                          <input
                            type="text"
                            value="90.00"
                            className="timeform-form-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Entitlements Section */}
                  <div className="timeform-entitlements-section">
                    <div className="timeform-section-header timeform-entitlements-header">Entitlements</div>
                    <div className="timeform-section-content">
                      <div className="timeform-entitlements-row">
                        {/* Left side column */}
                        <div className="timeform-left-column">
                          <div className="timeform-form-group">
                            <label className="timeform-form-label">Time Balance</label>
                            <input
                              type="text"
                              value="12"
                              className="timeform-form-input timeform-cash-balance-input"
                            />
                          </div>
                          
                          
                          {/* Membership + Active Profile */}
                          <div className="timeform-bottom-entitlements-row">
                            <div className="timeform-form-group timeform-membership-group">
                              <label className="timeform-form-label">Membership</label>
                              <select className="timeform-form-select">
                                <option>Happy Monday</option>
                              </select>
                            </div>
                            <div className="timeform-form-group timeform-active-profile-group">
                              <label className="timeform-form-label">Active Profile</label>
                              <select className="timeform-form-select">
                                <option>Attraction</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right side column */}
                        <div className="timeform-right-column">
                          {/* Card Expiry Date */}
                          <div className="timeform-form-group timeform-card-expiry-group">
                            <label className="timeform-form-label">Card Expiry date</label>
                            <div className="timeform-date-input-with-calendar">
                              <input
                                type="text"
                                value="23/04/2025"
                                className="timeform-form-input timeform-card-expiry-input"
                              />
                              <span className="timeform-calendar-icon">
                                <img src={calendarIcon} alt="Calendar" className="timeform-calendar-image" />
                              </span>
                            </div>
                          </div>
                          
                          {/* Card Valid */}
                          <div className="timeform-form-group timeform-card-valid-group">
                            <label className="timeform-form-label">Card Valid (days)</label>
                            <div className="timeform-card-valid-horizontal">
                              <input
                                type="text"
                                value="360"
                                className="timeform-form-input timeform-card-valid-input"
                              />
                              <button className="timeform-clear-button">Clear Date</button>
                            </div>
                          </div>
                          
                          {/* Quantity + VIP */}
                          <div className="timeform-quantity-vip-row">
                            <div className="timeform-form-group timeform-quantity-group">
                              <label className="timeform-form-label">Quantity</label>
                              <input
                                type="text"
                                value="112"
                                className="timeform-form-input timeform-quantity-input"
                              />
                            </div>
                           
                          </div>
                          
                          {/* Add Games Button */}
                          <button
                            className="timeform-add-games-button"
                            onClick={() => setShowAddGamesModal(true)}
                          >
                            Add Games
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="timeform-sidebar">
            <div className="timeform-registration-section">
              <div className="timeform-registration-header">Registration</div>
              <div className="timeform-registration-body">
                {[
                  "Photo",
                  "First Name",
                  "Last Name",
                  "Phone",
                  "DOB",
                  "Sex",
                ].map((label, index) => (
                  <div key={index} className="timeform-registration-checkbox-row">
                    <span className="timeform-registration-label">{label}</span>
                    <input type="checkbox" className="timeform-registration-checkbox" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="timeform-active-days-section">
              <div className="timeform-active-days-header">Active days for sale</div>
              <div className="timeform-active-days-content">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day, index) => (
                  <div key={index} className="timeform-day-row">
                    <span className="timeform-day-name">{day}</span>
                    <input type="checkbox" className="timeform-registration-checkbox" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Last Updated Section */}
        <div className="timeform-last-updated-section">
          <div className="timeform-last-updated-info">
            <span className="timeform-last-updated-label">Last Updated Date</span>
            <span className="timeform-last-updated-value">09-Nov-2024 12:11</span>
            <span className="timeform-last-updated-label">Last Updated User</span>
            <span className="timeform-last-updated-value">Ahmed jaseel</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="timeform-modal-footer">
          <button className="timeform-footer-button timeform-save">Save</button>
          <button className="timeform-footer-button timeform-new">New</button>
          <button className="timeform-footer-button timeform-duplicate">Duplicate</button>
          <button className="timeform-footer-button timeform-cancel">Cancel</button>
        </div>
      </div>
      
      {showAddGamesModal && (
        <AddGamesModal
          isOpen={showAddGamesModal}
          onClose={() => setShowAddGamesModal(false)}
        />
      )}
    </div>
  );
};

export default TimeProduct;