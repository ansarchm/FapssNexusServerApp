import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './checkbalance.css';
import profileIcon from '../components/assets/profile-icon.png';
import searchIcon from '../components/assets/search-check.png';
import SearchCard from './searchcard';

export default function CheckBalance() {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('FGH06781');
  const [isSearchCardOpen, setIsSearchCardOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Muhammed Abdulla Jaleel',
    status: 'Active',
    cash: '678,000',
    bonus: '678,000',
    coin: '100',
    time: '123ms',
    membership: 'Sunday Promo',
    accessProfile: 'N/A',
    discount: '0%',
    cardHolderSince: 'May 24,2024',
    totalPaidIn: 'May 24,2024',
    todaysPaidIn: '865,000',
    startTime: '22-May-24 2:45:00 PM',
    duration: '0',
    endTime: '22-May-24 2:45:00 PM',
    activation: '22-May-24 2:45:00 PM',
    expirition: '22-May-24 2:45:00 PM'
  });

  const handleViewTransaction = () => {
    navigate('/transaction', { state: { cardNumber, userData } });
  };

  const handleSearchCard = () => {
    setIsSearchCardOpen(true);
  };

  const handleCloseSearchCard = () => {
    setIsSearchCardOpen(false);
  };

  const handleSelectCard = (card) => {
    // Update card number with selected card
    setCardNumber(card.cardNumber);
    // You can also fetch user data based on selected card here
  };

  return (
    <div className="check-balance-container-check">
      {/* Search Section - Outside main wrapper */}
      <div className="search-section-check">
        <label>Card Number</label>
        <input 
          type="text" 
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="card-input-check"
        />
        <button className="search-btn-check">
          <img src={searchIcon} alt="Search" className="search-icon-check" />
          Search
        </button>

        <div className="action-buttons-check">
          <button className="refresh-btn-check">Refresh</button>
          <button className="search-card-btn-check" onClick={handleSearchCard}>
            Search Card
          </button>
        </div>
      </div>

      {/* Main Container Wrapper */}
      <div className="main-container-wrapper-check">
        {/* Main Content */}
        <div className="content-wrapper-check">
          {/* Top Section */}
          <div className="top-section-check">
            {/* Left Section */}
            <div className="left-section-check">
              <div className="user-status-outer-wrapper-check">
                <div className="user-status-wrapper-check">
                  <div className="user-name-container-check">
                    <h3>{userData.name}</h3>
                  </div>
                  <div className="status-container-check">
                    <span className="status-badge-check">
                      Status: <span className="status-dot-check"></span> {userData.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats and Info Combined Container */}
              <div className="stats-info-container-check">
                <div className="stats-grid-check">
                  <div className="stat-item-check">
                    <div className="stat-label-check">Cash</div>
                    <div className="stat-value-check">{userData.cash}</div>
                  </div>
                  <div className="stat-item-check">
                    <div className="stat-label-check">Bonus</div>
                    <div className="stat-value-check">{userData.bonus}</div>
                  </div>
                  <div className="stat-item-check">
                    <div className="stat-label-check">Coin</div>
                    <div className="stat-value-check">{userData.coin}</div>
                  </div>
                  <div className="stat-item-check">
                    <div className="stat-label-check">Time</div>
                    <div className="stat-value-check">{userData.time}</div>
                  </div>
                </div>

                <div className="horizontal-separator-check"></div>

                <div className="info-grid-check">
                  <div className="info-item-check">
                    <div className="info-label-check">Membership/promo</div>
                    <div className="info-value-check">{userData.membership}</div>
                  </div>
                  <div className="info-item-check">
                    <div className="info-label-check">Access Profile</div>
                    <div className="info-value-check">{userData.accessProfile}</div>
                  </div>
                  <div className="info-item-check">
                    <div className="info-label-check">Discount</div>
                    <div className="info-value-check">{userData.discount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="right-section-check">
              <div className="avatar-placeholder-check">
                <div className="avatar-circle-check">
                  <img src={profileIcon} alt="Profile Icon" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Full Width */}
          <div className="bottom-section-check">
            {/* Sections Outer Container */}
            <div className="sections-outer-container-check">
              <div className="sections-grid-container-check">
                {/* General Status */}
                <div className="section-card-check">
                  <div className="section-header-check">General Status</div>
                  <div className="section-content-check">
                    <div className="detail-row-check">
                      <span className="detail-label-check">Card Holder Since</span>
                      <span className="detail-value-check">{userData.cardHolderSince}</span>
                    </div>
                    <div className="detail-row-check">
                      <span className="detail-label-check">Total Paid in</span>
                      <span className="detail-value-check">{userData.totalPaidIn}</span>
                    </div>
                    <div className="detail-row-check">
                      <span className="detail-label-check">Today's Paid in</span>
                      <span className="detail-value-check">{userData.todaysPaidIn}</span>
                    </div>
                  </div>
                </div>

                {/* Time Play */}
                <div className="section-card-check time-play-card-check">
                  <div className="section-header-check">Time Play</div>
                  <div className="section-content-check">
                    <div className="detail-row-check">
                      <span className="detail-label-check">Start Time</span>
                      <span className="detail-value-check">{userData.startTime}</span>
                    </div>
                    <div className="detail-row-check">
                      <span className="detail-label-check">Duration</span>
                      <span className="detail-value-check">{userData.duration}</span>
                    </div>
                    <div className="detail-row-check">
                      <span className="detail-label-check">End Time</span>
                      <span className="detail-value-check">{userData.endTime}</span>
                    </div>
                  </div>
                </div>

                {/* Account */}
                <div className="section-card-check account-section-check">
                  <div className="section-header-check">Account</div>
                  <div className="account-content-inline-check">
                    <div className="account-row-check">
                      <span className="account-label-check">Activation</span>
                      <span className="account-value-check">{userData.activation}</span>
                    </div>
                    <div className="account-row-check">
                      <span className="account-label-check">Expirition</span>
                      <span className="account-value-check">{userData.expirition}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* View Transaction Button */}
            <div className="transaction-separator-check"></div>
            <div className="view-transaction-wrapper-check">
              <button className="view-transaction-btn-check" onClick={handleViewTransaction}>
                View Transaction
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Card Modal */}
      <SearchCard 
        isOpen={isSearchCardOpen}
        onClose={handleCloseSearchCard}
        onSelectCard={handleSelectCard}
      />
    </div>
  );
}