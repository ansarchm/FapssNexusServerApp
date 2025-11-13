import React from "react";
import { useLocation } from "react-router-dom";
import "./topbar.css";

// Import assets
import breadcrumbIcon from "./assets/Group 1000003826.png";
import notificationIcon from "./assets/Group 418.png";
import dropdownIcon from "./assets/Group 39.png";
import profileImage from "./assets/Ellipse 3.png";
import helpIcon from "./assets/help-icon.png";
import backIcon from "./assets/back-icon.png";
import reportIcon from "./assets/reportIcon.png";
import walletCheckIcon from "./assets/wallet-check.png"; // ✅ Wallet icon
import { Check } from "lucide-react";

function TopBar() {
  const location = useLocation();

  // Map routes to breadcrumb structure
  const breadcrumbMap = {
    "/location-table": ["Settings", "Location Table"],
    "/code-development": ["Settings", "Code & Development"],
    "/add-location": ["Settings", "Location Table", "Location info"],
    "/edit-location": ["Settings", "Location Table", "Edit Location"],
    "/card-product": ["Products", "Card Product"],
    "/display-group":["Products","Display Group"],
    "/coin-product": ["Products", "Coin Product"],
    "/time-product": ["Products", "Time Product"],
    "/item-product": ["Products", "Item Product"],
    "/led-product": ["Products", "LED Product"],
    "/sticker-product": ["Products", "Sticker Product"],
    "/combo-product": ["Products", "Combo Product"],
    "/game-Cat": ["Products", "Combo Product"],
    "/transaction":["Check Balance","Transaction"],
    "/check-balance": ["Check Balance"], // ✅ Wallet breadcrumb
    // Add more routes as needed
  };

  const currentPath = location.pathname;
  const breadcrumbs = breadcrumbMap[currentPath] || ["Settings"];

  return (
    <div className="topbar-container">
      {/* -------- Top Section -------- */}
      <div className="topbar-main">
        <div className="topbar-left"></div>

        <div className="topbar-right">
          {/* Help */}
          <div className="help-section">
            <img src={helpIcon} alt="Help" className="help-icon" />
            <span className="help-text">Help</span>
          </div>

          <img
            src={notificationIcon}
            alt="Notifications"
            className="notification-icon"
          />

          <div className="profile-section">
            <div className="profile-info">
              <span className="profile-name">Muhammed Mubin</span>
              <span className="profile-role">Manager</span>
            </div>
            <img src={profileImage} alt="Profile" className="profile-img" />
            <img src={dropdownIcon} alt="Dropdown" className="dropdown-icon" />
          </div>
        </div>
      </div>

      {/* -------- Breadcrumb Section -------- */}
      <div className="breadcrumb">
        <img src={backIcon} alt="Back" className="back-icon" />

        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span
              className={index === breadcrumbs.length - 1 ? "active" : "inactive"}
              style={{ display: "flex", alignItems: "center", gap: "5px" }} // ✅ Align icon + text
            >
              {/* Show report icon */}
              {index === breadcrumbs.length - 1 && crumb === "Reports" && (
                <img
                  src={reportIcon}
                  alt="Report"
                  className="breadcrumb-report-icon"
                  style={{ width: "16px", height: "16px" }}
                />
              )}

              {/* Show wallet-check icon */}
              {index === breadcrumbs.length - 1 && crumb === "Check Balance" && (
                <img
                  src={walletCheckIcon}
                  alt="Wallet Check"
                  className="breadcrumb-wallet-icon"
                  style={{ width: "22px", height: "24px" }}
                />
              )}

              {crumb}
            </span>

            {/* Separator */}
            {index < breadcrumbs.length - 1 && (
              <img
                src={breadcrumbIcon}
                alt="Breadcrumb Icon"
                className="breadcrumb-icon"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default TopBar;
