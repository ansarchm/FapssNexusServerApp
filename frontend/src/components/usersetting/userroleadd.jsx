import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './userroleadd.css';
import cancelIcon from '../../components/assets/iconoir_cancel.png'; 
import userroleIcon from "../../components/assets/userroleIcon.png";

const UserRoleSetup = () => {
  const [selectedApp, setSelectedApp] = useState('NEXUS Management System');
  const [selectedSubItem, setSelectedSubItem] = useState('Product Definitions');
  const [userRole, setUserRole] = useState('System Administrator');
  const [description, setDescription] = useState('Redemption');
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const navigate = useNavigate();
  
  // Define the structure with main apps and their sub-items
  const applicationStructure = [
    {
      name: 'NEXUS Cashier',
      subItems: ['Functions', 'General']
    },
    {
      name: 'NEXUS Management System',
      subItems: ['Product Definitions', 'Game Settings', 'Inventory', 'Membership', 'User Settings', 'Reports', 'Check Balance', 'General Settings']
    },
    {
      name: 'Security',
      subItems: []
    },
    {
      name: 'Memberships/Rewards',
      subItems: []
    },
    {
      name: 'Block Access Profile',
      subItems: []
    },
    {
      name: 'Location Table',
      subItems: []
    }
  ];

  // Descriptions for each sub-item
  const descriptionMapping = {
    'Functions': [
      'Allow Assign Cash Drawer',
      'Allow Refund',
      'Allow Exit App',
      'Allow X-report',
      'Allow Z-Report',
      'Allow Clear Card',
      'Allow POS Setup',
      'Allow POS Transaction',
      'Allow Void Sale',
      'Allow Duplicate Receipt Print',
      'Allow Refresh App',
      'Allow Cash Drop / Out',
      'Allow Manage Staff Card',
      'Allow Bulk Encode'
    ],
    'General': [
      'Allow POS Log in',
      'Allow Booking QR Code Access',
      'Allow Tracker Access',
      'Allow Reset LED Bracelet',
      'Allow Release LED Bracelet',
      'Allow Event Tab Access',
      'Allow Event Booking',
      'Allow Edit Booking',
      'Allow More Deposit Booking',
      'Allow Refund Booking',
      'Allow Print List',
      'Allow Full Payment',
      'Allow Account Tab Access',
      'Allow Account History Search (Manual Search)',
      'Allow Consolidate Cards',
      'Allow Pause Time Play',
      'Allow Split Cash on Card Balance',
      'Allow Split Bonus on Card Balance',
      'Allow Split Coin on Card Balance',
      'Allow Lock Card',
      'Allow Card Transfer',
      'Allow Search Card',
      'Allow Cash Comps',
      'Allow Bonus Comps',
      'Allow Coin Comps',
      'Allow Edit Customer Info',
      'Allow Customer Photo Retake',
      'Allow Reverse Game Transaction',
      'Allow Item Discount',
      'Allow Bill Discount',
      'Allow Product Search',
      'Allow Miscellaneous Sale',
      'Allow New Card Sale',
      'Allow Revalue',
      'Allow Cash Drawer Access',
      'Allow Tax Exemption Access'
    ],
    'Product Definitions': [
      'Add / Edit Card Product',
      'Add / Edit Coin Product',
      'Add / Edit Time Product',
      'Add / Edit Item Product',
      'Add / Edit LED Product',
      'Add / Edit Sticker Product',
      'Add / Edit Combo Product',
      'Add / Edit Display Group',
      'Add / Edit Tax Category'
    ],
    'Game Settings': [
      'Add / Edit Game',
      'Add / Edit Game Category',
      'Allow Transfer Game',
      'Allow Game Status Update'
    ],
    'Inventory': [
      'View Stock Only',
      'Allow Quick Inventory',
      'Allow Adjust Inventory',
      'Allow Transfer Inventory'
    ],
    'Membership': [
      'Add / Edit Membership'
    ],
    'User Settings': [
      'Add / Edit User Role',
      'Add / Edit User'
    ],
    'Reports': [
      'Revenue Report',
      'Game Report',
      'Inventory Report',
      'Event Report',
      'Membership Report'
    ],
    'Check Balance': [
      'Allow Check Balance'
    ],
    'General Settings': [
      'Add / Edit Location Table',
      'Add / Edit Product Department and Reason Codes',
      'Add / Edit Schedule Email Report',
      'Delete Email Report',
      'Allow POS Setup'
    ]
  };

  // Get current descriptions based on selected sub-item
  const descriptionItems = descriptionMapping[selectedSubItem] || [];

  // Handle clicking on sub-item
  const handleSubItemClick = (subItem) => {
    setSelectedSubItem(subItem);
  };

  return (
    <div className="userrole-modal-overlay">
      <div className="userrole-modal-container">
        {/* Header */}
        <div className="userrole-modal-header">
          <div className="userrole-header-content">
            <div className="userrole-star-icon">
              <img src={userroleIcon} alt="User Role" className="userrole-user-details-close" />
            </div>
            <h2 className="userrole-modal-title">User Role Setup</h2>
          </div>
          <button onClick={() => navigate("/userrole")} className="userrole-close-button">
            <img src={cancelIcon} alt="Close" className="userrole-user-details-close" />
          </button>
        </div>

        <div className="userrole-modal-body">
          {/* General Settings Section */}
          <div className="userrole-section">
            <div className="userrole-section-header">
              <h3>General Settings</h3>
            </div>
            <div className="userrole-general-settings-content">
              {/* First row: ID and User Role */}
              <div className="userrole-form-row">
                <div className="userrole-form-group userrole-id-group">
                  <label>ID</label>
                  <input
                    type="text"
                    value="120"
                    className="userrole-form-input userrole-id-input"
                    readOnly
                  />
                </div>
                <div className="userrole-form-group userrole-user-role-group">
                  <label>User Role</label>
                  <input
                    type="text"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="userrole-form-input userrole-user-role-input"
                  />
                </div>
              </div>
              
              {/* Second row: Description */}
              <div className="userrole-form-row">
                <div className="userrole-form-group userrole-description-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="userrole-form-input userrole-description-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Application and Description Sections */}
          <div className="userrole-two-column-layout">
            {/* Application Section */}
            <div className="userrole-section">
              <div className="userrole-section-header">
                <h3>Application</h3>
              </div>
              <div className="userrole-section-content">
                <div className="userrole-scrollable-list">
                  {applicationStructure.map((app, index) => (
                    <div key={index}>
                      {/* Main Application */}
                      <div
                        className={`userrole-list-item ${
                          app.name === selectedApp ? 'userrole-selected' : ''
                        }`}
                        onClick={() => setSelectedApp(app.name)}
                      >
                        {app.name}
                      </div>
                      
                      {/* Sub-items (shown when app is selected) */}
                      {app.name === selectedApp && app.subItems.length > 0 && (
                        app.subItems.map((subItem, subIndex) => (
                          <div
                            key={subIndex}
                            className={`userrole-list-item ${
                              subItem === selectedSubItem ? 'userrole-outlined' : ''
                            }`}
                            onClick={() => handleSubItemClick(subItem)}
                            style={{ paddingLeft: '30px' }}
                          >
                            {subItem}
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="userrole-section">
              <div className="userrole-section-header">
                <h3>Description</h3>
              </div>
              <div className="userrole-section-content">
                <div className="userrole-scrollable-list">
                  {descriptionItems.map((item, index) => (
                    <div key={index} className="userrole-description-item">
                      <div className="userrole-checkbox-icon">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Reordered to Save, Okay, Cancel */}
          <div className="userrole-button-group">
            <button className="userrole-btn userrole-btn-save">Save</button>
            <button className="userrole-btn userrole-btn-okay">Okay</button>
            <button className="userrole-btn userrole-btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoleSetup;