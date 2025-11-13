import React, { useState } from "react";
import "./membership.css";
import MembershipSetup from "./membershipadd"; // Import the modal component

import searchIcon from "../../components/assets/search.png";
import membershipIcon from "../../components/assets/membership.png";

// Sample membership data
const data = Array.from({ length: 15 }, (_, index) => ({
  select: index % 3 === 0,
  id: 20 + index,
  membership: "Gold Member",
  description: "Valid for VIP Customers Only",
  active: true,
  membershipType: index % 4 === 0 ? "Auto Earned Based Program" : 
                  index % 4 === 1 ? "Purchase Based Program" :
                  index % 4 === 2 ? "Game Played Earned Based Program" : 
                  "Season Pass",
  lastUpdatedDate: "09-Dec-2024",
  lastUpdatedUser: "Mubin"
}));

const HeaderCell = ({ label }) => (
  <div className="membership-header-container">
    <span className="membership-header-text">{label}</span>
    <div className="membership-sort-icons">
      <span className="membership-arrow membership-up1"></span>
      <span className="membership-arrow membership-down1"></span>
    </div>
  </div>
);

const MembershipScreen = () => {
  const [membershipFilter, setMembershipFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Add state for modal

  return (
    <div className="membership-table-wrapper">
      {/* Section Header */}
      <div className="membership-section-headers">
        <div className="membership-section-title-container">
          <img src={membershipIcon} alt="Membership Icon" className="membership-section-icon" /> 
          <h2 className="membership-section-title">Membership</h2>
          <div className="membership-checkbox-container"></div>
        </div>
      </div>

      {/* Action Row */}
      <div className="membership-header-actions">
        {/* Search box */}
        <div className="membership-search-container2">
          <img src={searchIcon} alt="Search" className="membership-search-input2-icon" />
          <input
            type="text"
            placeholder="Search"
            value={membershipFilter}
            onChange={(e) => setMembershipFilter(e.target.value)}
            className="membership-search-input2"
          />
        </div>

        {/* Action Buttons */}
        <div className="membership-action-buttons">
          <button
            className="membership-btn-add"
            onClick={() => setIsModalOpen(true)} // Open modal instead of navigate
          >
            Add
          </button>
          <button 
            className="membership-btn-add"
            onClick={() => setIsModalOpen(true)} // Open modal
          >
            Save
          </button>
          <button className="membership-btn-refresh">
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="membership-table-scroll">
        <table className="membership-custom-table">
          <thead>
            <tr>
              <th><HeaderCell label="Active" /></th>
              <th><HeaderCell label="Id" /></th>
              <th><HeaderCell label="Membership" /></th>
              <th><HeaderCell label="Description" /></th>
              <th><HeaderCell label="Membership Type" /></th>
              <th><HeaderCell label="Last Updated User" /></th>
              <th><HeaderCell label="Last Updated Date" /></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" style={{textAlign: 'center', padding: '40px', color: '#999'}}>
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.active} 
                      readOnly 
                      className="membership-active-checkbox" 
                    />
                  </td>
                  <td>{row.id}</td>
                  <td>{row.membership}</td>
                  <td>{row.description}</td>
                  <td>
                    <div className="membership-type-box">{row.membershipType}</div>
                  </td>
                  <td>{row.lastUpdatedUser}</td>
                  <td>{row.lastUpdatedDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Membership Modal */}
      <MembershipSetup 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default MembershipScreen;