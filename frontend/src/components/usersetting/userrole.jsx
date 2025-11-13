import React, { useEffect, useState } from "react";
import "./userrole.css";
import { useNavigate } from "react-router-dom";
import userRoleIcon from "../../components/assets/user.png"; // You can change this to a role-specific icon
import { usersservices } from "../../services/api";

// Sample user role data
// const userRoleData = Array.from({ length: 15 }, (_, index) => ({
//   userId: 34569 + index,
//   userRole: "System Administrator",
//   description: "Cranes",
//   updatedUser: "Mubin",
//   updatedDate: "09-Dec-2024"
// }));

const HeaderCell = ({ label }) => (
  <div className="user-role-header-container">
    <span className="user-role-header-text">{label}</span>
    <div className="user-role-sort-icons">
      <span className="user-role-arrow user-role-up1"></span>
      <span className="user-role-arrow user-role-down1"></span>
    </div>
  </div>
);

const UserRole = () => {
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();
  const [userRoleData, setData] = useState([]);

  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching card products...');

      const response = await usersservices.GetAllUserRoles();

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
      console.log("Update user role:", userRoleData[selectedRow]);
      // Navigate to update form or open modal
      navigate(`/user-role-update/${userRoleData[selectedRow].userId}`);
    }
  };

  const handleRefresh = () => {
    console.log("Refreshing user roles...");
    // Add refresh logic here
  };

  const handleAdd = () => {
    navigate('/userroleadd');
  };

  // const filteredData = userRoleData.filter(role => {
  //   if (userRoleFilter && 
  //       !role.userRole.toLowerCase().includes(userRoleFilter.toLowerCase()) && 
  //       !role.description.toLowerCase().includes(userRoleFilter.toLowerCase()) &&
  //       !role.updatedUser.toLowerCase().includes(userRoleFilter.toLowerCase())) return false;
  //   return true;
  // });

  return (
    <div className="user-role-table-wrapper">
      {/* ---------- Section Header ---------- */}
      <div className="user-role-section-header">
        <div className="user-role-section-title-container">
          <img src={userRoleIcon} alt="User Role Icon" className="user-role-section-icon" />
          <h2 className="user-role-section-title">User Roles</h2>
        </div>

        {/* Add and Refresh buttons in header */}
        <div className="user-role-header-buttons">
          <button
            className="user-role-btn-add"
            onClick={handleAdd}
          >
            Add
          </button>
          <button
            className="user-role-btn-refresh"
            onClick={handleRefresh}
          >
            Refresh
          </button>
        </div>
      </div>


      {/* Table */}
      <div className="user-role-table-scroll">
        <table className="user-role-custom-table">
          <thead>
            <tr>
              <th><HeaderCell label="User Id" /></th>
              <th><HeaderCell label="User Role" /></th>
              <th><HeaderCell label="Description" /></th>
              <th><HeaderCell label="Updated User" /></th>
              <th><HeaderCell label="Updated Date" /></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No data available
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index}>
                  <td>{row.id}</td>
                  <td>{row.userrole}</td>
                  <td>{row.description}</td>
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

export default UserRole;