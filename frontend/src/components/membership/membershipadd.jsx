import React, { useState } from 'react';
import './membershipadd.css';
import closeIcon from "../../components/assets/iconoir_cancel.png"; 
import membershipIcon from '../../components/assets/membership.png';

const MembershipSetup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    active: true,
    id: '23',
    membership: 'Gold Member',
    discount: '23%',
    description: 'Valid only for VIP Customer',
    validForNewly: true,
    membershipType: 'Auto Earned Based Program',
    startingDate: '2025-05-09',
    endDate: '2025-05-29',
    duration: '12',
    spendingLevel: '12 JOD',
    programDuration: '365',
    registrationRequired: true,
    allowCardDiscount: true,
    allowGameDiscount: true,
    lastUpdated: '12-04-2025',
    lastUpdatedUser: '23-07-2025'
  });

  const [timeSlots, setTimeSlots] = useState({
    Sunday: { start: '8:00 AM', end: '8:00 PM', enabled: true },
    Monday: { start: '8:00 AM', end: '8:00 PM', enabled: true },
    Tuesday: { start: '8:00 AM', end: '8:00 PM', enabled: true },
    Wednesday: { start: '8:00 AM', end: '8:00 PM', enabled: true },
    Thursday: { start: '8:00 AM', end: '8:00 PM', enabled: true },
    Friday: { start: '8:00 AM', end: '8:00 PM', enabled: true },
    Saturday: { start: '8:00 AM', end: '8:00 PM', enabled: true }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (day, type, value) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: { ...prev[day], [type]: value }
    }));
  };

  const handleDayToggle = (day) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="membership-modal-overlay">
      <div className="membership-modal-container">
        {/* Header */}
        <div className="membership-modal-header">
          <div className="membership-header-title">
            <img src={membershipIcon} alt="Membership" className="membership-folder-icon" />
            <h2 className="membership-title-text">Membership setup</h2>
          </div>
          <button className="membership-close-button" onClick={onClose}>
            <img src={closeIcon} alt="Close" className="membership-close" />
          </button>
        </div>

        {/* Content Area */}
        <div className="membership-modal-content">
          <div className="membership-content-wrapper">
            <div className="membership-main-sections">
              
              {/* First Row - Details and Discount */}
              <div className="membership-first-row">
                {/* Details Section */}
                <div className="membership-details-section">
                  <h3 className="membership-section-header">Details</h3>
                  <div className="membership-details-content">
                    <div className="membership-form-row">
                      <div className="membership-form-group">
                        <label className="membership-checkbox-item">
                          <input 
                            type="checkbox" 
                            className="membership-checkbox"
                            checked={formData.active}
                            onChange={(e) => handleInputChange('active', e.target.checked)}
                          />
                          <span className="membership-checkbox-label">Active</span>
                        </label>
                      </div>
                      <div className="membership-form-group">
                        <label className="membership-form-label">ID</label>
                        <input 
                          type="text" 
                          className="membership-form-input membership-id-input"
                          value={formData.id}
                          onChange={(e) => handleInputChange('id', e.target.value)}
                        />
                      </div>
                      <div className="membership-form-group">
                        <label className="membership-form-label">Membership</label>
                        <input 
                          type="text" 
                          className="membership-form-input membership-name-input"
                          value={formData.membership}
                          onChange={(e) => handleInputChange('membership', e.target.value)}
                        />
                      </div>
                      <div className="membership-form-group">
                        <label className="membership-form-label">Discount</label>
                        <input 
                          type="text" 
                          className="membership-form-input membership-discount-input"
                          value={formData.discount}
                          onChange={(e) => handleInputChange('discount', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="membership-form-row">
                      <div className="membership-form-group membership-description-full">
                        <label className="membership-form-label">Description</label>
                        <input 
                          type="text" 
                          className="membership-form-input"
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                      </div>
                      <div className="membership-form-group">
                        <label className="membership-checkbox-item">
                          <input 
                            type="checkbox"
                            className="membership-checkbox"
                            checked={formData.validForNewly}
                            onChange={(e) => handleInputChange('validForNewly', e.target.checked)}
                          />
                          <span className="membership-checkbox-label">Valid for Newly Registered Customer</span>
                        </label>
                      </div>
                    </div>

                    <div className="membership-form-row">
                      <div className="membership-form-group membership-type-full">
                        <label className="membership-form-label">Membership Type</label>
                        <select 
                          className="membership-form-select"
                          value={formData.membershipType}
                          onChange={(e) => handleInputChange('membershipType', e.target.value)}
                        >
                          <option>Auto Earned Based Program</option>
                          <option>Manual Assignment</option>
                          <option>Time-based Program</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discount Applies Section */}
                <div className="membership-discount-section">
                  <h3 className="membership-section-header">Discount Applies to</h3>
                  <div className="membership-discount-content">
                    <label className="membership-checkbox-item">
                      <input 
                        type="checkbox"
                        className="membership-checkbox"
                        checked={formData.allowCardDiscount}
                        onChange={(e) => handleInputChange('allowCardDiscount', e.target.checked)}
                      />
                      <span className="membership-checkbox-label">Allow Card Product Discount</span>
                    </label>
                    <label className="membership-checkbox-item">
                      <input 
                        type="checkbox"
                        className="membership-checkbox"
                        checked={formData.allowGameDiscount}
                        onChange={(e) => handleInputChange('allowGameDiscount', e.target.checked)}
                      />
                      <span className="membership-checkbox-label">Allow Game Product Discount</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* New Container for Rows 2 and 3 side by side */}
              <div className="membership-rows-container">
                
                {/* Left Column: Operational Life + Earned Based Program */}
                <div className="membership-second-row">
                  {/* Operational Life Section */}
                  <div className="membership-operational-section">
                    <h3 className="membership-section-header">Operational life of Membership</h3>
                    <div className="membership-operational-content">
  <div className="membership-form-row">
    <div className="membership-form-group">
      <label className="membership-form-label">Starting Date</label>
      <input 
        type="date" 
        className="membership-form-input membership-date-input"
        value={formData.startingDate}
        onChange={(e) => handleInputChange('startingDate', e.target.value)}
      />
    </div>
    <div className="membership-form-group">
      <label className="membership-form-label">End Date</label>
      <input 
        type="date"
        className="membership-form-input membership-date-input"
        value={formData.endDate}
        onChange={(e) => handleInputChange('endDate', e.target.value)}
      />
    </div>
  </div>

  {/* Duration now in next row */}
  <div className="membership-form-row">
    <div className="membership-form-group">
      <label className="membership-form-label">Duration (Days)</label>
      <input 
        type="text"
        className="membership-form-input membership-duration-input"
        value={formData.duration}
        onChange={(e) => handleInputChange('duration', e.target.value)}
      />
    </div>
  </div>
