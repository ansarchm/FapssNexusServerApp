import React, { useState } from 'react';
import './searchcard.css';
import searchIconCheck from '../components/assets/searchiconcheck.png';
import searchCheckIcon from '../components/assets/search-check.png';
import taxArrow from '../components/assets/taxarrow.png';

export default function SearchCard({ isOpen, onClose, onSelectCard }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  // Mock data for demonstration
  const mockData = [
    { firstName: 'Abdulla', lastName: 'Muhammed', cardNumber: 'ASD567', phone: '+966 5678 4567' },
    { firstName: 'Abdulla', lastName: 'Muhammed', cardNumber: 'ASD567', phone: '+966 5678 4567' },
    { firstName: 'Abdulla', lastName: 'Muhammed', cardNumber: 'ASD567', phone: '+966 5678 4567' },
    { firstName: 'Abdulla', lastName: 'Muhammed', cardNumber: 'ASD567', phone: '+966 5678 4567' },
    { firstName: 'Abdulla', lastName: 'Muhammed', cardNumber: 'ASD567', phone: '+966 5678 4567' },
    { firstName: 'Abdulla', lastName: 'Muhammed', cardNumber: 'ASD567', phone: '+966 5678 4567' },
    { firstName: 'Abdulla', lastName: 'Muhammed', cardNumber: 'ASD567', phone: '+966 5678 4567' }
  ];

  const [searchResults, setSearchResults] = useState(mockData);

  const handleSearch = () => {
    // In real implementation, this would make an API call
    setSearchResults(mockData);
  };

  const handleRowClick = (card, index) => {
    setSelectedRow(index);
  };

  const handleOkay = () => {
    if (selectedRow !== null && onSelectCard) {
      onSelectCard(searchResults[selectedRow]);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-search-card-check-v2" onClick={onClose}>
      <div className="modal-container-search-card-check-v2" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-search-card-check-v2">
          <div className="modal-title-wrapper-search-card-check-v2">
            <img src={searchIconCheck} alt="Card Icon" className="card-icon-search-card-check-v2" />
            <span className="modal-title-search-card-check-v2">Search Card</span>
          </div>
          <button className="close-btn-search-card-check-v2" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Info Container with Tab and Form */}
        <div className="info-container-search-card-check-v2">
          {/* Info Tab */}
          <div className="info-tab-search-card-check-v2">
            Info
          </div>

          {/* Search Form */}
          <div className="search-form-search-card-check-v2">
            <div className="form-row-search-card-check-v2">
              <div className="form-group-search-card-check-v2">
                <label className="form-label-search-card-check-v2">First Name</label>
                <input 
                  type="text" 
                  className="form-input-search-card-check-v2"
                  placeholder="Mubin"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group-search-card-check-v2">
                <label className="form-label-search-card-check-v2">Last Name</label>
                <input 
                  type="text" 
                  className="form-input-search-card-check-v2"
                  placeholder="Mohammed"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-search-card-check-v2">
              <div className="form-group-search-card-check-v2">
                <label className="form-label-search-card-check-v2">Cell Phone</label>
                <input 
                  type="text" 
                  className="form-input-search-card-check-v2"
                  placeholder="+9666 4567 8900"
                  value={cellPhone}
                  onChange={(e) => setCellPhone(e.target.value)}
                />
              </div>
              <div className="search-btn-wrapper-search-card-check-v2">
                <button className="search-btn-search-card-check-v2" onClick={handleSearch}>
                  <img src={searchCheckIcon} alt="Search" className="search-btn-icon-search-card-check-v2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        {searchResults.length > 0 && (
          <>
            {/* Table Header - Separate Container */}
            <div className="table-header-container-search-card-check-v2">
              <div className="table-header-wrapper-search-card-check-v2">
                <div className="table-header-search-card-check-v2 col-firstname-search-card-check-v2">
                  <span>First Name</span>
                  <img src={taxArrow} alt="Sort" className="sort-arrow-search-card-check-v2" />
                </div>
                <div className="table-header-search-card-check-v2 col-lastname-search-card-check-v2">
                  <span>Last Name</span>
                  <img src={taxArrow} alt="Sort" className="sort-arrow-search-card-check-v2" />
                </div>
                <div className="table-header-search-card-check-v2 col-cardnumber-search-card-check-v2">
                  <span>Card Number</span>
                  <img src={taxArrow} alt="Sort" className="sort-arrow-search-card-check-v2" />
                </div>
                <div className="table-header-search-card-check-v2 col-phone-search-card-check-v2">
                  <span>Phone</span>
                  <img src={taxArrow} alt="Sort" className="sort-arrow-search-card-check-v2" />
                </div>
              </div>
            </div>

            {/* Table Content - Separate Container */}
            <div className="table-content-container-search-card-check-v2">
              <div className="table-content-search-card-check-v2">
                {searchResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`table-row-search-card-check-v2 ${index % 2 === 1 ? 'row-yellow-search-card-check-v2' : ''} ${selectedRow === index ? 'highlighted-row-search-card-check-v2' : ''}`}
                    onClick={() => handleRowClick(result, index)}
                  >
                    <div className="table-cell-search-card-check-v2 col-firstname-search-card-check-v2">{result.firstName}</div>
                    <div className="table-cell-search-card-check-v2 col-lastname-search-card-check-v2">{result.lastName}</div>
                    <div className="table-cell-search-card-check-v2 col-cardnumber-search-card-check-v2">{result.cardNumber}</div>
                    <div className="table-cell-search-card-check-v2 col-phone-search-card-check-v2">{result.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer Buttons */}
        <div className="modal-footer-search-card-check-v2">
          <button className="okay-btn-search-card-check-v2" onClick={handleOkay}>
            Okay
          </button>
          <button className="cancel-btn-search-card-check-v2" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}