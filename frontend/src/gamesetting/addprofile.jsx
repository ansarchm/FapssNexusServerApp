// AddProfileModal.js
import React, { useState } from 'react';
import './addprofile.css';
import cancelIcon from '../components/assets/iconoir_cancel.png';
import closeIcon from '../components/assets/close.png';
import accessProfileIcon from '../components/assets/accessprofile.png';
import { useNavigate } from 'react-router-dom';
import AccessProfileAddGamesModal from './accessprofileadd'; // Import the new modal

const AddProfileModal = () => {
  const [formData, setFormData] = useState({
    id: '1234',
    active: true,
    profile: '',
    description: ''
  });

  const [categories, setCategories] = useState([
    { id: 1, name: 'Redemption', checked: true },
    { id: 2, name: 'Arcade', checked: true },
    { id: 3, name: 'Attraction', checked: true },
    { id: 4, name: 'Redemption', checked: true },
    { id: 5, name: 'Checked', checked: true },
    { id: 1, name: 'Redemption', checked: true },
    { id: 2, name: 'Arcade', checked: true },
    { id: 3, name: 'Attraction', checked: true },
    { id: 4, name: 'Redemption', checked: true },
    { id: 5, name: 'Arcade', checked: true }
  ]);

  // State for Add Games modal
  const [isAddGamesModalOpen, setIsAddGamesModalOpen] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, checked: !cat.checked }
          : cat
      )
    );
  };
  
  const navigate = useNavigate(); 
  
  const handleSave = () => {
    console.log('Saving profile:', formData);
    console.log('Selected categories:', categories.filter(cat => cat.checked));
  };

  const handleCancel = () => {
    console.log('Cancelled');
  };

  const handleAddGames = () => {
    setIsAddGamesModalOpen(true);
  };

  const handleCloseAddGamesModal = () => {
    setIsAddGamesModalOpen(false);
  };

  return (
    <div className="addprofile-modal-overlay">
      <div className="addprofile-modal-container">
        {/* Header */}
        <div className="addprofile-modal-header">
          <div className="addprofile-header-left">
            <img src={accessProfileIcon} alt="Access Profile" className="addprofile-access-profile-icon" />
            <h2 className="addprofile-modal-title">Add Profile</h2>
          </div>
          <button onClick={() => navigate("/accessprofile")} className="addprofile-close-button">
            <img src={cancelIcon} alt="Close" className="addprofile-close-icon" />
          </button>
        </div>

        {/* Content */}
        <div className="addprofile-modal-content">
          <div className="addprofile-content-grid">
            {/* Profile Box */}
            <div className="addprofile-profile-box">
              <h3 className="addprofile-section-header">Profile</h3>
              
              <div className="addprofile-form-fields">
                {/* Horizontal Row: ID, Active, Profile */}
                <div className="addprofile-horizontal-field-row">
                  {/* ID Field */}
                  <div className="addprofile-horizontal-field-item">
                    <label className="addprofile-field-label">ID</label>
                    
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => handleInputChange('id', e.target.value)}
                      className="addprofile-field-input"
                      placeholder="1234"
                    />
                  </div>

                  {/* Active Checkbox */}
                  <div className="addprofile-horizontal-field-item">
                    <label className="addprofile-field-label">Active</label>
                    <div className="addprofile-checkbox-container">
                      <input
                        type="checkbox"
                        id="addprofile-active-checkbox"
                        checked={formData.active}
                        onChange={(e) => handleInputChange('active', e.target.checked)}
                        className="addprofile-checkbox-input"
                      />
                      <label htmlFor="addprofile-active-checkbox" className="addprofile-checkbox-custom"></label>
                    </div>
                  </div>

                  {/* Profile Field */}
                  <div className="addprofile-horizontal-field-item">
                    <label className="addprofile-field-label">Profile</label>
                    <input
                      type="text"
                      value={formData.profile}
                      onChange={(e) => handleInputChange('profile', e.target.value)}
                      className="addprofile-field-input"
                    />
                  </div>
                </div>

                {/* Description Field - Separate Row */}
                <div className="addprofile-field-row">
                  <label className="addprofile-field-label addprofile-description-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="addprofile-field-textarea"
                  />
                </div>
              </div>
            </div>

            {/* Select Category Box - Updated Structure */}
            <div className="addprofile-category-box">
              {/* Category Header with two sections */}
              <div className="addprofile-category-header">
                <div className="addprofile-category-header-section addprofile-category-select-section">
                  Select
                </div>
                <div className="addprofile-category-header-section addprofile-category-title-section">
                  Category
                </div>
              </div>
              
              {/* Category List */}
              <div className="addprofile-category-list">
                {categories.map((category) => (
                  <div key={category.id} className="addprofile-category-item">
                    <div className="addprofile-category-checkbox-section">
                      <div className="addprofile-checkbox-container">
                        <input
                          type="checkbox"
                          id={`addprofile-category-${category.id}`}
                          checked={category.checked}
                          onChange={() => handleCategoryChange(category.id)}
                          className="addprofile-checkbox-input"
                        />
                        <label htmlFor={`addprofile-category-${category.id}`} className="addprofile-checkbox-custom"></label>
                      </div>
                    </div>
                    <div className="addprofile-category-name-section">
                      <span className="addprofile-category-name">{category.name}</span>
                    </div>
                    <div className="addprofile-category-remove-section">
                       <img src={closeIcon} alt="Close" className="addprofile-close-icon" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="addprofile-footer-section">
            <div className="addprofile-footer-info">
              <div className="addprofile-info-item">
                <span className="addprofile-info-label">Last Updated Date:</span>
                <span className="addprofile-info-value">09-Nov-2024</span>
              </div>
              <div className="addprofile-info-item">
                <span className="addprofile-info-label">Last Updated User:</span>
                <span className="addprofile-info-value">Ahmed Jaseel</span>
              </div>
            </div>
            <button onClick={handleAddGames} className="addprofile-add-games-button">
              Add Games
            </button>
          </div>

          {/* Action Buttons */}
          <div className="addprofile-action-buttons">
            <button onClick={handleSave} className="addprofile-save-button">
              Save
            </button>
            <button onClick={handleCancel} className="addprofile-cancel-button">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Add Games Modal */}
      <AccessProfileAddGamesModal 
        isOpen={isAddGamesModalOpen} 
        onClose={handleCloseAddGamesModal} 
      />
    </div>
  );
};

export default AddProfileModal;