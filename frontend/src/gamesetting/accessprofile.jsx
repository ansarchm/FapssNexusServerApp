import React, { useState } from 'react';
import './accessprofile.css';
import accessProfileIcon from '../components/assets/accessprofile.png';
import { useNavigate } from 'react-router-dom';

const AccessProfile = () => {
  const [profileData, setProfileData] = useState([
    {
      id: 112,
      profile: 'Redemption Only',
      active: true,
      created: '03-Aug-12 12:23 PM',
      updated: '13-Aug-12 12:23 PM'
    },
    {
      id: 212,
      profile: 'Go cart',
      active: true,
      created: '04-Aug-12 12:23 PM',
      updated: '15-Aug-12 12:23 PM'
    },
    {
      id: 245,
      profile: 'Redemption Only',
      active: true,
      created: '04-Aug-12 12:23 PM',
      updated: '20-Aug-12 12:23 PM'
    },
    {
      id: 341,
      profile: 'Redemption Only',
      active: true,
      created: '09-Aug-12 12:23 PM',
      updated: '23-Aug-12 12:23 PM'
    },
    {
      id: 402,
      profile: 'Go cart',
      active: true,
      created: '11-Aug-12 12:23 PM',
      updated: '25-Aug-12 12:23 PM'
    },
    {
      id: 503,
      profile: 'Full Access',
      active: true,
      created: '12-Aug-12 12:23 PM',
      updated: '26-Aug-12 12:23 PM'
    },
    {
      id: 604,
      profile: 'Limited Access',
      active: false,
      created: '13-Aug-12 12:23 PM',
      updated: '27-Aug-12 12:23 PM'
    },
    {
      id: 705,
      profile: 'Guest Access',
      active: true,
      created: '14-Aug-12 12:23 PM',
      updated: '28-Aug-12 12:23 PM'
    }
  ]);

  const navigate = useNavigate();

  const toggleActive = (id) => {
    setProfileData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  const handleAddClick = () => {
    navigate('/addprofile');
  };

  return (
    <div className="access-profile-wrapper">
      <div className="access-profile-header">
        <div className="access-profile-header-left">
          <img src={accessProfileIcon} alt="Access Profile" className="access-profile-icon" />
          <h2 className="access-profile-header-title">Access Profile</h2>
        </div>
        <div className="access-profile-header-buttons">
          <button className="access-profile-btn access-profile-btn-save">Save</button>
          <button className="access-profile-btn access-profile-btn-add" onClick={handleAddClick}>Add</button>
          <button className="access-profile-btn access-profile-btn-delete">Delete</button>
        </div>
      </div>
      <div className="access-profile-table-container">
        <table className="access-profile-table">
          <thead>
            <tr>
              <th className="access-profile-th access-profile-first-column">ID</th>
              <th className="access-profile-th">Profile</th>
              <th className="access-profile-th access-profile-active-column">Active</th>
              <th className="access-profile-th">Created</th>
              <th className="access-profile-th access-profile-last-column">Updated</th>
            </tr>
          </thead>
          <tbody>
            {profileData.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? 'access-profile-even-row' : 'access-profile-odd-row'}>
                <td className="access-profile-td access-profile-first-column">{row.id}</td>
                <td className="access-profile-td">{row.profile}</td>
                <td className="access-profile-td access-profile-active-column">
                  <input
                    type="checkbox"
                    checked={row.active}
                    onChange={() => toggleActive(row.id)}
                    className="access-profile-custom-checkbox"
                  />
                </td>
                <td className="access-profile-td">{row.created}</td>
                <td className="access-profile-td access-profile-last-column">{row.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessProfile;