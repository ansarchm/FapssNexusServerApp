import React, { useState } from "react";
import "./AddLocation.css";
import locationIcon from "../components/assets/location1.png";

// ✅ Time Picker Component
const CustomTimeInput = () => {
  const [timeValue, setTimeValue] = useState("00:00:01");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const formatTime = (h, m, s) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  const increaseTime = () => {
    let [h, m, s] = timeValue.split(":").map(Number);
    if (selectedIndex === 0) h = (h + 1) % 24;
    if (selectedIndex === 1) m = (m + 1) % 60;
    if (selectedIndex === 2) s = (s + 1) % 60;
    setTimeValue(formatTime(h, m, s));
  };

  const decreaseTime = () => {
    let [h, m, s] = timeValue.split(":").map(Number);
    if (selectedIndex === 0) h = (h - 1 + 24) % 24;
    if (selectedIndex === 1) m = (m - 1 + 60) % 60;
    if (selectedIndex === 2) s = (s - 1 + 60) % 60;
    setTimeValue(formatTime(h, m, s));
  };

  const handleSelect = (e) => {
    const position = e.target.selectionStart;
    if (position <= 2) setSelectedIndex(0);
    else if (position <= 5) setSelectedIndex(1);
    else setSelectedIndex(2);
  };

  return (
    <div className="location-add-time-group">
      <input
        type="text"
        value={timeValue}
        className="location-add-time-picker"
        onClick={handleSelect}
        onKeyUp={handleSelect}
        readOnly
      />
      <div className="location-add-arrow-buttons3">
        <button type="button" className="location-add-arrow-up3" onClick={increaseTime}>
          ▲
        </button>
        <button type="button" className="location-add-arrow-down3" onClick={decreaseTime}>
          ▼
        </button>
      </div>
    </div>
  );
};

function LocationForm({ onClose }) {   // ✅ Accept onClose from parent
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully!");
    onClose(); // ✅ close popup after save
  };

  return (
    <div className="location-add-location-wrapper">
      <div className="location-add-location-card">
        {/* ✅ Header with Location Info and Close Button */}
        <div className="location-add-form-header">
          <div className="location-add-header-left">
            <img src={locationIcon} alt="Location" className="location-header-icon" />
            <h2 className="location-add-form-title">Location Info</h2>
          </div>
          <button 
            className="location-add-close-btn"
            onClick={onClose}  // ✅ use parent handler
            type="button"
          >
            ✕
          </button>
        </div>

        {/* ✅ Divider Line */}
        <div className="location-add-divider"></div>

        {/* ✅ Table Structure */}
        <div className="location-add-table-structure">
          {/* Left Column */}
          <div className="location-add-column location-add-left-column">
            <div className="location-add-column-header location-add-heading">Location Info</div>
            <div className="location-add-column-content">
              <div className="location-add-row">
                <div className="location-add-cell">
                  <label className="location-add-heading">Location</label>
                  <input type="text" value="Spacecity" readOnly />
                </div>
                <div className="location-add-cell">
                  <label className="location-add-heading">Contact Name</label>
                  <input type="text" value="Ishaq Assfour" readOnly />
                </div>
              </div>

              <div className="location-add-row">
                <div className="location-add-cell">
                  <label className="location-add-heading">Address 1</label>
                  <input type="text" placeholder="Street 60" />
                </div>
                <div className="location-add-cell">
                  <label className="location-add-heading">Address 2</label>
                  <input type="text" placeholder="Sahab" />
                </div>
              </div>

              <div className="location-add-row">
                <div className="location-add-cell">
                  <label className="location-add-heading">City</label>
                  <input type="text" placeholder="Amman" />
                </div>
                <div className="location-add-cell">
                  <label className="location-add-heading">Country</label>
                  <input type="text" placeholder="Jordan" />
                </div>
              </div>

              <div className="location-add-row">
                <div className="location-add-cell">
                  <label className="location-add-heading">Email</label>
                  <input type="email" placeholder="info@spacecity.com" />
                </div>
                <div className="location-add-cell">
                  <label className="location-add-heading">Phone</label>
                  <input type="text" placeholder="+966 2345 67890" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - FIXED LAYOUT */}
          <div className="location-add-column location-add-right-column">
            <div className="location-add-column-header location-add-heading">Operation Hours</div>
            <div className="location-add-column-content">
              <div className="location-add-op-header-row">
                <div className="location-add-op-header-item">
                  <span className="location-add-heading">Opening Time</span>
                </div>
                <div className="location-add-op-header-item">
                  <span className="location-add-heading">Closing Time</span>
                </div>
              </div>

              {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((day) => (
                <div className="location-add-op-row" key={day}>
                  <label className="location-add-heading">{day}</label>
                  <div className="location-add-time-container">
                    <CustomTimeInput />
                  </div>
                  <div className="location-add-time-container">
                    <CustomTimeInput />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Others Section - FIXED LAYOUT */}
        <div className="location-add-others-section">
          <div className="location-add-column-header location-add-heading">Others</div>
          <div className="location-add-others-content">
            <div className="location-add-others-row">
              <label className="location-add-others-label">Phone Number Digits</label>
              <input 
                type="number" 
                value="10" 
                className="location-add-others-input" 
                readOnly 
              />
            </div>
            <div className="location-add-others-row">
              <label className="location-add-others-label">Week starts on</label>
              <select className="location-add-others-select">
                <option>Monday</option>
                <option>Sunday</option>
                <option>Saturday</option>
              </select>
            </div>
          </div>
        </div>

        {/* Divider Line before Buttons */}
        <div className="location-add-divider"></div>

        {/* Action Buttons */}
        <div className="location-add-form-actions">
          <button className="location-add-save-btn" onClick={handleSubmit}>Save</button>
          <button className="location-add-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default LocationForm;