</div>

                  </div>

                  {/* Earned Based Program Section - moved here */}
                  <div className="membership-earned-section">
                    <h3 className="membership-section-header">Earned Based Program Settings</h3>
                    <div className="membership-earned-content">
  <div className="membership-form-row">
    <div className="membership-form-group">
      <label className="membership-form-label">Spending Level</label>
      <input 
        type="text"
        className="membership-form-input membership-spending-input"
        value={formData.spendingLevel}
        onChange={(e) => handleInputChange('spendingLevel', e.target.value)}
      />
    </div>
    <div className="membership-form-group">
      <label className="membership-form-label">Duration (Days)</label>
      <input 
        type="text"
        className="membership-form-input membership-program-duration-input"
        value={formData.programDuration}
        onChange={(e) => handleInputChange('programDuration', e.target.value)}
      />
    </div>
  </div>

  {/* Registration Required moved to next line */}
  <div className="membership-form-row">
    <div className="membership-form-group">
      <label className="membership-checkbox-item">
        <input 
          type="checkbox"
          className="membership-checkbox"
          checked={formData.registrationRequired}
          onChange={(e) => handleInputChange('registrationRequired', e.target.checked)}
        />
        <span className="membership-checkbox-label">Registration Required</span>
      </label>
    </div>
  </div>
</div>

                  </div>
                </div>

                {/* Right Column: Membership Valid */}
                <div className="membership-third-row">
                  <div className="membership-valid-section">
                    <h3 className="membership-section-header">Membership Valid</h3>
                    <div className="membership-valid-content">
                      <div className="membership-time-headers">
                        <span></span>
                        <span>Start</span>
                        <span>End</span>
                      </div>
                      
                      {Object.entries(timeSlots).map(([day, slot]) => (
                        <div key={day} className="membership-time-slot-row">
                          <label className="membership-day-checkbox-label">
                            <input 
                              type="checkbox"
                              className="membership-day-checkbox"
                              checked={slot.enabled}
                              onChange={() => handleDayToggle(day)}
                            />
                            {day}
                          </label>
                          <select 
                            className="membership-time-select"
                            value={slot.start}
                            onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                            disabled={!slot.enabled}
                          >
                            <option>8:00 AM</option>
                            <option>9:00 AM</option>
                            <option>10:00 AM</option>
                            <option>11:00 AM</option>
                            <option>12:00 PM</option>
                          </select>
                          <select 
                            className="membership-time-select"
                            value={slot.end}
                            onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                            disabled={!slot.enabled}
                          >
                            <option>8:00 PM</option>
                            <option>9:00 PM</option>
                            <option>10:00 PM</option>
                            <option>11:00 PM</option>
                            <option>12:00 AM</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated Section */}
          <div className="membership-last-updated-section">
            <div className="membership-last-updated-info">
              <span className="membership-last-updated-label">Last Updated Date :</span>
              <span className="membership-last-updated-value">{formData.lastUpdated}</span>
              <span className="membership-last-updated-label">Last Updated User :</span>
              <span className="membership-last-updated-value">{formData.lastUpdatedUser}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="membership-modal-footer">
          <button className="membership-footer-button membership-save">Save</button>
          <button className="membership-footer-button membership-edit">Edit</button>
          <button className="membership-footer-button membership-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default MembershipSetup;