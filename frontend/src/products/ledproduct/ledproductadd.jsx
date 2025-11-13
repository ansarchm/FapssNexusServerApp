import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ledproductadd.css";
import ledIcon from "../../components/assets/led.png";
import cancelIcon from "../../components/assets/iconoir_cancel.png";

const LedProductAdd = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
 
  if (!isOpen) {
    return (
      <div className="led-add-demo-container-led">
        <button onClick={() => setIsOpen(true)} className="led-add-open-modal-button-led">
          Open LED Product Modal
        </button>
      </div>
    );
  }
 
  return (
    <div className="led-add-modal-overlay-led">
      <div className="led-add-modal-container-led">
        {/* Header */}
        <div className="led-add-modal-header-led">
          <div className="led-add-header-title-led">
            <img src={ledIcon} alt="LED Icon" className="led-add-folder-icon-led" />
            <h2 className="led-add-title-text-led">LED Product</h2>
          </div>
          <button onClick={() => navigate("/led-product")} className="led-add-close-button-led">
            <img src={cancelIcon} alt="Close" className="led-add-close-icon-led" />
          </button>
        </div>
       
        {/* Content Area */}
        <div className="led-add-modal-content-led">
          {/* Main Content */}
          <div className="led-add-main-content-led">
            <div className="led-add-content-wrapper-led">
              <div className="led-add-main-sections-led">
                {/* Product Section */}
                <div className="led-add-product-section-led">
                  <div className="led-add-section-header-led">Product</div>
                  <div className="led-add-product-content-led">
                    {/* Row 1 */}
                    <div className="led-add-form-row-led led-add-cols-3-led">
                      <div className="led-add-form-group-led">
                        <label className="led-add-form-label-led">Product Id</label>
                        <input
                          type="text"
                          value="29456"
                          className="led-add-form-input-led"
                          readOnly
                        />
                      </div>
                      <div className="led-add-form-group-led">
                        <label className="led-add-form-label-led">Product Name</label>
                        <input
                          type="text"
                          value="New card $100"
                          className="led-add-form-input-led"
                        />
                      </div>
                      <div className="led-add-form-group-led">
                        <label className="led-add-form-label-led">POS Counter</label>
                        <select className="led-add-form-select-led">
                          <option>Default</option>
                        </select>
                      </div>
                    </div>
                   
                    {/* Row 2 */}
                    <div className="led-add-form-row-led led-add-cols-3-led">
                      <div className="led-add-form-group-led">
                        <label className="led-add-form-label-led">Department</label>
                        <select className="led-add-form-select-led">
                          <option>Card product</option>
                        </select>
                      </div>
                      <div className="led-add-form-group-led">
                        <label className="led-add-form-label-led">Display Group</label>
                        <select className="led-add-form-select-led">
                          <option>New Card</option>
                        </select>
                      </div>
                      <div className="led-add-form-group-led">
                        <label className="led-add-form-label-led">Display Order</label>
                        <input type="text" value="45" className="led-add-form-input-led" />
                      </div>
                    </div>
                   
                    {/* Checkboxes */}
                    <div className="led-add-checkbox-section-led">
                      <div className="led-add-checkbox-grid-led">
                        {[
                          "Active",
                          "Display in POS",
                          "KOT",
                          "Customer Card",
                          
                        ].map((label, i) => (
                          <div key={i} className="led-add-checkbox-item-led">
                            <input
                              type="checkbox"
                              className="led-add-checkbox-led"
                              defaultChecked={label === "Active"}
                              readOnly={label === "Active"}
                            />
                            <span className="led-add-checkbox-label-led">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
               
                {/* Bottom Sections */}
                <div className="led-add-bottom-sections-led">
                  {/* Price Section */}
                  <div className="led-add-price-section-led">
                    <div className="led-add-section-header-led led-add-price-header-led">Price</div>
                    <div className="led-add-section-content-led">
                      {/* Face Value and Selling Price */}
                      <div className="led-add-form-row-led led-add-cols-2-led">
                        <div className="led-add-form-group-led">
                          <label className="led-add-form-label-led">Price</label>
                          <input
                            type="text"
                            value="$90.00"
                            className="led-add-form-input-led"
                          />
                        </div>
                        <div className="led-add-form-group-led">
                          <label className="led-add-form-label-led">Selling price</label>
                          <input
                            type="text"
                            value="$100.00"
                            className="led-add-form-input-led"
                          />
                        </div>
                      </div>
                     
                      {/* Tax Inclusive */}
                      <div className="led-add-checkbox-item-led led-add-tax-inclusive-row-led">
                        <label className="led-add-checkbox-label-tax-led">Tax Inclusive ?</label>
                        <input type="checkbox" className="led-add-checkbox-tax-led" />
                      </div>
                     
                      {/* Separator Line */}
                      <div className="led-add-separator-line-led"></div>
                     
                      {/* Tax Category */}
                      <div className="led-add-form-row-led led-add-cols-2-led">
                        <div className="led-add-form-group-led">
                          <label className="led-add-form-label-led">Tax Category</label>
                          <select className="led-add-form-select-led">
                            <option>TAX001</option>
                          </select>
                        </div>
                        <div className="led-add-form-group-led">
                          <label className="led-add-form-label-led">Tax %</label>
                          <input
                            type="text"
                            value="10.000000%"
                            className="led-add-form-input-led"
                          />
                        </div>
                      </div>
                     
                      {/* Tax and Price No Tax */}
                      <div className="led-add-form-row-led led-add-cols-2-led">
                        <div className="led-add-form-group-led">
                          <label className="led-add-form-label-led">Tax</label>
                          <input
                            type="text"
                            value="10.00"
                            className="led-add-form-input-led"
                          />
                        </div>
                        <div className="led-add-form-group-led">
                          <label className="led-add-form-label-led">Price No Tax</label>
                          <input
                            type="text"
                            value="90.00"
                            className="led-add-form-input-led"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
   {/* Entitlements Section - ADD THIS */}
  <div className="led-add-entitlements-section-led">
    <div className="led-add-section-header-led">Entitlements</div> {/* <-- THIS IS THE MISSING LINE */}
    <div className="led-add-section-content-led">
      <div className="led-add-entitlements-content-led">
        {/* NEW CONTAINER FOR MINUTES INPUTS */}
        <div className="led-add-minutes-container-led">
          {/* Green Minutes */}
          <div className="led-add-form-group-led">
            <label className="led-add-form-label-led">Green (Minutes)</label>
            <input
              type="text"
              value="60"
              className="led-add-form-input-led led-add-minutes-input-led"
            />
          </div>

          {/* Blue Minutes */}
          <div className="led-add-form-group-led">
            <label className="led-add-form-label-led">Blue (Minutes)</label>
            <input
              type="text"
              value="60"
              className="led-add-form-input-led led-add-minutes-input-led"
            />
          </div>

          {/* Red Minutes */}
          <div className="led-add-form-group-led">
            <label className="led-add-form-label-led">Red (Minutes)</label>
            <input
              type="text"
              value="60"
              className="led-add-form-input-led led-add-minutes-input-led"
            />
          </div>
        </div> {/* END OF NEW CONTAINER */}

        {/* Bracelet Quantity - keep this separate */}
        <div className="led-add-form-group-led led-add-bracelet-group-led">
          <label className="led-add-form-label-led">Bracelet Quantity</label>
          <input
            type="text"
            value="1"
            className="led-add-form-input-led led-add-bracelet-input-led"
          />
        </div>
      </div>
    </div>
  </div>


                 
                   {/* Active Days Section */}
    <div className="led-add-active-days-section-led">
      <div className="led-add-active-days-header-led">Active days for sale</div>
      <div className="led-add-active-days-content-led">
        {[
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].map((day, index) => (
          <div key={index} className="led-add-day-row-led">
            <span className="led-add-day-name-led">{day}</span>
            <input type="checkbox" className="led-add-day-checkbox-led" />
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
        <div className="led-add-last-updated-section-led">
          <div className="led-add-last-updated-info-led">
            <span className="led-add-last-updated-label-led">Last Updated Date</span>
            <span className="led-add-last-updated-value-led">09-Nov-2024 12:11</span>
            <span className="led-add-last-updated-label-led">Last Updated User</span>
            <span className="led-add-last-updated-value-led">Ahmed jaseel</span>
          </div>
        </div>
       
        {/* Footer */}
        <div className="led-add-modal-footer-led">
                    <button className="led-add-footer-button-led led-add-edit-led">Edit</button>

          <button className="led-add-footer-button-led led-add-save-led">Save</button>
          <button className="led-add-footer-button-led led-add-new-led">New</button>
          <button className="led-add-footer-button-led led-add-duplicate-led">Duplicate</button>
          <button className="led-add-footer-button-led led-add-cancel-led">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LedProductAdd;