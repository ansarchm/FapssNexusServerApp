import React from 'react';
import './poscount.css';
import phone from "../components/assets/phone.png"
const POSSetup = () => {
  const posData = [
    { id: 1, computerName: 'DELL-PC', posName: 'POS-1 Albaron' },
    { id: 2, computerName: 'KIO S-PC', posName: 'Kiosk - Albaron' },
    { id: 3, computerName: 'Abdullah-PC', posName: 'POS-2 Albaron' },
    { id: 4, computerName: 'KIO S-PC', posName: 'Kiosk - Albaron' },
    { id: 5, computerName: 'Mubin-PC', posName: 'POS-3 Albaron' }
  ];

  return (
    <div className="pos-setup-wrapper">
      <div className="header-container">
        <h2 className="pos-title">
          <span className="hash-symbol"><img src={phone} alt="phoneicon" /></span>
          POS Setup
        </h2>
        <div className="action-buttons">
          <button className="btn btn-save">Save</button>
          <button className="btn btn-refresh">Refresh</button>
        </div>
      </div>

      <div className="column-headers">
        <div className="column-header">ID</div>
        <div className="column-header">Computer Name</div>
        <div className="column-header">POS Name</div>
      </div>

      <div className="data-table">
        {posData.map((row) => (
          <div key={row.id} className="data-row">
            <div className="data-cell cell-id">{row.id}</div>
            <div className="data-cell">{row.computerName}</div>
            <div className="data-cell">{row.posName}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default POSSetup;