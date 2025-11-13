import React, { useState, useEffect } from 'react';
import './locationtable.css';
import AddLocation from "./AddLocation";
import { useNavigate } from "react-router-dom";
import searchIcon from "../components/assets/Vector.png";
import locationIcon from "../components/assets/location.png";
import { locationService } from '../services/api';

const LocationTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for API data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch locations from API on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationService.getAllLocations();
      
      // Map API response to table format
      const mappedData = response.map(location => ({
        id: location.id,
        locationName: location.name || '',
        address1: location.address || '',
        address2: location.addresst || '', // Note: API has 'addresst' field
        phoneNumber: location.phoneno || ''
      }));
      
      setData(mappedData);
      console.log('✅ Locations loaded:', mappedData.length, 'records');
    } catch (err) {
      console.error('❌ Error fetching locations:', err);
      setError(err.message || 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search term
  const filtered = data.filter(
    (row) =>
      row.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.address1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.address2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.phoneNumber.includes(searchTerm)
  );

  // Open modal
  const handleAddLocation = () => {
    setIsModalOpen(true);
    document.body.classList.add('modal-open');
  };

  // Close modal and refresh data
  const handleCloseModal = (shouldRefresh = false) => {
    setIsModalOpen(false);
    document.body.classList.remove('modal-open');
    
    // Refresh the table if a new location was added
    if (shouldRefresh) {
      fetchLocations();
    }
  };

  return (
    <div className="separated-table-container">
      {/* Page Title with Icon */}
      <div className="separated-page-title">
        <img src={locationIcon} alt="Location" className="separated-title-icon" />
        <h1 className="separated-title-text">Location Table</h1>
      </div>

      {/* Top Bar with Search and Buttons */}
      <div className="separated-top-bar">
        <div className="separated-search-container">
          <img src={searchIcon} alt="Search" className="separated-search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="separated-search-input"
            placeholder="Search "
          />
        </div>
        
        <div className="separated-action-buttons">
          <button 
            className="separated-btn separated-btn-add"
            onClick={handleAddLocation}
          >
            Add
          </button>
          <button 
            className="separated-btn separated-btn-refresh"
            onClick={fetchLocations}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button 
            className="separated-btn separated-btn-close"
            onClick={() => navigate(-1)}
          >
            Close
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="separated-table-header">
        <div className="separated-header-cell separated-col-id">
          <span>Id</span>
          <div className="separated-sort-arrows">
            <div className="separated-arrow-up"></div>
            <div className="separated-arrow-down"></div>
          </div>
        </div>
        <div className="separated-header-cell separated-col-location">
          <span>Location name</span>
          <div className="separated-sort-arrows">
            <div className="separated-arrow-up"></div>
            <div className="separated-arrow-down"></div>
          </div>
        </div>
        <div className="separated-header-cell separated-col-address1">
          <span>Address 1</span>
          <div className="separated-sort-arrows">
            <div className="separated-arrow-up"></div>
            <div className="separated-arrow-down"></div>
          </div>
        </div>
        <div className="separated-header-cell separated-col-address2">
          <span>Address 2</span>
          <div className="separated-sort-arrows">
            <div className="separated-arrow-up"></div>
            <div className="separated-arrow-down"></div>
          </div>
        </div>
        <div className="separated-header-cell separated-col-phone">
          <span>Phone number</span>
          <div className="separated-sort-arrows">
            <div className="separated-arrow-up"></div>
            <div className="separated-arrow-down"></div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="separated-table-content">
        {loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            Loading locations...
          </div>
        )}
        
        {error && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>
            ⚠️ Error: {error}
            <br />
            <button 
              onClick={fetchLocations}
              style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}
            >
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            {searchTerm ? 'No locations found matching your search.' : 'No locations available.'}
          </div>
        )}
        
        {!loading && !error && filtered.map((row, index) => (
          <div 
            key={row.id} 
            className={`separated-table-row ${index % 2 === 1 ? 'separated-row-yellow' : ''}`}
          >
            <div className="separated-cell separated-col-id">{row.id}</div>
            <div className="separated-cell separated-col-location">{row.locationName}</div>
            <div className="separated-cell separated-col-address1">{row.address1}</div>
            <div className="separated-cell separated-col-address2">{row.address2}</div>
            <div className="separated-cell separated-col-phone">{row.phoneNumber}</div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay">
          <AddLocation onClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
};

export default LocationTable;