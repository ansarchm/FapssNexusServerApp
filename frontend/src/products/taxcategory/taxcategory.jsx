import React, { useState } from 'react';
import './taxcategory.css';
import taxCategoryIcon from '../../components/assets/taxcategory.png';
import taxArrow from '../../components/assets/taxarrow.png';
import { useNavigate } from "react-router-dom";
import TaxCategorySettings from './taxcategorysettings';

// Sample data based on your Figma design
const data = [
  { id: 0, taxId: 'Not Defined', taxCategory: 'Not Defined on no Tax', taxDescription: '0.00000%', taxPercent: '09-Dec-2024 17h00m', createdModified: 'Muhammadhasan' },
  { id: 2, taxId: 'Sales Tax 2', taxCategory: 'Sales Tax 2', taxDescription: '0.00000%', taxPercent: '09-Dec-2024 23h29m', createdModified: 'Muhammadhasan' },
  { id: 3, taxId: 'Sales Tax 3', taxCategory: 'Sales Tax 3', taxDescription: '0.00000%', taxPercent: '09-Dec-2024 23h45m', createdModified: 'Muhammadhasan' },
  { id: 9, taxId: 'Sales Tax 4', taxCategory: 'Sales Tax 4', taxDescription: '0.00000%', taxPercent: '09-Dec-2024 23h05m', createdModified: 'Muhammadhasan' },
  { id: 56, taxId: 'Sales Tax 1', taxCategory: 'Sales Tax 1', taxDescription: '0.00000%', taxPercent: '09-Dec-2024 17h23m', createdModified: 'Muhammadhasan' },
  { id: 87, taxId: 'Sales Tax 3', taxCategory: 'Sales Tax 3', taxDescription: '0.00000%', taxPercent: '09-Dec-2024 03h04m', createdModified: 'Muhammadhasan' },
  { id: 103, taxId: 'Sales Tax 4', taxCategory: 'Sales Tax 4', taxDescription: '0.00000%', taxPercent: '09-Dec-2024 09h34m', createdModified: 'Muhammadhasan' },
  { id: 111, taxId: 'Sales Tax 1', taxCategory: 'Sales Tax 1', taxDescription: '0.00000%', taxPercent: '09-Dec-2024 23h00m', createdModified: 'Muhammadhasan' },
  { id: 113, taxId: 'Sales Tax 2', taxCategory: 'Sales Tax 2', taxDescription: '0.00000%', taxPercent: '09-Dec-2024 15h02m', createdModified: 'Muhammadhasan' },
  { id: 124, taxId: 'Sales Tax 1', taxCategory: 'Sales Tax 1', taxDescription: '0.00000%', taxPercent: '09-Dec-2024 02h09m', createdModified: 'Muhammadhasan' },
  { id: 127, taxId: 'Sales Tax 1', taxCategory: 'Sales Tax 1', taxDescription: '0.00000%', taxPercent: '09-Dec-2024 17h02m', createdModified: 'Muhammadhasan' },
  { id: 294, taxId: 'Sales Tax 1', taxCategory: 'Sales Tax 1', taxDescription: '0.00000%', taxPercent: '09-Dec-2024 03h43m', createdModified: 'Muhammadhasan' },
];

const TaxCategory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = data.filter(
    (row) =>
      row.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.taxCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.taxDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.taxPercent.includes(searchTerm) ||
      row.createdModified.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="tax-table-container">
      {/* Top Bar with Icon, Title and Buttons */}
      <div className="tax-top-bar">
        <div className="tax-title-container">
          <img src={taxCategoryIcon} alt="Tax Category" className="tax-category-icon" />
          <h2 className="tax-category-title">Tax Category</h2>
        </div>
        
        <div className="tax-action-buttons">
          <button className="tax-btn tax-btn-add" onClick={handleOpenModal}>
            Add
          </button>
          <button className="tax-btn tax-btn-refresh">Refresh</button>
        </div>
      </div>

      {/* Table Wrapper with Scroll */}
      <div className="tax-table-wrapper">
        {/* Table Header */}
        <div className="tax-table-header">
          <div className="tax-header-cell tax-col-id">
            <span>Tax Id</span>
            <img src={taxArrow} alt="Sort" className="tax-sort-icon" />
          </div>
          <div className="tax-header-cell tax-col-category">
            <span>Tax Category</span>
            <img src={taxArrow} alt="Sort" className="tax-sort-icon" />
          </div>
          <div className="tax-header-cell tax-col-description">
            <span>Tax Description</span>
            <img src={taxArrow} alt="Sort" className="tax-sort-icon" />
          </div>
          <div className="tax-header-cell tax-col-percent">
            <span>Tax Percent</span>
            <img src={taxArrow} alt="Sort" className="tax-sort-icon" />
          </div>
          <div className="tax-header-cell tax-col-modified">
            <span>Created/ Modified</span>
            <img src={taxArrow} alt="Sort" className="tax-sort-icon" />
          </div>
          <div className="tax-header-cell tax-col-employee">
            <span>Employee</span>
            <img src={taxArrow} alt="Sort" className="tax-sort-icon" />
          </div>
        </div>

        {/* Table Content */}
        <div className="tax-table-content">
          {filtered.map((row, index) => (
            <div key={index} className={`tax-table-row ${index % 2 === 1 ? 'tax-row-yellow' : ''}`}>
              <div className="tax-cell tax-col-id">{row.id}</div>
              <div className="tax-cell tax-col-category">{row.taxId}</div>
              <div className="tax-cell tax-col-description">{row.taxCategory}</div>
              <div className="tax-cell tax-col-percent">{row.taxDescription}</div>
              <div className="tax-cell tax-col-modified">{row.taxPercent}</div>
              <div className="tax-cell tax-col-employee">{row.createdModified}</div>
            </div>
          ))}
        </div>
        
      </div>

      {/* Modal */}
      {isModalOpen && <TaxCategorySettings onClose={handleCloseModal} />}
    </div>
  );
};

export default TaxCategory;