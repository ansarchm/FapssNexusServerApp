import React from "react";
import "./adjustinventory.css";
import cancelIcon from '../../components/assets/iconoir_cancel.png';
import { useNavigate } from "react-router-dom";

const AdjustInventory = () => {
  const navigate = useNavigate();

  return (
    <div className="adjust-overlay">
      <div className="adjust-container">
        {/* Header */}
        <div className="adjust-header">
          <h2 className="adjust-title">Adjust Inventory</h2>
          <button onClick={() => navigate("/stock")} className="adjust-button">
            <img src={cancelIcon} alt="Close button" className="adjust-close"/>
          </button>
        </div>

        {/* Content */}
        <div className="adjust-body">
          <div className="adjust-box">
            {/* Product Details */}
            <div className="adjust-product-info">
              <p>Product : Pepsi 330 ML</p>
              <p>Barcode : 2323845</p>
            </div>

            {/* Body */}
            <div className="adjust-details">
              {/* Received Quantity */}
              <div className="adjust-quantity">
                <label>Received Quantity</label>
                <input
                  type="number"
                  defaultValue="12"
                  className="adjust-qty-input"
                />
              </div>

              {/* Stock Info */}
              <div className="adjust-stock-info">
                <p>Current Counter Stock : 100</p>
                <p>Adjusted Counter Stock : 100</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="adjust-divider" />

        {/* Footer */}
        <div className="adjust-actions">
          <button className="adjust-save-btn">Save</button>
          <button className="adjust-cancel-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AdjustInventory;