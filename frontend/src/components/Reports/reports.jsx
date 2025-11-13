import React from "react";
import "./reports.css"; // Import the CSS file for styling
import { Link } from "react-router-dom";
const reportCards = [
  {
    title: "Revenue Reports",
    items: [
      "Card Sales",
      "Card Liability Summary",
      "Card Cash Balance Trends",
      "Card Split Reports",
      "Card Summary",
      "Clear Card History",
      "Credit Card Details",
      "Comped Card Details",
      "Encode Details",
    ],
  },
  {
    title: "Game Reports",
    items: ["Employee Game Card Report", "Game Inventory List", "Game Repair Status"],
  },
  {
    title: "Inventory Reports",
    items: [
      "Stock Summary Report",
      "Stock Movement Report",
      "Sales Report",
      "Purchase Report",
      "Low Stock Report",
      "Stock Adjustment Report",
      "Inventory Valuation Report",
      "Category-wise Stock Report",
    ],
  },
  {
    title: "Event Reports",
    items: [
      "Sales Summary Report",
      "Transaction Report",
      "Attendance Report",
      "Revenue Report",
      "Payment Method Report",
      "Discount Report",
      "Refund Report",
      "Product Performance Report",
    ],
  },
  {
    title: "Membership Reports",
    items: [
      "Membership Summary Report",
      "New Membership Report",
      "Renewal Report",
      "Expired Membership Report",
      "Active vs Inactive Report",
      "Membership Revenue Report",
      "Member Attendance Report",
      "Member Purchase History Report",
    ],
  },
];

const Reports = () => {
  return (
    <div className="reports-page">
        
      {/* Outer big white card */}
      <div className="reports-outer-card">
        <div className="reports-grid">
          {reportCards.map((card, idx) => (
            <div className="report-card" key={idx}>
             <div className="report-card__header">
  {card.title === "Game Reports" ? (
    <Link to="/game-reports" className="card-link">{card.title}</Link>
  ) : (
    card.title
  )}
</div>

              <div className="report-card__body">
                <ul>
                  {card.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
