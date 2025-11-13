import React from "react";
import "./quickinventory.css";
import cancelIcon from '../../components/assets/iconoir_cancel.png';
import { useNavigate } from "react-router-dom";

const QuickInventory = ({ onClose }) => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate("/stock"); // route to your UserList page
  };

  return (
    <div className="quick-popup-overlay">
      <div className="quick-popup-content">
        {/* Header */}
        <div className="quick-popup-header">
          <h2 className="quick-popup-title">Quick Inventory</h2>
          <button className="quick-popup-close" onClick={handleClose}>
            <img src={cancelIcon} alt="Close" />
          </button>
        </div>

        {/* Content */}
        <div className="quick-popup-body">
          <div className="quick-content-border">
            {/* Product Details */}
            <div className="quick-content-header">
              <p>Product : Pepsi 330 ML</p>
              <p>Barcode : 2323845</p>
            </div>

            {/* Body */}
            <div className="quick-content-body">
              <div className="quick-quantity-section">
                <label>Received Quantity</label>
                <input type="number" value="12" readOnly className="quick-quantity-input" />
              </div>

              {/* Stock Info */}
              <div className="quick-stock-section">
                <p>Current Counter Stock : 100</p>
                <p>Adjusted Counter Stock : 100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="quick-popup-buttons">
          <button className="quick-btn-save">Save</button>
          <button className="quick-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickInventory;