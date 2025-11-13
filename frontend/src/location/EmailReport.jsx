import React, { useState } from "react";
import "./EmailReport.css";
import scheduleIcon from "../components/assets/schedule_icon.png";

import Blue from "../components/assets/blue.png";
import PopupForm from "./EmailReportpopup.jsx";

const ScheduleReports = () => {
  const [showPopup, setShowPopup] = useState(false);

  const reports = [
    {
      id: 1,
      name: "Workday schedule",
      runType: "Time Event",
      frequency: "Every Day",
      runAt: "2:00 AM",
    },
    {
      id: 2,
      name: "Daily schedule",
      runType: "Time Event",
      frequency: "Every Day",
      runAt: "2:00 AM",
    },
    {
      id: 3,
      name: "Workday schedule",
      runType: "Time Event",
      frequency: "Every Day",
      runAt: "2:00 AM",
    },
    {
      id: 4,
      name: "Daily schedule",
      runType: "Time Event",
      frequency: "Every Day",
      runAt: "2:00 AM",
    },
  ];

  return (
    <div className="schedule-page">
      {/* Heading OUTSIDE the white container, left aligned */}
      <div className="schedule-header">
        <img src={scheduleIcon} alt="schedule icon" className="schedule-icon" />
        <h2 className="schedule-title">Schedule Reports</h2>
      </div>

      {/* White container (table + controls) */}
      <div className="schedule-container">
        <div className="schedule-action-bar">
          <div className="schedule-actions">
            <button className="btn btn-edit">Edit</button>
            <button className="btn btn-add" onClick={() => setShowPopup(true)}>
              Add
            </button>
            <button className="btn btn-delete">Delete</button>
            <button className="btn btn-refresh">Refresh</button>
          </div>
        </div>

        <table className="schedule-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Schedule Name</th>
              <th>Run Type</th>
              <th>Frequency</th>
              <th>Run At</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.name}</td>
                <td>{report.runType}</td>
                <td>{report.frequency}</td>
                <td>{report.runAt}</td>
                <td>
                  <div className="active-section">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="white-tick"
                    />
                    <div className="active-item">
                      <img src={Blue} alt="icon" className="blue-icon" />
                      <span>Reports</span>
                    </div>
                    <div className="active-item">
                      <img src={Blue} alt="icon" className="blue-icon" />
                      <span>Emails</span>
                    </div>
                    <div className="active-item">
                      <img src={Blue} alt="icon" className="blue-icon" />
                      <span>Sites</span>
                    </div>
                    <span className="manual-text">Run Manually</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Popup Form */}
        {showPopup && <PopupForm onClose={() => setShowPopup(false)} />}
      </div>
    </div>
  );
};

export default ScheduleReports;
