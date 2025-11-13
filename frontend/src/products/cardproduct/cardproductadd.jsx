import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cardproductform.css";
import AddGamesModal from "./cardproductadd";
import cardIcon from "../../components/assets/card-icon.png"; 
import cancelIcon from "../../components/assets/iconoir_cancel.png"; 
import calendarIcon from "../../components/assets/calander.png"; 

const CardProduct = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAddGamesModal, setShowAddGamesModal] = useState(false);
  const navigate = useNavigate();
  
  if (!isOpen) {
    return (
      <div className="cardform-demo-container">
        <button onClick={() => setIsOpen(true)} className="cardform-open-modal-button">
          Open Card Product Modal
        </button>
      </div>
    );
  }
  
  return (
    <div className="cardform-modal-overlay">
      <div className="cardform-modal-container">
        {/* Header */}
        <div className="cardform-modal-header">
          <div className="cardform-header-title">
            <img src={cardIcon} alt="Card Icon" className="cardform-folder-icon" />
            <h2 className="cardform-title-text">Card Product</h2>
          </div>
          <button onClick={() => navigate("/card-product")} className="cardform-close-button">
            <img src={cancelIcon} alt="Close" className="cardform-close-icon" />
          </button>
        </div>
        
        {/* Content Area */}
        <div className="cardform-modal-content">
          {/* Main Content */}
          <div className="cardform-main-content">
            <div className="cardform-content-wrapper">
              <div className="cardform-main-sections">
                {/* Product Section */}
                <div className="cardform-product-section">
                  <div className="cardform-section-header">Product</div>
                  <div className="cardform-product-content">
                    {/* Row 1 - Product Id, Product Name, Category */}
                    <div className="cardform-form-row cardform-cols-3">
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Product Id</label>
                        <input
                          type="text"
                          value="23456"
                          className="cardform-form-input"
                          readOnly
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Product Name</label>
                        <input
                          type="text"
                          value="New card $100"
                          className="cardform-form-input"
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Department</label>
                        <select className="cardform-form-select">
                          <option>Card product</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Row 2 - Location, POS Counter, Display Group */}
                    <div className="cardform-form-row cardform-cols-3">
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Location</label>
                        <select className="cardform-form-select">
                          <option>Default</option>
                        </select>
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">POS Counter</label>
                        <select className="cardform-form-select">
                          <option>Default</option>
                        </select>
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Display Group</label>
                        <select className="cardform-form-select">
                          <option>New Card</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Row 3 - Display Order, Active, Display in POS, Kiosk, KOT, Customer Card */}
                    <div className="cardform-form-row cardform-cols-3">
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Display Order</label>
                        <input type="text" value="45" className="cardform-form-input" />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Active</label>
                        <input
                          type="checkbox"
                          className="cardform-checkbox"
                          defaultChecked
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Display in POS</label>
                        <input
                          type="checkbox"
                          className="cardform-checkbox"
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Kiosk</label>
                        <input
                          type="checkbox"
                          className="cardform-checkbox"
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">KOT</label>
                        <input
                          type="checkbox"
                          className="cardform-checkbox"
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Customer Card</label>
                        <input
                          type="checkbox"
                          className="cardform-checkbox"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Sections */}
                <div className="cardform-bottom-sections">
                  {/* Price Section */}
                  <div className="cardform-price-section">
                    <div className="cardform-section-header cardform-price-header">Price</div>
                    <div className="cardform-section-content">
                      {/* Face Value and Selling Price */}
                      <div className="cardform-form-row cardform-cols-2">
                        <div className="cardform-form-group">
                          <label className="cardform-form-label">Face Value</label>
                          <input
                            type="text"
                            value="$90.00"
                            className="cardform-form-input"
                          />
                        </div>
                        <div className="cardform-form-group">
                          <label className="cardform-form-label">Selling price</label>
                          <input
                            type="text"
                            value="$100.00"
                            className="cardform-form-input"
                          />
                        </div>
                      </div>
                      
                      {/* Tax Inclusive */}
                      <div className="cardform-checkbox-item-tax cardform-tax-inclusive-row">
                        <label className="cardform-checkbox-label-tax">Tax Inclusive ?</label>
                        <input type="checkbox" className="cardform-checkbox-tax" />
                      </div>
                      
                      {/* Separator Line */}
                      <div className="cardform-separator-line"></div>
                      
                      {/* Tax Category */}
                      <div className="cardform-form-row cardform-cols-2">
                        <div className="cardform-form-group">
                          <label className="cardform-form-label">Tax Category</label>
                          <select className="cardform-form-select">
                            <option>TAX001</option>
                          </select>
                        </div>
                        <div className="cardform-form-group">
                          <label className="cardform-form-label">Tax 1 %</label>
                          <input
                            type="text"
                            value="10.000000%"
                            className="cardform-form-input"
                          />
                        </div>
                      </div>
                      
                      {/* Tax and Price No Tax */}
                      <div className="cardform-form-row cardform-cols-2">
                        <div className="cardform-form-group">
                          <label className="cardform-form-label">Tax</label>
                          <input
                            type="text"
                            value="10.00"
                            className="cardform-form-input"
                          />
                        </div>
                        <div className="cardform-form-group">
                          <label className="cardform-form-label">Price No Tax</label>
                          <input
                            type="text"
                            value="90.00"
                            className="cardform-form-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Entitlements Section */}
                  <div className="cardform-entitlements-section">
                    <div className="cardform-section-header cardform-entitlements-header">Entitlements</div>
                    <div className="cardform-section-content">
                      <div className="cardform-entitlements-row">
                        {/* Left side column */}
                        <div className="cardform-left-column">
                          <div className="cardform-form-group">
                            <label className="cardform-form-label">Cash Balance</label>
                            <input
                              type="text"
                              value="$100.00"
                              className="cardform-form-input cardform-cash-balance-input"
                            />
                          </div>
                          <div className="cardform-form-group">
                            <label className="cardform-form-label">Bonus Balance</label>
                            <input
                              type="text"
                              value="$20.00"
                              className="cardform-form-input cardform-bonus-balance-input"
                            />
                          </div>
                          
                          {/* Membership + Active Profile */}
                          <div className="cardform-bottom-entitlements-row">
                            <div className="cardform-form-group cardform-membership-group">
                              <label className="cardform-form-label">Membership</label>
                              <select className="cardform-form-select">
                                <option>Happy Monday</option>
                              </select>
                            </div>
                            <div className="cardform-form-group cardform-active-profile-group">
                              <label className="cardform-form-label">Access Profile</label>
                              <select className="cardform-form-select">
                                <option>Attraction</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right side column */}
                        <div className="cardform-right-column">
                          {/* Card Expiry Date */}
                          <div className="cardform-form-group cardform-card-expiry-group">
                            <label className="cardform-form-label">Card Expiry date</label>
                            <div className="cardform-date-input-with-calendar">
                              <input
                                type="text"
                                value="23/04/2025"
                                className="cardform-form-input cardform-card-expiry-input"
                              />
                              <span className="cardform-calendar-icon">
                                <img src={calendarIcon} alt="Calendar" className="cardform-calendar-image" />
                              </span>
                            </div>
                          </div>
                          
                          {/* Card Valid */}
                          <div className="cardform-form-group cardform-card-valid-group">
                            <label className="cardform-form-label">Card Valid (days)</label>
                            <div className="cardform-card-valid-horizontal">
                              <input
                                type="text"
                                value="360"
                                className="cardform-form-input cardform-card-valid-input"
                              />
                              <button className="cardform-clear-button">Clear Date</button>
                            </div>
                          </div>
                          
                          {/* Quantity + VIP */}
                          <div className="cardform-quantity-vip-row">
                            <div className="cardform-form-group cardform-quantity-group">
                              <label className="cardform-form-label">Quantity</label>
                              <input
                                type="text"
                                value="112"
                                className="cardform-form-input cardform-quantity-input"
                              />
                            </div>
                            <div className="cardform-vip-card-group">
                              <label htmlFor="vipCard" className="cardform-vip-card-label">
                                VIP Card
                              </label>
                              <input
                                type="checkbox"
                                className="cardform-checkbox cardform-vip-checkbox"
                                id="vipCard"
                              />
                            </div>
                          </div>
                          
                          {/* Add Games Button */}
                          <button
                            className="cardform-add-games-button"
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
          <div className="cardform-sidebar">
            <div className="cardform-registration-section">
              <div className="cardform-registration-header">Registration</div>
              <div className="cardform-registration-body">
                {[
                  "Photo",
                  "First Name",
                  "Last Name",
                  "Phone",
                  "DOB",
                  "Sex",
                ].map((label, index) => (
                  <div key={index} className="cardform-registration-checkbox-row">
                    <span className="cardform-registration-label">{label}</span>
                    <input type="checkbox" className="cardform-registration-checkbox" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="cardform-active-days-section">
              <div className="cardform-active-days-header">Active days for sale</div>
              <div className="cardform-active-days-content">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day, index) => (
                  <div key={index} className="cardform-day-row">
                    <span className="cardform-day-name">{day}</span>
                    <input type="checkbox" className="cardform-registration-checkbox" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Last Updated Section */}
        <div className="cardform-last-updated-section">
          <div className="cardform-last-updated-info">
            <span className="cardform-last-updated-label">Last Updated Date</span>
            <span className="cardform-last-updated-value">09-Nov-2024 12:11</span>
            <span className="cardform-last-updated-label">Last Updated User</span>
            <span className="cardform-last-updated-value">Ahmed jaseel</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="cardform-modal-footer">
          <button className="cardform-footer-button cardform-save">Save</button>
          <button className="cardform-footer-button cardform-new">New</button>
          <button className="cardform-footer-button cardform-duplicate">Duplicate</button>
          <button className="cardform-footer-button cardform-cancel">Cancel</button>
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

export default CardProduct;