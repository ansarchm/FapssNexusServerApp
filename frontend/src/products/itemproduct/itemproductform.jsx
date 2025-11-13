import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./itemproductform.css";
import cardIcon from "../../components/assets/item.png"; 
import cancelIcon from "../../components/assets/iconoir_cancel.png"; 

const ItemProductAdd = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
 
  if (!isOpen) {
    return (
      <div className="item-add-demo-container-item">
        <button onClick={() => setIsOpen(true)} className="item-add-open-modal-button-item">
          Open Item Product Modal
        </button>
      </div>
    );
  }
 
  return (
    <div className="item-add-modal-overlay-item">
      <div className="item-add-modal-container-item">
        {/* Header */}
        <div className="item-add-modal-header-item">
          <div className="item-add-header-title-item">
            <img src={cardIcon} alt="Card Icon" className="item-add-folder-icon-item" />
            <h2 className="item-add-title-text-item">Item Product</h2>
          </div>
          <button onClick={() => navigate("/item-product")} className="item-add-close-button-item">
            <img src={cancelIcon} alt="Close" className="item-add-close-icon-item" />
          </button>
        </div>
       
        {/* Content Area */}
        <div className="item-add-modal-content-item">
          {/* Main Content */}
          <div className="item-add-main-content-item">
            <div className="item-add-content-wrapper-item">
              <div className="item-add-main-sections-item">
                {/* Product Section */}
                <div className="item-add-product-section-item">
                  <div className="item-add-section-header-item">Product</div>
                  <div className="item-add-product-content-item">
                    {/* Row 1 */}
                    <div className="item-add-form-row-item item-add-cols-3-item">
                      <div className="item-add-form-group-item">
                        <label className="item-add-form-label-item">Product Id</label>
                        <input
                          type="text"
                          value="34569"
                          className="item-add-form-input-item"
                          readOnly
                        />
                      </div>
                      <div className="item-add-form-group-item">
                        <label className="item-add-form-label-item">Product Name</label>
                        <input
                          type="text"
                          value="New card $100"
                          className="item-add-form-input-item"
                        />
                      </div>
                      <div className="item-add-form-group-item">
                        <label className="item-add-form-label-item">POS Counter</label>
                        <select className="item-add-form-select-item">
                          <option>Default</option>
                        </select>
                      </div>
                    </div>
                   
                    {/* Row 2 */}
                    <div className="item-add-form-row-item item-add-cols-3-item">
                      <div className="item-add-form-group-item">
                        <label className="item-add-form-label-item">Department</label>
                        <select className="item-add-form-select-item">
                          <option>Card product</option>
                        </select>
                      </div>
                      <div className="item-add-form-group-item">
                        <label className="item-add-form-label-item">Display Group</label>
                        <select className="item-add-form-select-item">
                          <option>New Card</option>
                        </select>
                      </div>
                      <div className="item-add-form-group-item">
                        <label className="item-add-form-label-item">Display Order</label>
                        <input type="text" value="45" className="item-add-form-input-item" />
                      </div>
                    </div>
                   
                    {/* Checkboxes */}
                    <div className="item-add-checkbox-section-item">
                      <div className="item-add-checkbox-grid-item">
                        {[
                          "Active",
                          "Display in POS", 
                          "Kiosk",
                          "KOT",
                          "Customer Card",
                          "Inventory"
                        ].map((label, i) => (
                          <div key={i} className="item-add-checkbox-item-item">
                            <input
                              type="checkbox"
                              className="item-add-checkbox-item"
                              defaultChecked={label === "Active"}
                              readOnly={label === "Active"}
                            />
                            <span className="item-add-checkbox-label-item">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
               
                {/* Bottom Sections */}
                <div className="item-add-bottom-sections-item">
                  {/* Price Section */}
                  <div className="item-add-price-section-item">
                    <div className="item-add-section-header-item item-add-price-header-item">Price</div>
                    <div className="item-add-section-content-item">
                      {/* Face Value and Selling Price */}
                      <div className="item-add-form-row-item item-add-cols-2-item">
                        <div className="item-add-form-group-item">
                          <label className="item-add-form-label-item">Face Value</label>
                          <input
                            type="text"
                            value="$90.00"
                            className="item-add-form-input-item"
                          />
                        </div>
                        <div className="item-add-form-group-item">
                          <label className="item-add-form-label-item">Selling price</label>
                          <input
                            type="text"
                            value="$100.00"
                            className="item-add-form-input-item"
                          />
                        </div>
                      </div>
                     
                      {/* Tax Inclusive */}
                      <div className="item-add-checkbox-item-item item-add-tax-inclusive-row-item">
                        <label className="item-add-checkbox-label-tax-item">Tax Inclusive ?</label>
                        <input type="checkbox" className="item-add-checkbox-tax-item" />
                      </div>
                     
                      {/* Separator Line */}
                      <div className="item-add-separator-line-item"></div>
                     
                      {/* Tax Category */}
                      <div className="item-add-form-row-item item-add-cols-2-item">
                        <div className="item-add-form-group-item">
                          <label className="item-add-form-label-item">Tax Category</label>
                          <select className="item-add-form-select-item">
                            <option>TAX001</option>
                          </select>
                        </div>
                        <div className="item-add-form-group-item">
                          <label className="item-add-form-label-item">Tax %</label>
                          <input
                            type="text"
                            value="10.000000%"
                            className="item-add-form-input-item"
                          />
                        </div>
                      </div>
                     
                      {/* Tax and Price No Tax */}
                      <div className="item-add-form-row-item item-add-cols-2-item">
                        <div className="item-add-form-group-item">
                          <label className="item-add-form-label-item">Tax</label>
                          <input
                            type="text"
                            value="10.00"
                            className="item-add-form-input-item"
                          />
                        </div>
                        <div className="item-add-form-group-item">
                          <label className="item-add-form-label-item">Price No Tax</label>
                          <input
                            type="text"
                            value="90.00"
                            className="item-add-form-input-item"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                 {/* Entitlements Section */}
<div className="item-add-entitlements-section-item">
  <div className="item-add-section-header-item">Entitlements</div>
  <div className="item-add-section-content-item">
    <div className="item-add-entitlements-content-item">
      
      {/* Barcode Row - All in one horizontal line */}
      <div className="item-add-barcode-row-item">
        <div className="item-add-form-group-item">
          <label className="item-add-form-label-item">Barcode</label>
          <input
            type="text"
            value="1323567811"
            className="item-add-form-input-item item-add-barcode-input-item"
          />
        </div>
        <div className="item-add-barcode-checkbox-item">
          <input type="checkbox" defaultChecked />
          <span>(create automatic barcode)</span>
        </div>
        <button className="item-add-edit-btn-item">Edit</button>
      </div>

      {/* Separator Line */}
      <div className="item-add-entitlements-separator-item"></div>

      {/* UOM + Ticket Price + Product Image Row */}
      <div className="item-add-second-row-item">
        
        {/* UOM Section (now includes Ticket Price) */}
        <div className="item-add-uom-section-item">
  
  {/* Row 1: Label + Select + Add UOM Button */}
  <div className="item-add-uom-row">
    <label className="item-add-form-label-item">Unit of Measure</label>
    <select className="item-add-form-select-item">
      <option>Box</option>
    </select>
    <button className="item-add-add-uom-btn-item">Add UOM</button>
  </div>

  {/* Row 2: Ticket Price */}
  <div className="item-add-ticket-price-row-item">
    <div className="item-add-form-group-item">
      <label className="item-add-form-label-item">Ticket Price</label>
      <input
        type="text"
        className="item-add-form-input-item item-add-ticket-input-item"
      />
    </div>
  </div>

</div>


        {/* Product Image Section */}
        <div className="item-add-product-image-section-item">
          <label className="item-add-form-label-item">Product image</label>
          <div className="item-add-product-image-upload-item"></div>
          <button className="item-add-reset-image-btn-item">Reset</button>
        </div>
      </div>

    </div>
  </div>
</div>


                  {/* Active Days Section */}
                  <div className="item-add-active-days-section-item">
                    <div className="item-add-active-days-header-item">Active days for sale</div>
                    <div className="item-add-active-days-content-item">
                      {[
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ].map((day, index) => (
                        <div key={index} className="item-add-day-row-item">
                          <span className="item-add-day-name-item">{day}</span>
                          <input type="checkbox" className="item-add-day-checkbox-item" />
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
        <div className="item-add-last-updated-section-item">
          <div className="item-add-last-updated-info-item">
            <span className="item-add-last-updated-label-item">Last Updated Date</span>
            <span className="item-add-last-updated-value-item">09-Dec-2024 12:11</span>
            <span className="item-add-last-updated-label-item">Last Updated User</span>
            <span className="item-add-last-updated-value-item">Ahmed jaseel</span>
          </div>
        </div>
       
        {/* Footer */}
        <div className="item-add-modal-footer-item">
         <button className="item-add-footer-button-item item-add-edit-item">Edit</button>

          <button className="item-add-footer-button-item item-add-save-item">Save</button>
          <button className="item-add-footer-button-item item-add-new-item">New</button>
          <button className="item-add-footer-button-item item-add-duplicate-item">Duplicate</button>
          <button className="item-add-footer-button-item item-add-cancel-item">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ItemProductAdd;