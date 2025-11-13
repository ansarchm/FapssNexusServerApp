import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import TopBar from "./components/topbar";
import Login from "./components/login";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import LocationTable from "./location/locationtable";
import EmailReport from "./location/EmailReport";

import EmailReportpopup from "./location/EmailReportpopup";
import Poscount from "./location/poscount"
import GameSettings from  "./gamesetting/gamesetting";
import GameSettingsAdd from  "./gamesetting/gamesettingadd";
import GameCategory from "./gamesetting/gameCategory";
import AccessProfile from "./gamesetting/accessprofile";
import AddProfile from "./gamesetting/addprofile";
import CodeDev from "./gamesetting/codedev";

import UserList from "./components/usersetting/userlist"
import UserRole from "./components/usersetting/userrole"
import UserDetails from "./components/usersetting/userdetailsadd"
import UserRoleAdd from "./components/usersetting/userroleadd"
import AddLocation from "./location/AddLocation";
import CardProduct from "./products/cardproduct/cardproduct";

import CoinProduct from "./products/coinproduct/coinproduct";
import TimeProduct from "./products/timeproduct/timeproduct";
import ItemProduct from "./products/itemproduct/itemproduct";
import ItemProductForm from "./products/itemproduct/itemproductform";
import LedProduct from "./products/ledproduct/ledproduct";
import StickerProduct from "./products/stickerproduct/stickerproduct";
import ComboProduct from "./products/comboproduct/comboproduct";
import ComboProductAdd from "./products/comboproduct/comboproductadd";
import LedProductAdd from "./products/ledproduct/ledproductadd";
import StickerProductAdd from "./products/stickerproduct/stickerproductadd";
import TaxCategory from "./products/taxcategory/taxcategory";
import InventoryStock from "./components/inventory/stock";
import QuickInventory from "./components/inventory/quickinventory";
import AdjustInventory from "./components/inventory/adjustinventory";
import TransferStock from "./components/inventory/transferstock";
import CoinProductForm from "./products/coinproduct/coinproductform";
import CardProductForm from "./products/cardproduct/cardproductform";
import TimeProductForm from "./products/timeproduct/timeproductform";
import DisplayGroup from "./products/displaygroup/displaygroup"; 
import DisplayGroupAdd from './products/displaygroup/displaygroupadd';
import Membership from './components/membership/membership';
import MembershipAdd from './components/membership/membershipadd';
import Reports from './components/Reports/reports';
import CheckBalance from './checkbalance/checkbalance';
import Gamereports from './components/Reports/Gamereports';
import Transaction from "./checkbalance/transaction";
import SearchCard from "./checkbalance/searchcard";

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
            <Route path="/card-product" element={<CardProduct />} />
            <Route path="/card-productform" element={<CardProductForm />} />
            <Route path="/coin-product" element={<CoinProduct />} />
            <Route path="/coin-productform" element={<CoinProductForm />} />
            <Route path="/time-productform" element={<TimeProductForm />} />
            <Route path="/time-product" element={<TimeProduct />} />
            <Route path="/item-productform" element={<ItemProductForm />} />
            <Route path="/item-product" element={<ItemProduct />} />
            <Route path="/led-product" element={<LedProduct />} />
            <Route path="/led-product-add" element={<LedProductAdd/>} />
            <Route path="/sticker-product-add" element={<StickerProductAdd/>} />
            <Route path="/tax-category" element={<TaxCategory/>} />
            <Route path="/sticker-product" element={<StickerProduct/>} />
            <Route path="/combo-product" element={<ComboProduct/>} />
            <Route path="/combo-product-add" element={<ComboProductAdd />} />
            <Route path="/games" element={<GameSettings />} />
            <Route path="/gamesadd" element={<GameSettingsAdd />} />
            <Route path="/accessprofile" element={<AccessProfile />} />
            <Route path="/addprofile" element={<AddProfile />} />
            <Route path="/game-category" element={<GameCategory />} />
            <Route path="/code-development" element={<CodeDev />} />
            <Route path="/userlist" element={<UserList />} />
            <Route path="/userrole" element={<UserRole />} />
            <Route path="/userdetails" element={<UserDetails />} />
            <Route path="/userroleadd" element={<UserRoleAdd />} />
            <Route path="/stock" element={<InventoryStock />} />
            <Route path="/quickinventory" element={<QuickInventory />} />
            <Route path="/adjustinventory" element={<AdjustInventory />} /> 
            <Route path="/transferstock" element={<TransferStock />} />
            <Route path="/display-group" element={<DisplayGroup />} />
            <Route path="/display-group-add" element={<DisplayGroupAdd />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/membershipadd" element={<MembershipAdd />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/check-balance" element={<CheckBalance />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/search-card" element={<SearchCard />} />
            <Route path="/email-report" element={<EmailReport />} />
            <Route path="/email-report-popup" element={<EmailReportpopup />} />
            <Route path="/pos-count" element={<Poscount/>} />


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
        {/* Login Page - Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />

        {/* Protected Game Reports Route */}
        <Route path="/game-reports" element={
          <ProtectedRoute>
            <Gamereports />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;