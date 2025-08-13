import React from "react";
import { useLocation } from "react-router-dom";
import "./topbar.css";

// Import assets
import breadcrumbIcon from "./assets/Group 1000003826.png";
import notificationIcon from "./assets/Group 418.png";
import dropdownIcon from "./assets/Group 39.png";
import profileImage from "./assets/Ellipse 3.png";

function TopBar() {
  const location = useLocation();

  // Map routes to breadcrumb structure
  const breadcrumbMap = {
    "/location-table": ["Settings", "Location Table"],
    "/add-location": ["Settings", "Location Table", "Location info"],
    "/edit-location": ["Settings", "Location Table", "Edit Location"],
      "/card-product": ["Products", "Card Product"],

   
    // Add more routes as needed
  };

  const currentPath = location.pathname;
  const breadcrumbs = breadcrumbMap[currentPath] || ["Settings"];

  return (
    <div className="topbar-container">
      {/* -------- Top Section (Notification + Profile + Dropdown) -------- */}
      <div className="topbar-main">
        <div className="topbar-right">
          <img src={notificationIcon} alt="Notifications" className="icon" />
          <img src={profileImage} alt="Profile" className="profile-img" />
          <img src={dropdownIcon} alt="Dropdown" className="dropdown-icon" />
        </div>
      </div>

      {/* -------- Bottom Section (Breadcrumbs) -------- */}
      <div className="breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span className={index === breadcrumbs.length - 1 ? "active" : "inactive"}>
              {crumb}
            </span>
            {index < breadcrumbs.length - 1 && (
              <img src={breadcrumbIcon} alt="Breadcrumb Icon" className="breadcrumb-icon" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default TopBar;
