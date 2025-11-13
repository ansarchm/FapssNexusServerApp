import React, { useState } from "react";
import "./userdetailsadd.css";
import { useNavigate } from "react-router-dom";

import cancelIcon from '../../components/assets/iconoir_cancel.png'; 
import userIcon from "../../components/assets/user.png";

const UserDetails = () => {
  
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/userlist"); // route to your UserList page
  };

  // User data state
  const [userData, setUserData] = useState({
    active: true,
    userId: "425",
    firstName: "Mubin",
    lastName: "Mohammed",
    userRole: "System Administrator",
    location: "Albaron 1",
    employeeId: "172395",
    dateOfBirth: "09-08-2025",
    userName: "Mubin",
    password: "••••••••",
    confirmPassword: "••••••••",
    changePasswordOnNextLogin: true,
    cardNumber: "3456YH23",
    accessProfile: "Redemption Only",
    courtesyType: "Day",
    courtesyCount: "50",
    allowCourtesyPlay: false
  });

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field) => {
    setUserData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="user-details-modal-overlay">
      <div className="user-details-modal-container">
        {/* Header */}
        <div className="user-details-modal-header">
          <div className="user-details-header-title">
            <img src={userIcon} alt="User Icon" className="user-details-user-icon" />
            <h2 className="user-details-title-text">User Details</h2>
          </div>
          <button onClick={handleClose} className="user-details-close-button">
            <img src={cancelIcon} alt="Close" className="user-details-close" />
          </button>
        </div>

        {/* Content Area */}
        <div className="user-details-modal-content">
          <div className="user-details-content-wrapper">
            <div className="user-details-main-sections">
              
              {/* General Settings Section */}
              <div className="user-details-general-section">
                <div className="user-details-section-header">General Settings</div>
                <div className="user-details-general-content">
                  
                  {/* First Row */}
                  <div className="user-details-form-row">
                    <div className="user-details-checkbox-item">
                      <input
                        type="checkbox"
                        className="user-details-checkbox"
                        checked={userData.active}
                        onChange={() => handleCheckboxChange('active')}
                      />
                      <span className="user-details-checkbox-label">Active</span>
                    </div>
                    
                    <div className="user-details-form-group">
                      <label className="user-details-form-label">User ID</label>
                      <input
                        type="text"
                        value={userData.userId}
                        onChange={(e) => handleInputChange('userId', e.target.value)}
                        className="user-details-form-input user-details-user-id-input"
                      />
                    </div>
                    
                    <div className="user-details-form-group">
                      <label className="user-details-form-label">First Name</label>
                      <input
                        type="text"
                        value={userData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="user-details-form-input user-details-first-name-input"
                      />
                    </div>
                    
                    <div className="user-details-form-group">
                      <label className="user-details-form-label">Last Name</label>
                      <input
                        type="text"
                        value={userData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="user-details-form-input user-details-last-name-input"
                      />
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="user-details-form-row">
                    <div className="user-details-form-group">
                      <label className="user-details-form-label">User Role</label>
                      <select 
                        value={userData.userRole}
                        onChange={(e) => handleInputChange('userRole', e.target.value)}
                        className="user-details-form-select user-details-user-role-select"
                      >
                        <option>System Administrator</option>
                        <option>Manager</option>
                        <option>Cashier</option>
                      </select>
                    </div>
                    
                    <div className="user-details-form-group">
                      <label className="user-details-form-label">Location</label>
                      <select 
                        value={userData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="user-details-form-select user-details-location-select"
                      >
                        <option>Albaron 1</option>
                        <option>Albaron 2</option>
                        <option>Main Branch</option>
                      </select>
                    </div>
                    
                    <div className="user-details-form-group">
                      <label className="user-details-form-label">Employee ID</label>
                      <input
                        type="text"
                        value={userData.employeeId}
                        onChange={(e) => handleInputChange('employeeId', e.target.value)}
                        className="user-details-form-input user-details-employee-id-input"
                      />
                    </div>
                  </div>

                  {/* Third Row */}
                  <div className="user-details-form-row">
                    <div className="user-details-form-group">
                      <label className="user-details-form-label">Date of Birth</label>
                      <input
                        type="text"
                        value={userData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="user-details-form-input user-details-date-birth-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row - Login Settings and Employee Card */}
              <div className="user-details-bottom-row">
                
                {/* Login Settings Section */}
                <div className="user-details-login-section">
                  <div className="user-details-section-header">Log in settings</div>
                  <div className="user-details-login-content">
                    
                    <div className="user-details-form-group">
                      <label className="user-details-form-label">User Name</label>
                      <input
                        type="text"
                        value={userData.userName}
                        onChange={(e) => handleInputChange('userName', e.target.value)}
                        className="user-details-form-input user-details-username-input"
                      />
                    </div>
                    
                    <div className="user-details-form-group">
                      <label className="user-details-form-label">Password</label>
                      <input
                        type="password"
                        value={userData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="user-details-form-input user-details-password-input"
                      />
                    </div>
                    
                    <div className="user-details-form-group">
                      <label className="user-details-form-label">Confirm Password</label>
                      <input
                        type="password"
                        value={userData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="user-details-form-input user-details-confirm-password-input"
                      />
                    </div>
                    
                
<div class="user-details-change-password-row">
    <label class="user-details-checkbox-label">Change Password On Next Log In</label>
    <input type="checkbox" class="user-details-checkbox" />
</div>
                  </div>
                </div>

{/* Employee Card Section */}
<div className="user-details-employee-card-section">
  <div className="user-details-section-header">Employee Card</div>
  <div className="user-details-employee-card-content">
    
    {/* Main container with two columns */}
    <div className="user-details-employee-card-main-row">
      
      {/* Left side - Form fields */}
      <div className="user-details-employee-card-left">
        
        {/* Card Number Row */}
        <div className="user-details-form-row">
          <div className="user-details-form-group">
            <label className="user-details-form-label">Card Number</label>
            <input
              type="text"
              value={userData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              className="user-details-form-input user-details-card-number-input"
            />
          </div>
        </div>
        
        {/* Access Profile Row */}
        <div className="user-details-form-row">
          <div className="user-details-form-group">
            <label className="user-details-form-label">Access Profile</label>
            <select 
              value={userData.accessProfile}
              onChange={(e) => handleInputChange('accessProfile', e.target.value)}
              className="user-details-form-select user-details-access-profile-select"
            >
              <option>Redemption Only</option>
              <option>Full Access</option>
              <option>Limited Access</option>
            </select>
          </div>
        </div>
        
        {/* Courtesy Type Row */}
        <div className="user-details-form-row">
          <div className="user-details-form-group">
            <label className="user-details-form-label">Courtesy Type</label>
            <select 
              value={userData.courtesyType}
              onChange={(e) => handleInputChange('courtesyType', e.target.value)}
              className="user-details-form-select user-details-courtesy-type-select"
            >
              <option>Day</option>
              <option>Week</option>
              <option>Month</option>
            </select>
          </div>
        </div>
        
        {/* Courtesy Count Row */}
        <div className="user-details-form-row">
          <div className="user-details-form-group">
            <label className="user-details-form-label">Courtesy Count</label>
            <input
              type="text"
              value={userData.courtesyCount}
              onChange={(e) => handleInputChange('courtesyCount', e.target.value)}
              className="user-details-form-input user-details-courtesy-count-input"
            />
          </div>
        </div>
        
        {/* Remove Allow Courtesy Play Checkbox from here - it's now moved to right side */}
        
      </div>
      
      {/* Right side - Photo section */}
      <div className="user-details-photo-section">
        <div className="user-details-photo-header">Photo</div>
        <div className="user-details-photo-placeholder"></div>
        <button className="user-details-reset-button">Reset</button>
        
        {/* Allow Courtesy Play Checkbox - Moved here */}
        <div className="user-details-checkbox-item user-details-allow-courtesy-row">
          <input
            type="checkbox"
            className="user-details-checkbox"
            checked={userData.allowCourtesyPlay}
            onChange={() => handleCheckboxChange('allowCourtesyPlay')}
          />
          <span className="user-details-checkbox-label">Allow Courtesy Play</span>
        </div>
      </div>
      
    </div>
  </div>
</div>
              </div>

              {/* Last Updated Section */}
              <div className="user-details-last-updated-section">
                <div className="user-details-last-updated-info">
                  <span className="user-details-last-updated-label">Updated User :</span>
                  <span className="user-details-last-updated-value">Abdullah</span>
                  <span className="user-details-last-updated-label">Updated Date :</span>
                  <span className="user-details-last-updated-value">23-07-2025</span>
                </div>
              </div>

              {/* Footer */}
              <div className="user-details-modal-footer">
                <button className="user-details-footer-button user-details-edit">Edit</button>
                <button className="user-details-footer-button user-details-save">Save</button>
                <button className="user-details-footer-button user-details-cancel">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;