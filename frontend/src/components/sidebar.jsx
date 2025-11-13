import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation(); // Get current route

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
          {/* Game Settings with submenu */}
          <li 
            className={`settings-item ${openMenu === "games" ? "active" : ""}`}
            onClick={() => toggleSubMenu("games")}
          >
            <img src={gameIcon} alt="" />
            Game Settings
          </li>
          {openMenu === "games" && (
            <div className="submenu-container">
              <ul className="submenu">
                <li className={location.pathname === "/games" ? "active" : ""}>
                  <Link to="/games" style={{ textDecoration: "none", color: "inherit" }}>
                    Games
                  </Link>
                </li>
                <li className={location.pathname === "/game-Category" ? "active" : ""}>
                  <Link to="/game-Category" style={{ textDecoration: "none", color: "inherit" }}>
                    Game Category
                  </Link>
                </li>
                <li className={location.pathname === "/accessprofile" ? "active" : ""}>
                  <Link to="/accessprofile" style={{ textDecoration: "none", color: "inherit" }}>
                    Access Profile
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Products menu with submenu */}
          <li 
            className={`settings-item ${openMenu === "products" ? "active" : ""}`}
            onClick={() => toggleSubMenu("products")}
          >
            <img src={productIcon} alt="" />
            Products
          </li>
          {openMenu === "products" && (
            <div className="submenu-container">
              <ul className="submenu">
                <li className={location.pathname === "/card-product" ? "active" : ""}>
                  <Link to="/card-product" style={{ textDecoration: "none", color: "inherit" }}>
                    Card Product
                  </Link>
                </li>
                <li className={location.pathname === "/coin-product" ? "active" : ""}>
                  <Link to="/coin-product" style={{ textDecoration: "none", color: "inherit" }}>
                    Coin Product
                  </Link>
                </li>
                <li className={location.pathname === "/time-product" ? "active" : ""}>
                  <Link to="/time-product" style={{ textDecoration: "none", color: "inherit" }}>
                    Time Product
                  </Link>
                </li>
                <li className={location.pathname === "/item-product" ? "active" : ""}>
                  <Link to="/item-product" style={{ textDecoration: "none", color: "inherit" }}>
                    Item Product
                  </Link>
                </li>
                <li className={location.pathname === "/led-product" ? "active" : ""}>
                  <Link to="/led-product" style={{ textDecoration: "none", color: "inherit" }}>
                    LED Product
                  </Link>
                </li>
                <li className={location.pathname === "/sticker-product" ? "active" : ""}>
                  <Link to="/sticker-product" style={{ textDecoration: "none", color: "inherit" }}>
                    Sticker Product
                  </Link>
                </li>
                <li className={location.pathname === "/combo-product" ? "active" : ""}>
                  <Link to="/combo-product" style={{ textDecoration: "none", color: "inherit" }}>
                    Combo Product
                  </Link>
                </li>      {/* Separator line */}
                <div className="submenu-separator"></div>
                <li className={location.pathname === "/display-group" ? "active" : ""}>
                  <Link
                    to="/display-group"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Display Group
                  </Link>
                </li>
                  {/* Separator line before Tax Category */}
      <div className="submenu-separator"></div>

      <li className={location.pathname === "/tax-category" ? "active" : ""}>
        <Link
          to="/tax-category"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Tax Category
        </Link>
      </li>
              </ul>
            </div>
          )}

          {/* Inventory menu with submenu */}
          <li 
            className={`settings-item ${openMenu === "inventory" ? "active" : ""}`}
            onClick={() => toggleSubMenu("inventory")}
          >
            <img src={inventoryIcon} alt="" />
            Inventory
          </li>
          {openMenu === "inventory" && (
            <div className="submenu-container">
              <ul className="submenu">
                <li className={location.pathname === "/stock" ? "active" : ""}>
                  <Link to="/stock" style={{ textDecoration: "none", color: "inherit" }}>
                    Stocks
                  </Link>
                </li>
              </ul>
            </div>
          )}
   <li 
  className={`settings-item ${openMenu === "membership" ? "active" : ""}`}
  onClick={() => toggleSubMenu("membership")}
>
  <Link 
    to="/membership" 
    style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", width: "100%" }}
    onClick={() => setOpenMenu("")} // this will close other open menus
  >
    <img src={membershipIcon} alt="" />
    Membership
  </Link>
</li>



          {/* User Settings with submenu */}
          <li 
            className={`settings-item ${openMenu === "userSettings" ? "active" : ""}`}
            onClick={() => toggleSubMenu("userSettings")}
          >
            <img src={userIcon} alt="" />
            User Settings
          </li>
          {openMenu === "userSettings" && (
            <div className="submenu-container">
              <ul className="submenu">
                <li className={location.pathname === "/userlist" ? "active" : ""}>
                  <Link to="/userlist" style={{ textDecoration: "none", color: "inherit" }}>
                    User
                  </Link>
                </li>
                <li className={location.pathname === "/userrole" ? "active" : ""}>
                  <Link to="/userrole" style={{ textDecoration: "none", color: "inherit" }}>
                    User Role
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <li className={location.pathname === "/reports" ? "active" : ""}>
                  <Link to="/reports" style={{ textDecoration: "none", color: "inherit" }}>
            <img src={reportIcon} alt="" />
            Reports
            </Link>
          </li>
            <li className={location.pathname === "/check-balance" ? "active" : ""}>
            <Link
              to="/check-balance"
              style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}
            >
              <img src={balanceIcon} alt="" />
              Check Balance
            </Link>
          </li>


          {/* Settings menu with submenu */}
          <li 
            className={`settings-item ${openMenu === "settings" ? "active" : ""}`}
            onClick={() => toggleSubMenu("settings")}
          >
            <img src={settingsIcon} alt="" />
            Settings
          </li>
          {openMenu === "settings" && (
            <div className="submenu-container">
              <ul className="submenu">
                <li className={location.pathname === "/location-table" ? "active" : ""}>
                  <Link to="/location-table" style={{ textDecoration: "none", color: "inherit" }}>
                    Location Table
                  </Link>
                </li>
                <li className={location.pathname === "/code-development" ? "active" : ""}>
                  <Link to="/code-development" style={{ textDecoration: "none", color: "inherit" }}>
                    Reason & Department
                  </Link>
                </li>
                <li className={location.pathname === "/email-report" ? "active" : ""}>
                  <Link to="/email-report" style={{ textDecoration: "none", color: "inherit" }}>
                    Email Report
                  </Link>
                
                </li>
                   <li className={location.pathname === "/pos-count" ? "active" : ""}>
                  <Link to="/pos-count" style={{ textDecoration: "none", color: "inherit" }}>
                    POS Setup
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
            <img src={logoutIcon} alt="Logout" />
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;