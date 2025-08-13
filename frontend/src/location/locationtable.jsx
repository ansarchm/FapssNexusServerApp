import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import this
import "./locationtable.css";
import searchIcon from "../components/assets/Vector.png";
import sortIcon from "../components/assets/Vector1.png";


function LocationTable() {
  const navigate = useNavigate(); // ✅ Initialize navigation

  const data = [
    { id: "34569", name: "Allbaron Rides", address1: "Amman", address2: "Jordan", phone: "+99 3456 8976" },
    { id: "34570", name: "Skyline Corp", address1: "Beirut", address2: "Lebanon", phone: "+96 1234 5678" },
    { id: "34571", name: "Future Ltd", address1: "Dubai", address2: "UAE", phone: "+97 8765 4321" },
    { id: "34572", name: "Star Wheels", address1: "Doha", address2: "Qatar", phone: "+95 2345 6789" },
    { id: "34573", name: "Oceanic", address1: "Muscat", address2: "Oman", phone: "+94 1122 3344" },
    { id: "34574", name: "Metro Corp", address1: "Manama", address2: "Bahrain", phone: "+93 2233 4455" },
    { id: "34575", name: "Nova Rides", address1: "Riyadh", address2: "Saudi Arabia", phone: "+92 9988 7766" },
    { id: "34576", name: "Sun Group", address1: "Kuwait City", address2: "Kuwait", phone: "+91 8877 6655" },
    { id: "34577", name: "Global Ride", address1: "Cairo", address2: "Egypt", phone: "+90 7766 5544" },
    { id: "34578", name: "Urban Travels", address1: "Istanbul", address2: "Turkey", phone: "+89 6655 4433" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="content-container">
      <div className="table-heading">
        <img src={searchIcon} alt="Icon" className="heading-icon" />
        <h2>Location Table</h2>
      </div>

      <div className="content-header">
        <div className="search-box">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>

        <div className="btn-border">
          <div className="btn-group">
            <button className="btn add" onClick={() => navigate("/add-location")}>
              + Add
            </button>
            <button className="btn cancel">Cancel</button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header-row">
          <div className="table-cell">
            <span className="id-label">Id</span>
            <img src={sortIcon} alt="Sort" className="sort-icon" />
          </div>
          <div className="table-cell">
            Location name
            <img src={sortIcon} alt="Sort" className="sort-icon" />
          </div>
          <div className="table-cell">
            Address 1
            <img src={sortIcon} alt="Sort" className="sort-icon" />
          </div>
          <div className="table-cell">
            Address 2
            <img src={sortIcon} alt="Sort" className="sort-icon" />
          </div>
          <div className="table-cell">
            Phone number
            <img src={sortIcon} alt="Sort" className="sort-icon" />
          </div>
        </div>

        <div className="table-body">
          {currentData.map((item, index) => (
            <div className={`table-row ${index % 2 === 1 ? 'highlight' : ''}`} key={item.id}>
              <div className="table-cell">{item.id}</div>
              <div className="table-cell">{item.name}</div>
              <div className="table-cell">{item.address1}</div>
              <div className="table-cell">{item.address2}</div>
              <div className="table-cell">{item.phone}</div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default LocationTable;
