import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./stickerproductadd.css";
import stickerIcon from "../../components/assets/sticker.png"; // Make sure you have a sticker icon
import cancelIcon from "../../components/assets/iconoir_cancel.png"; 

const StickerProductAdd = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  
  if (!isOpen) {
    return (
      <div className="sticker-add-demo-container-sticker">
        <button onClick={() => setIsOpen(true)} className="sticker-add-open-modal-button-sticker">
          Open Sticker Product Modal
        </button>
      </div>
    );
  }
  
  return (
    <div className="sticker-add-modal-overlay-sticker">
      <div className="sticker-add-modal-container-sticker">
        {/* Header */}
        <div className="sticker-add-modal-header-sticker">
          <div className="sticker-add-header-title-sticker">
            <img src={stickerIcon} alt="Sticker Icon" className="sticker-add-folder-icon-sticker" />
            <h2 className="sticker-add-title-text-sticker">Sticker Product</h2>
          </div>
          <button onClick={() => navigate("/sticker-product")} className="sticker-add-close-button-sticker">
            <img src={cancelIcon} alt="Close" className="sticker-add-close-icon-sticker" />
          </button>
        </div>
        
        {/* Content Area */}
        <div className="sticker-add-modal-content-sticker">
          {/* Main Content */}
          <div className="sticker-add-main-content-sticker">
            <div className="sticker-add-content-wrapper-sticker">
              <div className="sticker-add-main-sections-sticker">
                {/* Product Section */}
                <div className="sticker-add-product-section-sticker">
                  <div className="sticker-add-section-header-sticker">Product</div>
                  <div className="sticker-add-product-content-sticker">
                    {/* Row 1 */}
                    <div className="sticker-add-form-row-sticker sticker-add-cols-3-sticker">
                      <div className="sticker-add-form-group-sticker">
                        <label className="sticker-add-form-label-sticker">Product Id</label>
                        <input
                          type="text"
                          value="23456"
                          className="sticker-add-form-input-sticker"
                          readOnly
                        />
                      </div>
                      <div className="sticker-add-form-group-sticker">
                        <label className="sticker-add-form-label-sticker">Product Name</label>
                        <input
                          type="text"
                          value="New card $100"
                          className="sticker-add-form-input-sticker"
                        />
                      </div>
                      <div className="sticker-add-form-group-sticker">
                        <label className="sticker-add-form-label-sticker">POS Counter</label>
                        <select className="sticker-add-form-select-sticker">
                          <option>Default</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Row 2 */}
                    <div className="sticker-add-form-row-sticker sticker-add-cols-3-sticker">
                      <div className="sticker-add-form-group-sticker">
                        <label className="sticker-add-form-label-sticker">Department</label>
                        <select className="sticker-add-form-select-sticker">
                          <option>Card product</option>
                        </select>
                      </div>
                      <div className="sticker-add-form-group-sticker">
                        <label className="sticker-add-form-label-sticker">Display Group</label>
                        <select className="sticker-add-form-select-sticker">
                          <option>New Card</option>
                        </select>
                      </div>
                      <div className="sticker-add-form-group-sticker">
                        <label className="sticker-add-form-label-sticker">Display Order</label>
                        <input type="text" value="45" className="sticker-add-form-input-sticker" />
                      </div>
                    </div>
                    
                    {/* Checkboxes */}
                    <div className="sticker-add-checkbox-section-sticker">
                      <div className="sticker-add-checkbox-grid-sticker">
                        {[
                          
                          "Active",
                          "Display in POS",
                          "Customer Card",
                        ].map((label, i) => (
                          <div key={i} className="sticker-add-checkbox-item-sticker">
                            <input
                              type="checkbox"
                              className="sticker-add-checkbox-sticker"
                              defaultChecked={label === "Active"}
                              readOnly={label === "Active"}
                            />
                            <span className="sticker-add-checkbox-label-sticker">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Sections */}
                <div className="sticker-add-bottom-sections-sticker">
                  {/* Price Section */}
                  <div className="sticker-add-price-section-sticker">
                    <div className="sticker-add-section-header-sticker sticker-add-price-header-sticker">Price</div>
                    <div className="sticker-add-section-content-sticker">
                      {/* Face Value and Selling Price */}
                      <div className="sticker-add-form-row-sticker sticker-add-cols-2-sticker">
                        <div className="sticker-add-form-group-sticker">
                          <label className="sticker-add-form-label-sticker">Price</label>
                          <input
                            type="text"
                            value="$90.00"
                            className="sticker-add-form-input-sticker"
                          />
                        </div>
                        <div className="sticker-add-form-group-sticker">
                          <label className="sticker-add-form-label-sticker">Selling price</label>
                          <input
                            type="text"
                            value="$100.00"
                            className="sticker-add-form-input-sticker"
                          />
                        </div>
                      </div>
                      
                      {/* Tax Inclusive */}
                      <div className="sticker-add-checkbox-item-sticker sticker-add-tax-inclusive-row-sticker">
                        <label className="sticker-add-checkbox-label-tax-sticker">Tax Inclusive ?</label>
                        <input type="checkbox" className="sticker-add-checkbox-tax-sticker" />
                      </div>
                      
                      {/* Separator Line */}
                      <div className="sticker-add-separator-line-sticker"></div>
                      
                      {/* Tax Category */}
                      <div className="sticker-add-form-row-sticker sticker-add-cols-2-sticker">
                        <div className="sticker-add-form-group-sticker">
                          <label className="sticker-add-form-label-sticker">Tax Category</label>
                          <select className="sticker-add-form-select-sticker">
                            <option>TAX001</option>
                          </select>
                        </div>
                        <div className="sticker-add-form-group-sticker">
                          <label className="sticker-add-form-label-sticker">Tax %</label>
                          <input
                            type="text"
                            value="10.000000%"
                            className="sticker-add-form-input-sticker"
                          />
                        </div>
                      </div>
                      
                      {/* Tax and Price No Tax */}
                      <div className="sticker-add-form-row-sticker sticker-add-cols-2-sticker">
                        <div className="sticker-add-form-group-sticker">
                          <label className="sticker-add-form-label-sticker">Tax</label>
                          <input
                            type="text"
                            value="10.00"
                            className="sticker-add-form-input-sticker"
                          />
                        </div>
                        <div className="sticker-add-form-group-sticker">
                          <label className="sticker-add-form-label-sticker">Price No Tax</label>
                          <input
                            type="text"
                            value="90.00"
                            className="sticker-add-form-input-sticker"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Entitlements Section */}
                  <div className="sticker-add-entitlements-section-sticker">
                    <div className="sticker-add-section-header-sticker">Entitlements</div>
                    <div className="sticker-add-section-content-sticker">
                      <div className="sticker-add-entitlements-content-sticker">
                        <div className="sticker-add-game-time-group-sticker">
                          <label className="sticker-add-form-label-sticker">Game Time (Minutes)</label>
                          <input
                            type="text"
                            value="150"
                            className="sticker-add-form-input-sticker sticker-add-game-time-input-sticker"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Days Section */}
                  <div className="sticker-add-active-days-section-sticker">
                    <div className="sticker-add-active-days-header-sticker">Active days for sale</div>
                    <div className="sticker-add-active-days-content-sticker">
                      {[
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ].map((day, index) => (
                        <div key={index} className="sticker-add-day-row-sticker">
                          <span className="sticker-add-day-name-sticker">{day}</span>
                          <input 
                            type="checkbox" 
                            className="sticker-add-day-checkbox-sticker"
                            defaultChecked={true}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Last Updated Section */}
        <div className="sticker-add-last-updated-section-sticker">
          <div className="sticker-add-last-updated-info-sticker">
            <span className="sticker-add-last-updated-label-sticker">Last Updated Date</span>
            <span className="sticker-add-last-updated-value-sticker">09-Nov-2024 12:11</span>
            <span className="sticker-add-last-updated-label-sticker">Last Updated User</span>
            <span className="sticker-add-last-updated-value-sticker">Ahmed jaseel</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="sticker-add-modal-footer-sticker">
                    <button className="sticker-add-footer-button-sticker sticker-add-edit-sticker">Edit</button>

          <button className="sticker-add-footer-button-sticker sticker-add-save-sticker">Save</button>
          <button className="sticker-add-footer-button-sticker sticker-add-new-sticker">New</button>
          <button className="sticker-add-footer-button-sticker sticker-add-duplicate-sticker">Duplicate</button>
          <button className="sticker-add-footer-button-sticker sticker-add-cancel-sticker">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default StickerProductAdd;