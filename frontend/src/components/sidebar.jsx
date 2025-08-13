import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import logo from "./assets/logo.png";

// Sidebar icons
import gameIcon from "./assets/ph_game-controller.png";
import productIcon from "./assets/Group 1000003823.png";
import inventoryIcon from "./assets/si_inventory-line.png";
import membershipIcon from "./assets/material-symbols-light_card-membership-outline-rounded.png";
import userIcon from "./assets/Group 1000003831.png";
import reportIcon from "./assets/Group 1000003832.png";
import balanceIcon from "./assets/Group 1000003833.png";
import settingsIcon from "./assets/Group 1000003822.png";
import logoutIcon from "./assets/Logout.png";

function Sidebar() {
  const [openMenu, setOpenMenu] = useState(""); // To track which menu is open

  const toggleSubMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? "" : menuName);
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Menu Items */}
      <div className="menu-container">
        <ul className="sidebar-menu">
          <li><img src={gameIcon} alt="" /> Game Settings</li>

          {/* Products menu with submenu */}
          <li
            className={`settings-item ${openMenu === "products" ? "active" : ""}`}
            onClick={() => toggleSubMenu("products")}
          >
            <img src={productIcon} alt="" /> Products
          </li>
          {openMenu === "products" && (
            <div style={{ position: "relative" }}>
              <div className="submenu-line"></div>
              <ul className="submenu">
                <li>
                  <Link to="/card-product" style={{ textDecoration: "none", color: "inherit" }}>
                    Card Product
                  </Link>
                </li>
                <li>Coin Product</li>
                <li>Time Product</li>
                <li>Item Product</li>
                <li>LED Product</li>
                <li>Sticker Product</li>
                <li>Combo Product</li>
              </ul>
            </div>
          )}

          <li><img src={inventoryIcon} alt="" /> Inventory</li>
          <li><img src={membershipIcon} alt="" /> Membership</li>
          <li><img src={userIcon} alt="" /> User Settings</li>
          <li><img src={reportIcon} alt="" /> Reports</li>
          <li><img src={balanceIcon} alt="" /> Check Balance</li>

          {/* Settings menu with submenu */}
          <li
            className={`settings-item ${openMenu === "settings" ? "active" : ""}`}
            onClick={() => toggleSubMenu("settings")}
          >
            <img src={settingsIcon} alt="" /> Settings
          </li>
          {openMenu === "settings" && (
            <div style={{ position: "relative" }}>
              <div className="submenu-line"></div>
              <ul className="submenu">
                <li>
                  <Link to="/location-table" style={{ textDecoration: "none", color: "inherit" }}>
                    Location Table
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </ul>
      </div>

      {/* Bottom Divider + Logout */}
      <div className="sidebar-bottom">
        <div className="sidebar-divider"></div>
        <ul className="sidebar-logout">
          <li>
            <img src={logoutIcon} alt="Logout" /> Logout
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
