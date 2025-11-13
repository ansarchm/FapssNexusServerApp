import React from "react";
import "./EmailReportpopup.css";
import scheduleIcon from "../components/assets/schedule_icon.png";

const PopupForm = ({ onClose }) => {
  return (
    <div className="editreportpop-overlay">
      <div className="editreportpop-form">
        {/* Header */}
        <div className="editreportpop-header">
          <div className="header-left">
            <img
              src={scheduleIcon}
              alt="schedule icon"
              className="schedule-icon"
            />
            <h3>Schedule Report</h3>
          </div>
          <span className="editreportpop-close" onClick={onClose}>
            ✕
          </span>
        </div>

        {/* Body */}
        <div className="editreportpop-body">
          <div className="form-container">
            {/* Row 1 */}
            <div className="form-row">
              <div className="form-group">
                <label>ID</label>
                <input type="text" placeholder="123" className="id-box" />
              </div>

              <div className="form-group">
                <label>Schedule Name</label>
                <input type="text" placeholder="Workday Schedule" />
              </div>

              <div className="form-group">
                <label>Run Type</label>
                <select>
                  <option>Time Event</option>
                  <option>Manual</option>
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="form-row">
              <div className="form-group">
                <label>Frequency</label>
                <select>
                  <option>Every Day</option>
                  <option>Every Week</option>
                  <option>Every Month</option>
                </select>
              </div>

              <div className="form-group runat-wrapper">
                <label>Run At</label>
                <div className="time-input-container">
                  <input
                    type="time"
                    step="1"
                    defaultValue="00:00:00"
                    className="no-clock"
                  />
                  <div className="time-arrows">
                    <span className="arrow-up">▲</span>
                    <span className="arrow-down">▼</span>
                  </div>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>Active</label>
                <input type="checkbox" defaultChecked className="white-tick" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="editreportpop-divider"></div>

        {/* Footer */}
        <div className="editreportpop-footer">
          <button className="btn-save">Save</button>
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;