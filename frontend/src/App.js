import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import TopBar from "./components/topbar";
import Login from "./components/login";
import LocationTable from "./location/locationtable";
import AddLocation from "./location/AddLocation";
import CardProduct from "./products/cardproduct";

import "./App.css";

function DashboardLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <TopBar />
        <div style={{ flex: 2 }}>
          <Routes>
            <Route path="/location-table" element={<LocationTable />} />
            <Route path="/add-location" element={<AddLocation />} />
            <Route path="/card-product" element={<CardProduct />} /> {/* ✅ Added */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Layout */}
        <Route path="/*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
