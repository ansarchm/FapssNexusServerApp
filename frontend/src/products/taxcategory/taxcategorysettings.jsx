import React, { useState } from 'react';
import './taxcategorysettings.css';
import taxCategoryIcon from '../../components/assets/taxcategory.png';
import cancelIcon from '../../components/assets/iconoir_cancel.png';

const TaxCategorySettings = ({ onClose }) => {
  const [formData, setFormData] = useState({
    taxId: '',
    taxCategory: '',
    description: '',
    isActive: true,
    lastUpdatedDate: '12-04-2025',
    lastUpdatedUser: '23-07-2025'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      isActive: e.target.checked
    }));
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    onClose();
  };

  const handleNew = () => {
    setFormData({
      taxId: '',
      taxCategory: '',
      description: '',
      isActive: true,
      lastUpdatedDate: '12-04-2025',
      lastUpdatedUser: '23-07-2025'
    });
  };

  return (
    <div className="taxcategorysettings-overlay" onClick={onClose}>
      <div className="taxcategorysettings-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="taxcategorysettings-header">
          <div className="taxcategorysettings-header-left">
            <img src={taxCategoryIcon} alt="Tax Category" className="taxcategorysettings-icon" />
            <h2 className="taxcategorysettings-title">Tax Category Settings</h2>
          </div>
          <button className="taxcategorysettings-close-btn" onClick={onClose}>
            <img src={cancelIcon} alt="Close" />
          </button>
        </div>

        {/* Form Content */}
        <div className="taxcategorysettings-content">
          {/* Main Details Container */}
          <div className="taxcategorysettings-details-container">
            {/* Details Header */}
            <div className="taxcategorysettings-details-header-inside">
              <span>Details</span>
            </div>
            
            {/* Tax ID and Tax Category Row */}
            <div className="taxcategorysettings-row">
              <div className="taxcategorysettings-field-inline">
                <label className="taxcategorysettings-label">Tax ID</label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  placeholder="23"
                  className="taxcategorysettings-input-taxid"
                />
              </div>
              <div className="taxcategorysettings-field-inline">
                <label className="taxcategorysettings-label">Tax Category</label>
                <input
                  type="text"
                  name="taxCategory"
                  value={formData.taxCategory}
                  onChange={handleInputChange}
                  placeholder="Sales Tax"
                  className="taxcategorysettings-input-taxcategory"
                />
              </div>
            </div>

            {/* Description and Active Row */}
            <div className="taxcategorysettings-row">
              <div className="taxcategorysettings-field-inline">
                <label className="taxcategorysettings-label">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="New Card $100"
                  className="taxcategorysettings-input-description"
                />
              </div>
              <div className="taxcategorysettings-field-checkbox">
                <label className="taxcategorysettings-checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    className="taxcategorysettings-checkbox"
                  />
                  <span className="taxcategorysettings-checkbox-text">Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Last Updated Row - Outside container */}
          <div className="taxcategorysettings-last-updated-row">
            <span className="taxcategorysettings-last-updated-text">
              Last Updated Date : <span>{formData.lastUpdatedDate}</span>
            </span>
            <span className="taxcategorysettings-last-updated-text">
              Last Updated User : <span>{formData.lastUpdatedUser}</span>
            </span>
          </div>
        </div>

        {/* Separator Line before buttons */}
        <div className="taxcategorysettings-separator"></div>

        {/* Action Buttons */}
        <div className="taxcategorysettings-footer">
          <button className="taxcategorysettings-btn taxcategorysettings-btn-save" onClick={handleSave}>
            Save
          </button>
          <button className="taxcategorysettings-btn taxcategorysettings-btn-new" onClick={handleNew}>
            New
          </button>
          <button className="taxcategorysettings-btn taxcategorysettings-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxCategorySettings;