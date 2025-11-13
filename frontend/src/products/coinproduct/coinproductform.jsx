import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./coinproductform.css";
import AddGamesModal from "./coinproductadd";
import cardIcon from "../../components/assets/card-icon.png"; 
import cancelIcon from "../../components/assets/iconoir_cancel.png"; 
import calendarIcon from "../../components/assets/calander.png"; 

const CoinProduct = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAddGamesModal, setShowAddGamesModal] = useState(false);
  const navigate = useNavigate();
  
  if (!isOpen) {
    return (
      <div className="coin-form-demo-container">
        <button onClick={() => setIsOpen(true)} className="coin-form-open-modal-button">
          Open Card Product Modal
        </button>
      </div>
    );
  }
  
  return (
    <div className="coin-form-modal-overlay">
      <div className="coin-form-modal-container">
        {/* Header */}
        <div className="coin-form-modal-header">
          <div className="coin-form-header-title">
            <img src={cardIcon} alt="Card Icon" className="coin-form-folder-icon" />
            <h2 className="coin-form-title-text">Coin Product</h2>
          </div>
          <button onClick={() => navigate("/coin-product")} className="coin-form-close-button">
            <img src={cancelIcon} alt="Close" className="coin-form-close-icon" />
          </button>
        </div>
        
        {/* Content Area */}
        <div className="coin-form-modal-content">
          {/* Main Content */}
          <div className="coin-form-main-content">
            <div className="coin-form-content-wrapper">
              <div className="coin-form-main-sections">
                {/* Product Section */}
                <div className="coin-form-product-section">
                  <div className="coin-form-section-header">Product</div>
                  <div className="coin-form-product-content">
                    {/* Row 1 - Product Id, Product Name, Category */}
                    <div className="coin-form-form-row coin-form-cols-3">
                      <div className="coin-form-form-group">
                        <label className="coin-form-form-label">Product Id</label>
                        <input
                          type="text"
                          value="23456"
                          className="coin-form-form-input"
                          readOnly
                        />
                      </div>
                      <div className="coin-form-form-group">
                        <label className="coin-form-form-label">Product Name</label>
                        <input
                          type="text"
                          value="New card $100"
                          className="coin-form-form-input"
                        />
                      </div>
                      <div className="coin-form-form-group">
                        <label className="coin-form-form-label">Category</label>
                        <select className="coin-form-form-select">
                          <option>Card product</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Row 2 - Location, POS Counter, Display Group */}
                    <div className="coin-form-form-row coin-form-cols-3">
                      <div className="coin-form-form-group">
                        <label className="coin-form-form-label">Location</label>
                        <select className="coin-form-form-select">
                          <option>Default</option>
                        </select>
                      </div>
                      <div className="coin-form-form-group">
                        <label className="coin-form-form-label">POS Counter</label>
                        <select className="coin-form-form-select">
                          <option>Default</option>
                        </select>
                      </div>
                      <div className="coin-form-form-group">
                        <label className="coin-form-form-label">Display Group</label>
                        <select className="coin-form-form-select">
                          <option>New Card</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Row 3 - Display Order, Active, Display in POS, Kiosk, KOT, Customer Card */}
                    <div className="coin-form-form-row coin-form-cols-3">
                      <div className="coin-form-form-group">
                        <label className="coin-form-form-label">Display Order</label>
                        <input type="text" value="45" className="coin-form-form-input" />
                      </div>
                      <div className="coin-form-form-group">
                        <label className="coin-form-form-label">Active</label>
                        <input
                          type="checkbox"
                          className="coin-form-checkbox"
                          defaultChecked
                        />
                      </div>
                      <div className="coin-form-form-group">
                        <label className="coin-form-form-label">Display in POS</label>
                        <input
                          type="checkbox"
                          className="coin-form-checkbox"
                        />
                      </div>
                      <div className="coin-form-form-group">
                        <label className="coin-form-form-label">Kiosk</label>
                        <input
                          type="checkbox"
                          className="coin-form-checkbox"
                        />
                      </div>
                      <div className="coin-form-form-group">
                        <label className="coin-form-form-label">KOT</label>
                        <input
                          type="checkbox"
                          className="coin-form-checkbox"
                        />
                      </div>
                      <div className="coin-form-form-group">
                        <label className="coin-form-form-label">Customer Card</label>
                        <input
                          type="checkbox"
                          className="coin-form-checkbox"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Sections */}
                <div className="coin-form-bottom-sections">
                  {/* Price Section */}
                  <div className="coin-form-price-section">
                    <div className="coin-form-section-header coin-form-price-header">Price</div>
                    <div className="coin-form-section-content">
                      {/* Face Value and Selling Price */}
                      <div className="coin-form-form-row coin-form-cols-2">
                        <div className="coin-form-form-group">
                          <label className="coin-form-form-label">Price</label>
                          <input
                            type="text"
                            value="$90.00"
                            className="coin-form-form-input"
                          />
                        </div>
                        <div className="coin-form-form-group">
                          <label className="coin-form-form-label">Selling price</label>
                          <input
                            type="text"
                            value="$100.00"
                            className="coin-form-form-input"
                          />
                        </div>
                      </div>
                      
                      {/* Tax Inclusive */}
                      <div className="coin-form-checkbox-item-tax coin-form-tax-inclusive-row">
                        <label className="coin-form-checkbox-label-tax">Tax Inclusive ?</label>
                        <input type="checkbox" className="coin-form-checkbox-tax" />
                      </div>
                      
                      {/* Separator Line */}
                      <div className="coin-form-separator-line"></div>
                      
                      {/* Tax Category */}
                      <div className="coin-form-form-row coin-form-cols-2">
                        <div className="coin-form-form-group">
                          <label className="coin-form-form-label">Tax Category</label>
                          <select className="coin-form-form-select">
                            <option>TAX001</option>
                          </select>
                        </div>
                        <div className="coin-form-form-group">
                          <label className="coin-form-form-label">Tax %</label>
                          <input
                            type="text"
                            value="10.000000%"
                            className="coin-form-form-input"
                          />
                        </div>
                      </div>
                      
                      {/* Tax and Price No Tax */}
                      <div className="coin-form-form-row coin-form-cols-2">
                        <div className="coin-form-form-group">
                          <label className="coin-form-form-label">Tax</label>
                          <input
                            type="text"
                            value="10.00"
                            className="coin-form-form-input"
                          />
                        </div>
                        <div className="coin-form-form-group">
                          <label className="coin-form-form-label">Price No Tax</label>
                          <input
                            type="text"
                            value="90.00"
                            className="coin-form-form-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Entitlements Section */}
                  <div className="coin-form-entitlements-section">
                    <div className="coin-form-section-header coin-form-entitlements-header">Entitlements</div>
                    <div className="coin-form-section-content">
                      <div className="coin-form-entitlements-row">
                        {/* Left side column */}
                        <div className="coin-form-left-column">
                          <div className="coin-form-form-group">
                            <label className="coin-form-form-label">Coin Balance</label>
                            <input
                              type="text"
                              value="12"
                              className="coin-form-form-input coin-form-cash-balance-input"
                            />
                          </div>
                          
                          
                          {/* Membership + Active Profile */}
                          <div className="coin-form-bottom-entitlements-row">
                            <div className="coin-form-form-group coin-form-membership-group">
                              <label className="coin-form-form-label">Membership</label>
                              <select className="coin-form-form-select">
                                <option>Happy Monday</option>
                              </select>
                            </div>
                            <div className="coin-form-form-group coin-form-active-profile-group">
                              <label className="coin-form-form-label">Active Profile</label>
                              <select className="coin-form-form-select">
                                <option>Attraction</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right side column */}
                        <div className="coin-form-right-column">
                          {/* Card Expiry Date */}
                          <div className="coin-form-form-group coin-form-card-expiry-group">
                            <label className="coin-form-form-label">Card Expiry date</label>
                            <div className="coin-form-date-input-with-calendar">
                              <input
                                type="text"
                                value="23/04/2025"
                                className="coin-form-form-input coin-form-card-expiry-input"
                              />
                              <span className="coin-form-calendar-icon">
                                <img src={calendarIcon} alt="Calendar" className="coin-form-calendar-image" />
                              </span>
                            </div>
                          </div>
                          
                          {/* Card Valid */}
                          <div className="coin-form-form-group coin-form-card-valid-group">
                            <label className="coin-form-form-label">Card Valid (days)</label>
                            <div className="coin-form-card-valid-horizontal">
                              <input
                                type="text"
                                value="360"
                                className="coin-form-form-input coin-form-card-valid-input"
                              />
                              <button className="coin-form-clear-button">Clear Date</button>
                            </div>
                          </div>
                          
                          {/* Quantity + VIP */}
                          <div className="coin-form-quantity-vip-row">
                            <div className="coin-form-form-group coin-form-quantity-group">
                              <label className="coin-form-form-label">Quantity</label>
                              <input
                                type="text"
                                value="112"
                                className="coin-form-form-input coin-form-quantity-input"
                              />
                            </div>
                            
                          </div>
                          
                          {/* Add Games Button */}
                          <button
                            className="coin-form-add-games-button"
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
          <div className="coin-form-sidebar">
            <div className="coin-form-registration-section">
              <div className="coin-form-registration-header">Registration</div>
              <div className="coin-form-registration-body">
                {[
                  "Photo",
                  "First Name",
                  "Last Name",
                  "Phone",
                  "DOB",
                  "Sex",
                ].map((label, index) => (
                  <div key={index} className="coin-form-registration-checkbox-row">
                    <span className="coin-form-registration-label">{label}</span>
                    <input type="checkbox" className="coin-form-registration-checkbox" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="coin-form-active-days-section">
              <div className="coin-form-active-days-header">Active days for sale</div>
              <div className="coin-form-active-days-content">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day, index) => (
                  <div key={index} className="coin-form-day-row">
                    <span className="coin-form-day-name">{day}</span>
                    <input type="checkbox" className="coin-form-registration-checkbox" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Last Updated Section */}
        <div className="coin-form-last-updated-section">
          <div className="coin-form-last-updated-info">
            <span className="coin-form-last-updated-label">Last Updated Date</span>
            <span className="coin-form-last-updated-value">09-Nov-2024 12:11</span>
            <span className="coin-form-last-updated-label">Last Updated User</span>
            <span className="coin-form-last-updated-value">Ahmed jaseel</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="coin-form-modal-footer">
          <button className="coin-form-footer-button coin-form-save">Save</button>
          <button className="coin-form-footer-button coin-form-new">New</button>
          <button className="coin-form-footer-button coin-form-duplicate">Duplicate</button>
          <button className="coin-form-footer-button coin-form-cancel">Cancel</button>
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

export default CoinProduct;