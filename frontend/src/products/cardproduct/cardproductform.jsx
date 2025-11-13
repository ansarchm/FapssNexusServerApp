import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./cardproductform.css";
import AddGamesModal from "./cardproductadd";
import { cardProductService } from "../../services/api";
import cardIcon from "../../components/assets/card-icon.png";
import cancelIcon from "../../components/assets/iconoir_cancel.png";
import calendarIcon from "../../components/assets/calander.png";

const CardProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [showAddGamesModal, setShowAddGamesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Mock data for dropdowns
  const membershipOptions = [
    { value: "", label: "Select Membership" },
    { value: "gold", label: "Gold Membership" },
    { value: "silver", label: "Silver Membership" },
    { value: "platinum", label: "Platinum Membership" },
  ];

  const accessProfileOptions = [
    { value: "", label: "Select Access Profile" },
    { value: "basic", label: "Basic Access" },
    { value: "premium", label: "Premium Access" },
    { value: "vip", label: "VIP Access" },
  ];

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    productname: "",
    category: "Card Product",
    ptype: "New Card",
    rate: 0,
    tax: 0,
    status: "1",
    sequence: 0,
    bonus: 0,
    duration: 0,
    cashbalance: 0,
    facevalue: 0,
    sellingprice: 0,
    cardquantity: 0,
    membership: "",
    accessprofile: "",
    cardvalidity: 0,
    cardexpirydate: "",
    vipcard: 0,
    poscounter: "",
    taxcategory: "",
    taxpercent: 0,
    pricenotax: 0,
    displayinpos: "1",
    kiosk: 0,
    kot: 0,
    customercard: 0,
    taxinclusive: false,
    lastupdateddate: "",
    lastupdateduser: "",
    regPhoto: false,
    regFirstName: false,
    regLastName: false,
    regPhone: false,
    regDOB: false,
    regSex: false,
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });

  useEffect(() => {
    if (isEditMode) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching product data for ID:", id);

      const response = await cardProductService.getCardProductById(id);
      console.log("📦 Product data:", response);

      setFormData({
        id: response.id || "",
        productname: response.productname || "",
        category: response.category || "Card Product",
        ptype: response.ptype || "New Card",
        rate: response.rate || 0,
        tax: response.tax || 0,
        status: response.status || "1",
        sequence: response.sequence || 0,
        bonus: response.bonus || 0,
        duration: response.duration || 0,
        cashbalance: response.cashbalance || 0,
        facevalue: response.facevalue || response.rate || 0,
        sellingprice: response.sellingprice || response.rate || 0,
        cardquantity: response.cardquantity || 0,
        membership: response.membership || "",
        accessprofile: response.accessprofile || "",
        cardvalidity: response.cardvalidity || response.duration || 0,
        cardexpirydate: response.cardexpirydate || "",
        vipcard: response.vipcard || 0,
        poscounter: response.poscounter || "",
        taxcategory: response.taxcategory || "",
        taxpercent: response.taxpercent || 0,
        pricenotax: response.pricenotax || response.rate || 0,
        displayinpos: response.displayinpos || "1",
        kiosk: response.kiosk || 0,
        kot: response.kot || 0,
        customercard: response.customercard || 0,
        taxinclusive: response.taxtype === "Included",
        lastupdateddate: response.lastupdateddate || "",
        lastupdateduser: response.lastupdateduser || "",
        regPhoto: false,
        regFirstName: false,
        regLastName: false,
        regPhone: false,
        regDOB: false,
        regSex: false,
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
      });
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      alert("Failed to load product data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Separate function to recalculate prices based on current state
  const recalculatePrices = (currentData) => {
    const faceValue = parseFloat(currentData.facevalue) || 0;
    const taxPercent = parseFloat(currentData.taxpercent) || 0;

    if (currentData.taxinclusive) {
      // Tax Inclusive: Face value INCLUDES tax
      const priceNoTax = faceValue / (1 + taxPercent / 100);
      const tax = faceValue - priceNoTax;

      return {
        pricenotax: priceNoTax.toFixed(2),
        tax: tax.toFixed(2),
        sellingprice: faceValue.toFixed(2),
      };
    } else {
      // Tax Exclusive: Face value does NOT include tax
      const tax = faceValue * (taxPercent / 100);
      const sellingPrice = faceValue + tax;

      return {
        tax: tax.toFixed(2),
        sellingprice: sellingPrice.toFixed(2),
        pricenotax: faceValue.toFixed(2),
      };
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Recalculate prices if relevant fields changed
      if (
        field === "facevalue" ||
        field === "taxpercent" ||
        field === "taxinclusive"
      ) {
        const calculatedPrices = recalculatePrices(newData);
        return {
          ...newData,
          ...calculatedPrices,
        };
      }

      return newData;
    });
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!formData.productname.trim()) {
        alert("Please enter a product name");
        return;
      }

      if (parseFloat(formData.facevalue) <= 0) {
        alert("Face value must be greater than 0");
        return;
      }

      setSaving(true);

      // Prepare payload with proper types for backend
      const faceValue = parseFloat(formData.facevalue) || 0;
      const tax = parseFloat(formData.tax) || 0;
      const priceNoTax = parseFloat(formData.pricenotax) || 0;

      const payload = {
        ProductName: formData.productname.trim(),
        PType: formData.ptype || "New Card",
        Rate: faceValue,
        Tax: tax,
        Status: formData.status || "1",
        Sequence: parseInt(formData.sequence) || 0,
        Bonus: parseFloat(formData.bonus) || 0,
        Duration: parseInt(formData.duration) || 0,
        CashBalance: parseFloat(formData.cashbalance) || 0,
        TimebandType: "Flexible",
        TaxType: formData.taxinclusive ? "Included" : "Excluded",
        GateIp: "",
        DepositAmount: 0,
        Kot: parseInt(formData.kot) || 0,
        FavoriteFlag: 0,
        CustomerCard: parseInt(formData.customercard) || 0,
        Kiosk: parseInt(formData.kiosk) || 0,
        RegMan: 0,
        TypeGate: "",
        GateValue: "",
        CommonFlag: 0,
        Expiry: 0,
        EnableLed: 0,
        Green: 0,
        Blue: 0,
        Red: 0,
        Membership: formData.membership || "",
        CardValidity: parseInt(formData.cardvalidity) || 0,
        CardExpiryDate: formData.cardexpirydate || "",
        VipCard: parseInt(formData.vipcard) || 0,
        PosCounter: formData.poscounter || "",
        TaxCategory: formData.taxcategory || "",
        TaxPercent: parseFloat(formData.taxpercent) || 0,
        PriceNoTax: priceNoTax,
        DisplayInPos: formData.displayinpos || "1",
        FaceValue: faceValue,
        SellingPrice: parseFloat(formData.sellingprice) || 0,
        CardQuantity: parseInt(formData.cardquantity) || 0,
        AccessProfile: formData.accessprofile || "",
      };

      console.log("💾 Saving product:", payload);

      let response;
      if (isEditMode) {
        payload.id = parseInt(id);
        response = await cardProductService.updateCardProduct(payload);
        alert("✅ Card product updated successfully!");
      } else {
        response = await cardProductService.addCardProduct(payload);
        alert("✅ Card product added successfully!");
      }

      console.log("✅ Save response:", response);
      navigate("/card-product");
    } catch (error) {
      console.error("❌ Save error:", error);

      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${
                Array.isArray(messages) ? messages.join(", ") : messages
              }`
          )
          .join("\n");
        alert("Validation errors:\n\n" + errorMessages);
      } else {
        alert(
          "Failed to save: " +
            (error.response?.data?.detail ||
              error.response?.data?.title ||
              error.message)
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleNew = () => {
    if (
      window.confirm("Create a new product? Any unsaved changes will be lost.")
    ) {
      navigate("/card-productform");
      window.location.reload();
    }
  };

  const handleDuplicate = async () => {
    if (!isEditMode) {
      alert("Please save the current product first");
      return;
    }

    if (window.confirm("Duplicate this product?")) {
      const duplicatedData = {
        ...formData,
        id: "",
        productname: formData.productname + " (Copy)",
      };
      setFormData(duplicatedData);
      navigate("/card-productform");
    }
  };

  const handleCancel = () => {
    if (window.confirm("Discard changes and go back?")) {
      navigate("/card-product");
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "24px",
          color: "#666",
        }}
      >
        <div>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
          Loading product data...
        </div>
      </div>
    );
  }

  return (
    <div className="cardform-modal-overlay">
      <div className="cardform-modal-container">
        {/* Header */}
        <div className="cardform-modal-header">
          <div className="cardform-header-title">
            <img
              src={cardIcon}
              alt="Card Icon"
              className="cardform-folder-icon"
            />
            <h2 className="cardform-title-text">
              {isEditMode ? "Edit Card Product" : "New Card Product"}
            </h2>
          </div>
          <button
            onClick={() => navigate("/card-product")}
            className="cardform-close-button"
          >
            <img src={cancelIcon} alt="Close" className="cardform-close-icon" />
          </button>
        </div>

        {/* Content Area */}
        <div className="cardform-modal-content">
          {/* Main Content */}
          <div className="cardform-main-content">
            <div className="cardform-content-wrapper">
              <div className="cardform-main-sections">
                {/* Product Section */}
                <div className="cardform-product-section">
                  <div className="cardform-section-header">Product</div>
                  <div className="cardform-product-content">
                    {/* Row 1 */}
                    <div className="cardform-form-row cardform-cols-3">
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">
                          Product Id
                        </label>
                        <input
                          type="text"
                          value={formData.id || "Auto-generated"}
                          className="cardform-form-input"
                          readOnly
                          style={{ backgroundColor: "#f5f5f5" }}
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={formData.productname}
                          onChange={(e) =>
                            handleInputChange("productname", e.target.value)
                          }
                          className="cardform-form-input"
                          placeholder="Enter product name"
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">
                          Department
                        </label>
                        <select
                          className="cardform-form-select"
                          value={formData.category}
                          disabled
                        >
                          <option>Card Product</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="cardform-form-row cardform-cols-3">
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Location</label>
                        <select className="cardform-form-select">
                          <option>Default</option>
                        </select>
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">
                          POS Counter
                        </label>
                        <input
                          type="text"
                          value={formData.poscounter}
                          onChange={(e) =>
                            handleInputChange("poscounter", e.target.value)
                          }
                          className="cardform-form-input"
                          placeholder="Enter POS counter"
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">
                          Display Group
                        </label>
                        <select
                          className="cardform-form-select"
                          value={formData.ptype}
                          onChange={(e) =>
                            handleInputChange("ptype", e.target.value)
                          }
                        >
                          <option>New Card</option>
                          <option>Recharge</option>
                          <option>Upgrade</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="cardform-form-row cardform-cols-3">
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">
                          Display Order
                        </label>
                        <input
                          type="number"
                          value={formData.sequence}
                          onChange={(e) =>
                            handleInputChange("sequence", e.target.value)
                          }
                          className="cardform-form-input"
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Active</label>
                        <input
                          type="checkbox"
                          className="cardform-checkbox"
                          checked={formData.status === "1"}
                          onChange={(e) =>
                            handleInputChange(
                              "status",
                              e.target.checked ? "1" : "0"
                            )
                          }
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">
                          Display in POS
                        </label>
                        <input
                          type="checkbox"
                          className="cardform-checkbox"
                          checked={formData.displayinpos === "1"}
                          onChange={(e) =>
                            handleInputChange(
                              "displayinpos",
                              e.target.checked ? "1" : "0"
                            )
                          }
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">Kiosk</label>
                        <input
                          type="checkbox"
                          className="cardform-checkbox"
                          checked={formData.kiosk === 1}
                          onChange={(e) =>
                            handleInputChange("kiosk", e.target.checked ? 1 : 0)
                          }
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">KOT</label>
                        <input
                          type="checkbox"
                          className="cardform-checkbox"
                          checked={formData.kot === 1}
                          onChange={(e) =>
                            handleInputChange("kot", e.target.checked ? 1 : 0)
                          }
                        />
                      </div>
                      <div className="cardform-form-group">
                        <label className="cardform-form-label">
                          Customer Card
                        </label>
                        <input
                          type="checkbox"
                          className="cardform-checkbox"
                          checked={formData.customercard === 1}
                          onChange={(e) =>
                            handleInputChange(
                              "customercard",
                              e.target.checked ? 1 : 0
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Sections */}
                <div className="cardform-bottom-sections">
                  {/* Price Section */}
                  <div className="cardform-price-section">
                    <div className="cardform-section-header cardform-price-header">
                      Price
                    </div>
                    <div className="cardform-section-content">
                      <div className="cardform-form-row cardform-cols-2">
                        <div className="cardform-form-group">
                          <label className="cardform-form-label">
                            Face Value *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.facevalue}
                            onChange={(e) =>
                              handleInputChange("facevalue", e.target.value)
                            }
                            className="cardform-form-input"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="cardform-form-group">
                          <label className="cardform-form-label">
                            Selling price
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.sellingprice}
                            onChange={(e) =>
                              handleInputChange("sellingprice", e.target.value)
                            }
                            className="cardform-form-input"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="cardform-checkbox-item-tax cardform-tax-inclusive-row">
                        <label className="cardform-checkbox-label-tax">
                          Tax Inclusive ?
                        </label>
                        <input
                          type="checkbox"
                          className="cardform-checkbox-tax"
                          checked={formData.taxinclusive}
                          onChange={(e) =>
                            handleInputChange("taxinclusive", e.target.checked)
                          }
                        />
                      </div>

                      <div className="cardform-separator-line"></div>

                      <div className="cardform-form-row cardform-cols-2">
                        <div className="cardform-form-group">
                          <label className="cardform-form-label">
                            Tax Category
                          </label>
                          <input
                            type="text"
                            value={formData.taxcategory}
                            onChange={(e) =>
                              handleInputChange("taxcategory", e.target.value)
                            }
                            className="cardform-form-input"
                            placeholder="Enter tax category"
                          />
                        </div>
                        <div className="cardform-form-group">
                          <label className="cardform-form-label">Tax %</label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.taxpercent}
                            onChange={(e) =>
                              handleInputChange("taxpercent", e.target.value)
                            }
                            className="cardform-form-input"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="cardform-form-row cardform-cols-2">
                        <div className="cardform-form-group">
                          <label className="cardform-form-label">Tax</label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.tax}
                            readOnly
                            className="cardform-form-input"
                            style={{ backgroundColor: "#f5f5f5" }}
                          />
                        </div>
                        <div className="cardform-form-group">
                          <label className="cardform-form-label">
                            Price No Tax
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.pricenotax}
                            readOnly
                            className="cardform-form-input"
                            style={{ backgroundColor: "#f5f5f5" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Entitlements Section */}
                  <div className="cardform-entitlements-section">
                    <div className="cardform-section-header cardform-entitlements-header">
                      Entitlements
                    </div>
                    <div className="cardform-section-content">
                      <div className="cardform-entitlements-row">
                        <div className="cardform-left-column">
                          <div className="cardform-form-group">
                            <label className="cardform-form-label">
                              Cash Balance
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.cashbalance}
                              onChange={(e) =>
                                handleInputChange("cashbalance", e.target.value)
                              }
                              className="cardform-form-input cardform-cash-balance-input"
                              placeholder="0.00"
                            />
                          </div>
                          <div className="cardform-form-group">
                            <label className="cardform-form-label">
                              Bonus Balance
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.bonus}
                              onChange={(e) =>
                                handleInputChange("bonus", e.target.value)
                              }
                              className="cardform-form-input cardform-bonus-balance-input"
                              placeholder="0.00"
                            />
                          </div>

                          <div className="cardform-bottom-entitlements-row">
                            <div className="cardform-form-group cardform-membership-group">
                              <label className="cardform-form-label">
                                Membership
                              </label>
                              <select
                                value={formData.membership}
                                onChange={(e) =>
                                  handleInputChange(
                                    "membership",
                                    e.target.value
                                  )
                                }
                                className="cardform-form-select"
                              >
                                {membershipOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="cardform-form-group cardform-active-profile-group">
                              <label className="cardform-form-label">
                                Access Profile
                              </label>
                              <select
                                value={formData.accessprofile}
                                onChange={(e) =>
                                  handleInputChange(
                                    "accessprofile",
                                    e.target.value
                                  )
                                }
                                className="cardform-form-select"
                              >
                                {accessProfileOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="cardform-right-column">
                          <div className="cardform-form-group cardform-card-expiry-group">
                            <label className="cardform-form-label">
                              Card Expiry date
                            </label>
                            <div className="cardform-date-input-with-calendar">
                              <input
                                type="date"
                                value={formData.cardexpirydate}
                                onChange={(e) =>
                                  handleInputChange(
                                    "cardexpirydate",
                                    e.target.value
                                  )
                                }
                                className="cardform-form-input cardform-card-expiry-input"
                              />
                              <span className="cardform-calendar-icon">
                                <img
                                  src={calendarIcon}
                                  alt="Calendar"
                                  className="cardform-calendar-image"
                                />
                              </span>
                            </div>
                          </div>

                          <div className="cardform-form-group cardform-card-valid-group">
                            <label className="cardform-form-label">
                              Card Valid (days)
                            </label>
                            <div className="cardform-card-valid-horizontal">
                              <input
                                type="number"
                                value={formData.cardvalidity}
                                onChange={(e) =>
                                  handleInputChange(
                                    "cardvalidity",
                                    e.target.value
                                  )
                                }
                                className="cardform-form-input cardform-card-valid-input"
                                placeholder="0"
                              />
                              <button
                                className="cardform-clear-button"
                                onClick={() =>
                                  handleInputChange("cardexpirydate", "")
                                }
                              >
                                Clear Date
                              </button>
                            </div>
                          </div>

                          <div className="cardform-quantity-vip-row">
                            <div className="cardform-form-group cardform-quantity-group">
                              <label className="cardform-form-label">
                                Quantity
                              </label>
                              <input
                                type="number"
                                value={formData.cardquantity}
                                onChange={(e) =>
                                  handleInputChange(
                                    "cardquantity",
                                    e.target.value
                                  )
                                }
                                className="cardform-form-input cardform-quantity-input"
                                placeholder="0"
                              />
                            </div>
                            <div className="cardform-vip-card-group">
                              <label
                                htmlFor="vipCard"
                                className="cardform-vip-card-label"
                              >
                                VIP Card
                              </label>
                              <input
                                type="checkbox"
                                className="cardform-checkbox cardform-vip-checkbox"
                                id="vipCard"
                                checked={formData.vipcard === 1}
                                onChange={(e) =>
                                  handleInputChange(
                                    "vipcard",
                                    e.target.checked ? 1 : 0
                                  )
                                }
                              />
                            </div>
                          </div>

                          <button
                            className="cardform-add-games-button"
                            onClick={() => setShowAddGamesModal(true)}
                          >
                            Add Games
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="cardform-sidebar">
            <div className="cardform-registration-section">
              <div className="cardform-registration-header">Registration</div>
              <div className="cardform-registration-body">
                {[
                  { label: "Photo", field: "regPhoto" },
                  { label: "First Name", field: "regFirstName" },
                  { label: "Last Name", field: "regLastName" },
                  { label: "Phone", field: "regPhone" },
                  { label: "DOB", field: "regDOB" },
                  { label: "Sex", field: "regSex" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="cardform-registration-checkbox-row"
                  >
                    <span className="cardform-registration-label">
                      {item.label}
                    </span>
                    <input
                      type="checkbox"
                      className="cardform-registration-checkbox"
                      checked={formData[item.field]}
                      onChange={(e) =>
                        handleInputChange(item.field, e.target.checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="cardform-active-days-section">
              <div className="cardform-active-days-header">
                Active days for sale
              </div>
              <div className="cardform-active-days-content">
                {[
                  { label: "Sunday", field: "sunday" },
                  { label: "Monday", field: "monday" },
                  { label: "Tuesday", field: "tuesday" },
                  { label: "Wednesday", field: "wednesday" },
                  { label: "Thursday", field: "thursday" },
                  { label: "Friday", field: "friday" },
                  { label: "Saturday", field: "saturday" },
                ].map((day, index) => (
                  <div key={index} className="cardform-day-row">
                    <span className="cardform-day-name">{day.label}</span>
                    <input
                      type="checkbox"
                      className="cardform-registration-checkbox"
                      checked={formData[day.field]}
                      onChange={(e) =>
                        handleInputChange(day.field, e.target.checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated Section */}
        <div className="cardform-last-updated-section">
          <div className="cardform-last-updated-info">
            <span className="cardform-last-updated-label">
              Last Updated Date
            </span>
            <span className="cardform-last-updated-value">
              {formData.lastupdateddate
                ? formatDateTime(formData.lastupdateddate)
                : "N/A"}
            </span>
            <span className="cardform-last-updated-label">
              Last Updated User
            </span>
            <span className="cardform-last-updated-value">
              {formData.lastupdateduser || "N/A"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="cardform-modal-footer">
          <button
            className="cardform-footer-button cardform-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            className="cardform-footer-button cardform-new"
            onClick={handleNew}
          >
            New
          </button>
          <button
            className="cardform-footer-button cardform-duplicate"
            onClick={handleDuplicate}
            disabled={!isEditMode}
          >
            Duplicate
          </button>
          <button
            className="cardform-footer-button cardform-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>

      {showAddGamesModal && (
        <AddGamesModal
          isOpen={showAddGamesModal}
          onClose={() => setShowAddGamesModal(false)}
        />
      )}
    </div>
  );
};

export default CardProductForm;
