import React, { useState } from "react";
import "./AddLocation.css";
import locationIcon from '../components/assets/venue.png';
import hoursIcon from '../components/assets/91 2.png';
import openingIcon from '../components/assets/91 4.png';
import closingIcon from '../components/assets/91 3.png';

const CustomTimeInput = () => {
  const [timeValue, setTimeValue] = useState("00:00:01");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const formatTime = (h, m, s) =>
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

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
    <div className="time-group">
      <input
        type="text"
        value={timeValue}
        className="time-picker"
        onClick={handleSelect}
        onKeyUp={handleSelect}
        readOnly
      />
      <div className="arrow-buttons">
        <button type="button" className="arrow up" onClick={increaseTime}>▲</button>
        <button type="button" className="arrow down" onClick={decreaseTime}>▼</button>
      </div>
    </div>
  );
};

function LocationForm() {
  const [formData, setFormData] = useState({
    location: "Allbaron Rides",
    email: "",
    address: "",
    postalCode: "",
    contactName: "",
    phone: "",
    city: "",
    state: ""
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error on input
    if (value.trim() !== "") {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]*[(]?\d{1,4}[)]?[-\s./0-9]*$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = "Valid email is required";
    }
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.postalCode.trim()) errors.postalCode = "Postal code is required";
    if (!formData.contactName.trim()) errors.contactName = "Contact name is required";
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      errors.phone = "Valid phone number is required";
    }
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
      // Submit logic here
    }
  };

  return (
    <div className="location-wrapper">
      <div className="location-card">
        <div className="table-structure">

          {/* Left Column */}
          <div className="column left-column">
            <h3>
              <img src={locationIcon} alt="Location Icon" className="icon" />
              Location Info
            </h3>
            <div className="column-content">
              <div className="row">
                <div className="cell">
                  <label>Location</label>
                  <select name="location" value={formData.location} onChange={handleInputChange}>
                    <option>Allbaron Rides</option>
                  </select>
                </div>
                <div className="cell">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="mubin@test.in"
                  />
                  {formErrors.email && <span className="error">{formErrors.email}</span>}
                </div>
              </div>

              <div className="row">
                <div className="cell">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  {formErrors.address && <span className="error">{formErrors.address}</span>}
                </div>
                <div className="cell">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                  {formErrors.postalCode && <span className="error">{formErrors.postalCode}</span>}
                </div>
              </div>

              <div className="row">
                <div className="cell">
                  <label>Contact Name</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="Muhammed Mubin"
                  />
                  {formErrors.contactName && <span className="error">{formErrors.contactName}</span>}
                </div>
                <div className="cell">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+99 3456 8976"
                  />
                  {formErrors.phone && <span className="error">{formErrors.phone}</span>}
                </div>
              </div>

              <div className="row">
                <div className="cell">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Amman"
                  />
                  {formErrors.city && <span className="error">{formErrors.city}</span>}
                </div>
                <div className="cell">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                  {formErrors.state && <span className="error">{formErrors.state}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="column right-column">
            <h3>
              <img src={hoursIcon} alt="Hours Icon" className="icon" />
              Operation Hours
            </h3>
            <div className="column-content">
              <div className="op-row header">
                <span>
                  <img src={openingIcon} alt="Opening Icon" className="time-icon" />
                  Opening Time
                </span>
                <span>
                  <img src={closingIcon} alt="Closing Icon" className="time-icon" />
                  Closing Time
                </span>
              </div>

              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <div className="op-row" key={day}>
                  <label>{day}</label>
                  <CustomTimeInput />
                  <CustomTimeInput />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="save-btn" onClick={handleSubmit}>Save</button>
          <button className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default LocationForm;
