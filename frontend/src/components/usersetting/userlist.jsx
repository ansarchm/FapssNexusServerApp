import React, { useEffect, useState } from "react";
import "./userlist.css";
import { useNavigate } from "react-router-dom";

import searchIcon from "../../components/assets/search.png";
import filterIcon from "../../components/assets/filter.png";
import glass2Icon from "../../components/assets/glass2.png"; 
import userIcon from "../../components/assets/user.png"; // You'll need to add a user icon
import axios from "axios";
import { usersservices } from "../../services/api";

// Sample user data
// const userData = Array.from({ length: 15 }, (_, index) => ({
//   select: index % 3 === 0,
//   userId: 34569 + index,
//   firstName: "Mubin",
//   lastName: "Mohammed",
//   active: index % 2 === 0,
//   userRole: "System Administrator",
//   location: "Albaron 1",
//   cardNumber: "9345123A",
//   accessProfile: "Redemption Only",
//   allowCourtesyPlay: index % 3 === 0,
//   updatedUser: "Mubin",
//   updatedDate: "09-Dec-2024"
// }));


// useEffect(()=>{
//   axios.call("",)
// },[])
const HeaderCell = ({ label }) => (
  <div className="user-list-header-container">
    <span className="user-list-header-text">{label}</span>
    <div className="user-list-sort-icons">
      <span className="user-list-arrow user-list-up1"></span>
      <span className="user-list-arrow user-list-down1"></span>
    </div>
  </div>
);

const UserList = () => {
  const [activeUsersOnly, setActiveUsersOnly] = useState(false);
  const [userFilter, setUserFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
    const [productFilter, setProductFilter] = useState(""); 
    const [userData, setData] = useState([]);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  

  
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching card products...');
      
      const response = await usersservices.GetAllUsers();
      
      console.log('📦 API Response:', response);
      console.log('📦 Response type:', typeof response);
      console.log('📦 Is array:', Array.isArray(response));
      
      // Handle response - API now returns direct array
      let products = [];
      
      if (Array.isArray(response)) {
        products = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        products = response.data;
      } else if (response && typeof response === 'object') {
        // Single object, wrap in array
        products = [response];
      }
      
      console.log('✅ Processed products:', products.length, 'items');
      console.log('✅ First product:', products[0]);
      
      setData(products);
      setFilteredData(products);
      
      if (products.length === 0) {
        setError('No card products found in database. Click "Add" to create one.');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      console.error('❌ Error response:', err.response);
      
      if (err.response?.status === 401) {
        setError('Session expired. Redirecting to login...');
        setTimeout(() => navigate('/'), 2000);
      } else if (err.response?.status === 500) {
        const detail = err.response?.data?.detail || err.message;
        setError(`Database error: ${detail}`);
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to API. Check if API is running on https://localhost:7221');
      } else {
        setError(`Failed to load: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleCheckboxChange = (index) => {
    setSelectedRow(index);
  };

  const handleUpdate = () => {
    if (selectedRow !== null) {
      console.log("Update user:", userData[selectedRow]);
      // Navigate to update form or open modal
      navigate(`/user-update/${userData[selectedRow].userId}`);
    }
  };

  // const filteredData = userData.filter(user => {
  //   if (activeUsersOnly && !user.active) return false;
  //   if (userFilter && !user.firstName.toLowerCase().includes(userFilter.toLowerCase()) && 
  //       !user.lastName.toLowerCase().includes(userFilter.toLowerCase()) &&
  //       !user.userRole.toLowerCase().includes(userFilter.toLowerCase())) return false;
  //   return true;
  // });

  return (
    <div className="user-list-table-wrapper">
      {/* ---------- Section Header ---------- */}
      <div className="user-list-section-header">
        <div className="user-list-section-title-container">
          <img src={userIcon} alt="User Icon" className="user-list-section-icon" /> 
          <h2 className="user-list-section-title">User List</h2>

          <div className="user-list-checkbox-container">
            <input
              type="checkbox"
              id="activeUsersOnly"
              checked={activeUsersOnly}
              onChange={(e) => setActiveUsersOnly(e.target.checked)}
            />
            <label htmlFor="activeUsersOnly" className="user-list-checkbox-label22">
              Active User
            </label>
          </div>
        </div>
      </div>

      {/* ---------- Action Row ---------- */}
      <div className="user-list-header-actions">
        {/* Search box */}
        <div className="user-list-search-container2">
          <img src={searchIcon} alt="Search" className="user-list-search-input2-icon" />
          <input
            type="text"
            placeholder="Search"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="user-list-search-input2"
          />
        </div>

        {/* Filter Button */}
        <div className="user-list-filter-container">
          <button 
            className="user-list-filter-btn"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <img src={filterIcon} alt="Filter" className="user-list-filter-icon" />
          </button>
          {showFilterDropdown && (
            <div className="user-list-filter-dropdown">
              <div className="user-list-filter-option">Search User</div>
              <div className="user-list-filter-option">Name</div>
              <div className="user-list-filter-option">Role</div>
              <div className="user-list-filter-option">Location</div>
            </div>
          )}
        </div>

        {/* Blue Search Button */}
        <button className="user-list-btn-search">
          <img src={glass2Icon} alt="Search" className="user-list-search-btn-icon" />
          Search
        </button>

        {/* Update + Add + Refresh */}
        <div className="user-list-action-buttons">
          <button 
            className="user-list-btn-add"
            onClick={() => navigate('/userdetails')}
          >
            Add
          </button>
          <button className="user-list-btn-refresh">Refresh</button>
        </div>
      </div>

      {/* Table */}
      <div className="user-list-table-scroll">
        <table className="user-list-custom-table">
          <thead>
            <tr>
              <th><HeaderCell label="User Id" /></th>
              <th><HeaderCell label="First name" /></th>
              <th><HeaderCell label="Last name" /></th>
              <th><HeaderCell label="Active" /></th>
              <th><HeaderCell label="User Role" /></th>
              <th><HeaderCell label="Location" /></th>
              <th><HeaderCell label="Card Number" /></th>
              <th><HeaderCell label="Access Profile" /></th>
              <th><HeaderCell label="Allow Courtesy Play" /></th>
              <th><HeaderCell label="Updated User" /></th>
              <th><HeaderCell label="Updated Date" /></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="12" style={{textAlign: 'center', padding: '40px', color: '#999'}}>
                  No data available
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.username}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.status} 
                      readOnly 
                      className="user-list-active-checkbox" 
                    />
                  </td>
                  <td>{row.userrole}</td>
                  <td>{row.locationid}</td>
                  <td>
                    <div className="user-list-card-box">{row.courtesycard}</div>
                  </td>
                  <td>{row.accessProfile}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={row.allowCourtesyPlay} 
                      readOnly 
                      className="user-list-active-checkbox" 
                    />
                  </td>
                  <td>{row.updatedUser}</td>
                  <td>{row.updatedDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;