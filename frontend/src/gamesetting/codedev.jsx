import React, { useState } from "react";
import expand from '../components/assets/expand.png';
import { Trash2 } from "lucide-react";
import './codedev.css';

const GameCategory = () => {
  // Product Departments data
  const [productDepartments, setProductDepartments] = useState([
    { id: 1, description: "Card Sales", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 2, description: "Events", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 3, description: "Default", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 4, description: "Food", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 5, description: "Gate Passes", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 6, description: "General Merchandise", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 7, description: "Miscellaneous", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 8, description: "New Card", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 9, description: "Not Assign", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 10, description: "Packages", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 11, description: "Promotion", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 12, description: "Redemption", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 13, description: "Time Play", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
  ]);

  // Discount Reason data
  const [discountReasons, setDiscountReasons] = useState([
    { id: 1, description: "Bad Service", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 2, description: "Employee", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 3, description: "Good Customer", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 4, description: "Friend", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 5, description: "Relative", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 6, description: "Other", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
  ]);

  // Card Transfer Reason data
  const [cardTransferReasons, setCardTransferReasons] = useState([
    { id: 1, description: "Damage Card", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 2, description: "Lost Card", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
  ]);

  // Lock Account Reason data
  const [lockAccountReasons, setLockAccountReasons] = useState([
    { id: 1, description: "Disabled", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 2, description: "Employee Card", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 3, description: "Expired", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 4, description: "Locked Account", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 5, description: "Not Active", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
  ]);

  // Comp Card Reason data
  const [compCardReasons, setCompCardReasons] = useState([
    { id: 1, description: "Bad Service", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 2, description: "Employee", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 3, description: "Good Customer", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 4, description: "Friend", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 5, description: "Relative", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 6, description: "Other", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
  ]);

  // Refund Reason data
  const [refundReasons, setRefundReasons] = useState([
    { id: 1, description: "Bad Service", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 2, description: "Damage Goods", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 3, description: "Return Merchandise", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 4, description: "Unhappy Customer", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
    { id: 5, description: "Other", created: "03-Aug-12 12:23 PM", lastUsed: "03-Aug-12 12:23 PM" },
  ]);

  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    productDepartments1: false,
    discount1: false,
    productDepartments2: false,
    discount2: false,
    cardTransfer: false,
    lockAccount: false,
    compCard: false,
    refund: false,
  });

  const handleAddCategory = () => console.log("Add category clicked");
  const handleSaveCategories = () => console.log("Save categories clicked");
  const handleAddSubCategory = () => console.log("Add sub-category clicked");
  const handleSaveSubCategories = () =>
    console.log("Save sub-categories clicked");

  const handleDeleteItem = (id, type) => {
    console.log(`Delete ${type} with id ${id}`);
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const renderSection = (sectionKey, title, data, type, handlers) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className="code-dev-section">
        <div 
          className="code-dev-section-header"
          onClick={() => toggleSection(sectionKey)}
          style={{ cursor: 'pointer' }}
        >
          <div className="code-dev-section-header-content">
            <div className="flex items-center gap-2">
              <h2 className="code-dev-section-title">{title}</h2>
            </div>
            <div className="code-dev-button-group">
              {isExpanded ? (
                <img src={expand} alt="Expand" className="expand-icon" style={{ width: "24px", height: "27px" }} />
              ) : (
                <img src={expand} alt="Expand" className="expand-icon" style={{ width: "24px", height: "27px" }}  />
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlers.add();
                }} 
                className="code-dev-btn-add" >
                Add
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlers.save();
                }}
                className="code-dev-btn-save"
              >
                Save
              </button>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="code-dev-table-container">
            <div className="code-dev-table-header">
              <div className="code-dev-table-header-cell">Description</div>
              <div className="code-dev-table-header-cell">Created</div>
              <div className="code-dev-table-header-cell">Last used</div>
              <div className="code-dev-table-header-cell"></div>
              <div className="code-dev-table-header-cell"></div>
            </div>
            <div className="code-dev-table-body">
              {data.map((item, index) => (
                <div
                  key={`${sectionKey}-${item.id}`}
                  className={`code-dev-table-row ${
                    index % 2 === 1 ? "even" : "odd"
                  }`}
                >
                  <div className="code-dev-table-cell">{item.description}</div>
                  <div className="code-dev-table-cell small-text">
                    {item.created}
                  </div>
                  <div className="code-dev-table-cell small-text">
                    {item.lastUsed}
                  </div>
                  <div className="code-dev-table-cell empty"></div>
                  <div className="code-dev-table-cell action">
                    <button
                      onClick={() => handleDeleteItem(item.id, type)}
                      className="code-dev-delete-button"
                    >
                      <Trash2 size={16} color="#6b7280" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="code-dev-container">
      {/* Header */}
      <div className="code-dev-header">
        <span className="code-dev-header-icon">🎮</span>
        <h1 className="code-dev-header-title">
          Product Departments & Reason Codes
        </h1>
      </div>

      {/* Product Departments Section */}
      {renderSection(
        'productDepartments1',
        'Product Departments',
        productDepartments,
        'category',
        { add: handleAddCategory, save: handleSaveCategories }
      )}

      {/* Discount Reason Section */}
      {renderSection(
        'discount2',
        'Discount Reason',
        discountReasons,
        'subcategory',
        { add: handleAddSubCategory, save: handleSaveSubCategories }
      )}

      {/* Card Transfer Section */}
      {renderSection(
        'cardTransfer',
        'Card Transfer Reason',
        cardTransferReasons,
        'cardtransfer',
        { add: handleAddCategory, save: handleSaveCategories }
      )}

      {/* Lock Account Section */}
      {renderSection(
        'lockAccount',
        'Lock Account Reason',
        lockAccountReasons,
        'lockaccount',
        { add: handleAddSubCategory, save: handleSaveSubCategories }
      )}

      {/* Comp Card Section */}
      {renderSection(
        'compCard',
        'Comp Card Reason',
        compCardReasons,
        'compcard',
        { add: handleAddCategory, save: handleSaveCategories }
      )}

      {/* Refund Section */}
      {renderSection(
        'refund',
        'Refund Reason',
        refundReasons,
        'refund',
        { add: handleAddSubCategory, save: handleSaveSubCategories }
      )}
    </div>
  );
};

export default GameCategory;