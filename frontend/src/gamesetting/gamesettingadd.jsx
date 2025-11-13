import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { gameSettingsService, gameCategoryService } from '../services/api'; // ✅ Added gameCategoryService import
import cancelIcon from '../components/assets/iconoir_cancel.png'; 
import coinIcon from "../components/assets/gamesetting.png"; 
import './gamesettingadd.css';

const GameSettingsPopup = ({ onClose, editingId = null }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // ✅ New: State for dropdown data
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [formData, setFormData] = useState({
    Id: null,
    Description: '',
    MacId: '',
    Category: '',
    SubCategory: '',
    CashPlayPrice: '10.00',
    VipDiscountPrice: '9',
    CoinPlayPrice: '1',
    GameInterface: 'Arcade',
    CurrencyDecimalPlace: '2 Decimal',
    DebitOrder: 'Cash First',
    PulseWidth: '100',
    PulsePauseWidth: 'Arcade',
    PulseToActuate: '1',
    RfidTapDelay: '1',
    DisplayOrientation: 'Landscape',
    LedPattern: 'Multi Color',
    LastUpdatedDate: '',
    LastUpdatedUser: ''
  });

  // ✅ Load existing data if editing
  useEffect(() => {
    if (editingId) {
      loadGameSetting(editingId);
    }
  }, [editingId]);

  const loadGameSetting = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await gameSettingsService.getGameSettingById(id);
      setFormData({
        ...data,
        LastUpdatedDate: data.LastUpdatedDate ? new Date(data.LastUpdatedDate).toLocaleString() : ''
      });
      setIsEditMode(true);
    } catch (err) {
      console.error('Error loading game setting:', err);
      setError(err.message || 'Failed to load game setting');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load categories + subcategories
  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        const [catData, subCatData] = await Promise.all([
          gameCategoryService.getAllCategories(),
          gameCategoryService.getAllSubCategories(),
        ]);
        setCategories(catData);
        setSubCategories(subCatData);
      } catch (err) {
        console.error("Error loading category data:", err);
      }
    };
    loadCategoryData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.Description || formData.Description.trim() === '') {
      setError('Description is required');
      return false;
    }
    if (!formData.MacId || formData.MacId.trim() === '') {
      setError('MAC ID is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) return;

      setLoading(true);
      setError(null);

      await gameSettingsService.addGameSetting(formData);
      
      alert('Game setting saved successfully!');
      navigate('/games');
    } catch (err) {
      console.error('Error saving game setting:', err);
      setError(err.message || 'Failed to save game setting');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!validateForm()) return;
      if (!formData.Id) {
        setError('Cannot update: Game setting ID is missing');
        return;
      }

      setLoading(true);
      setError(null);

      await gameSettingsService.updateGameSetting(formData);
      
      alert('Game setting updated successfully!');
      navigate('/games');
    } catch (err) {
      console.error('Error updating game setting:', err);
      setError(err.message || 'Failed to update game setting');
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setFormData({
      Id: null,
      Description: '',
      MacId: '',
      Category: '',
      SubCategory: '',
      CashPlayPrice: '10.00',
      VipDiscountPrice: '9',
      CoinPlayPrice: '1',
      GameInterface: 'Arcade',
      CurrencyDecimalPlace: '2 Decimal',
      DebitOrder: 'Cash First',
      PulseWidth: '100',
      PulsePauseWidth: 'Arcade',
      PulseToActuate: '1',
      RfidTapDelay: '1',
      DisplayOrientation: 'Landscape',
      LedPattern: 'Multi Color',
      LastUpdatedDate: '',
      LastUpdatedUser: ''
    });
    setIsEditMode(false);
    setError(null);
  };

  const handleDuplicate = () => {
    setFormData(prev => ({
      ...prev,
      Id: null,
      Description: `${prev.Description} (Copy)`,
      LastUpdatedDate: '',
      LastUpdatedUser: ''
    }));
    setIsEditMode(false);
  };

  return (
    <div className="gameSettings-popup-overlay">
      <div className="gameSettings-popup-container">
        {/* Header */}
        <div className="gameSettings-popup-header">
          <div className="gameSettings-header-content">
            <img src={coinIcon} alt="Game Icon" className="gameSettings-item-add-folder-icon-item" />
            <div className="gameSettings-header-title">
              {isEditMode ? 'Edit Game Settings' : 'Add Game Settings'}
            </div>
          </div>
          <button onClick={() => navigate("/games")} className="gameSettings-item-add-close-button-item">
            <img src={cancelIcon} alt="Close" className="gameSettings-item-add" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: '10px', margin: '10px', backgroundColor: '#fee', color: '#c00', borderRadius: '5px', border: '1px solid #c00' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div>Loading...</div>
          </div>
        )}

        {/* Body */}
        <div className="gameSettings-popup-body">
          <div className="gameSettings-settings-container">
            <div className="gameSettings-settings-header">
              <h3>Primary Settings</h3>
            </div>

            <div className="gameSettings-settings-content">
              {/* Row 1 - Description, MAC ID, Category, Sub-Category */}
              <div className="gameSettings-form-row">
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">Description *</label>
                  <input
                    type="text"
                    value={formData.Description}
                    onChange={(e) => handleInputChange('Description', e.target.value)}
                    className="gameSettings-form-input gameSettings-medium-input"
                    placeholder="Enter description"
                  />
                </div>

                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">MAC ID *</label>
                  <input
                    type="text"
                    value={formData.MacId}
                    onChange={(e) => handleInputChange('MacId', e.target.value)}
                    className="gameSettings-form-input gameSettings-mac-input"
                    placeholder="CC:45:AF:89:78:45"
                  />
                </div>

                {/* ✅ Dynamic Category Dropdown */}
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">Category</label>
                  <select
                    value={formData.Category}
                    onChange={(e) => handleInputChange('Category', e.target.value)}
                    className="gameSettings-form-select gameSettings-item-add-form-select-item"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.description}>{cat.description}</option>
                    ))}
                  </select>
                </div>

                {/* ✅ Dynamic Sub-Category Dropdown */}
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">Sub-Category</label>
                  <select
                    value={formData.SubCategory}
                    onChange={(e) => handleInputChange('SubCategory', e.target.value)}
                    className="gameSettings-form-select gameSettings-item-add-form-select-item"
                  >
                    <option value="">Select Sub-Category</option>
                    {subCategories.map((sub) => (
                      <option key={sub.id} value={sub.description}>{sub.description}</option>
                    ))}
                  </select>
                </div>
              </div>





 {/* Second Row - Price Fields */}
              <div className="gameSettings-price-row">
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">Cash Play Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.CashPlayPrice}
                    onChange={(e) => handleInputChange('CashPlayPrice', e.target.value)}
                    className="gameSettings-form-input gameSettings-short-input"
                  />
                </div>
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">VIP Discount Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.VipDiscountPrice}
                    onChange={(e) => handleInputChange('VipDiscountPrice', e.target.value)}
                    className="gameSettings-form-input gameSettings-short-input"
                  />
                </div>
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">Coin Play Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.CoinPlayPrice}
                    onChange={(e) => handleInputChange('CoinPlayPrice', e.target.value)}
                    className="gameSettings-form-input gameSettings-short-input"
                  />
                </div>
              </div>

              {/* Third Row - Interface, Currency, Debit Order, Pulse Width */}
              <div className="gameSettings-form-row">
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">Game Interface</label>
                  <select
                    value={formData.GameInterface}
                    onChange={(e) => handleInputChange('GameInterface', e.target.value)}
                    className="gameSettings-form-select gameSettings-item-add-form-select-item"
                  >
                    <option>Arcade</option>
                    <option>Video</option>
                    <option>Redemption</option>
                  </select>
                </div>
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">Currency Decimal Place</label>
                  <select
                    value={formData.CurrencyDecimalPlace}
                    onChange={(e) => handleInputChange('CurrencyDecimalPlace', e.target.value)}
                    className="gameSettings-form-select gameSettings-item-add-form-select-item"
                  >
                    <option>2 Decimal</option>
                    <option>1 Decimal</option>
                    <option>0 Decimal</option>
                  </select>
                </div>
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">Debit Order</label>
                  <select
                    value={formData.DebitOrder}
                    onChange={(e) => handleInputChange('DebitOrder', e.target.value)}
                    className="gameSettings-form-select gameSettings-item-add-form-select-item"
                  >
                    <option>Cash First</option>
                    <option>Card First</option>
                  </select>
                </div>
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">Pulse Width (ms)</label>
                  <input
                    type="text"
                    value={formData.PulseWidth}
                    onChange={(e) => handleInputChange('PulseWidth', e.target.value)}
                    className="gameSettings-form-input"
                  />
                </div>
              </div>

              {/* Fourth Row - Pulse Settings and Display */}
              <div className="gameSettings-form-row">
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">Pulse Pause Width (ms)</label>
                  <input
                    type="text"
                    value={formData.PulsePauseWidth}
                    onChange={(e) => handleInputChange('PulsePauseWidth', e.target.value)}
                    className="gameSettings-form-input"
                  />
                </div>
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">Pulse to Actuate</label>
                  <input
                    type="text"
                    value={formData.PulseToActuate}
                    onChange={(e) => handleInputChange('PulseToActuate', e.target.value)}
                    className="gameSettings-form-input"
                  />
                </div>
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">RFID Tap Delay (Sec)</label>
                  <input
                    type="text"
                    value={formData.RfidTapDelay}
                    onChange={(e) => handleInputChange('RfidTapDelay', e.target.value)}
                    className="gameSettings-form-input"
                  />
                </div>
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">Display Orientation</label>
                  <select
                    value={formData.DisplayOrientation}
                    onChange={(e) => handleInputChange('DisplayOrientation', e.target.value)}
                    className="gameSettings-form-select gameSettings-item-add-form-select-item"
                  >
                    <option>Landscape</option>
                    <option>Portrait</option>
                  </select>
                </div>
              </div>

              {/* LED Pattern Row */}
              <div className="gameSettings-form-row gameSettings-led-row">
                <div className="gameSettings-form-group">
                  <label className="gameSettings-form-label">LED Pattern</label>
                  <select
                    value={formData.LedPattern}
                    onChange={(e) => handleInputChange('LedPattern', e.target.value)}
                    className="gameSettings-form-select gameSettings-item-add-form-select-item"
                  >
                    <option>Multi Color</option>
                    <option>Single Color</option>
                    <option>Rainbow</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated Row */}
          {isEditMode && (
            <div className="gameSettings-last-updated-row">
              <div className="gameSettings-last-updated-item">
                <span className="gameSettings-last-updated-label">Last Updated Date: </span>
                <span className="gameSettings-last-updated-value">{formData.LastUpdatedDate || 'N/A'}</span>
              </div>
              <div className="gameSettings-last-updated-item">
                <span className="gameSettings-last-updated-label">Last Updated User: </span>
                <span className="gameSettings-last-updated-value">{formData.LastUpdatedUser || 'N/A'}</span>
              </div>
            </div>
          )}

























          {/* Buttons */}
          <div className="gameSettings-action-buttons">
            {isEditMode ? (
              <button onClick={handleUpdate} disabled={loading} className="gameSettings-btn gameSettings-btn-update">
                {loading ? 'Updating...' : 'Update'}
              </button>
            ) : (
              <button onClick={handleSave} disabled={loading} className="gameSettings-btn gameSettings-btn-save">
                {loading ? 'Saving...' : 'Save'}
              </button>
            )}
            <button onClick={handleNew} disabled={loading} className="gameSettings-btn gameSettings-btn-new">New</button>
            <button onClick={handleDuplicate} disabled={loading || !formData.Description} className="gameSettings-btn gameSettings-btn-duplicate">Duplicate</button>
            <button onClick={() => navigate("/games")} className="gameSettings-btn gameSettings-btn-close">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSettingsPopup;
