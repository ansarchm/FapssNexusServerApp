import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { gameCategoryService } from "../services/api";

import "./gameCategory.css";

const GameCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load data from backend on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, subCategoriesData] = await Promise.all([
        gameCategoryService.getAllCategories(),
        gameCategoryService.getAllSubCategories()
      ]);
      
      // Transform backend data to match component state format
      const formattedCategories = categoriesData.map(cat => ({
        id: cat.id,
        description: cat.description,
        created: new Date(cat.createdDate).toLocaleString(),
        lastUsed: new Date(cat.lastUsedDate).toLocaleString(),
        isNew: false
      }));
      
      const formattedSubCategories = subCategoriesData.map(sub => ({
        id: sub.id,
        description: sub.description,
        created: new Date(sub.createdDate).toLocaleString(),
        lastUsed: new Date(sub.lastUsedDate).toLocaleString(),
        isNew: false
      }));
      
      setCategories(formattedCategories);
      setSubCategories(formattedSubCategories);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load categories: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new row (not default)
  const handleAddCategory = () => {
    const newCategory = {
      id: Date.now(),
      description: "",
      created: new Date().toLocaleString(),
      lastUsed: new Date().toLocaleString(),
      isNew: true,
    };
    setCategories([...categories, newCategory]);
  };

  const handleAddSubCategory = () => {
    const newSubCategory = {
      id: Date.now(),
      description: "",
      created: new Date().toLocaleString(),
      lastUsed: new Date().toLocaleString(),
      isNew: true,
    };
    setSubCategories([...subCategories, newSubCategory]);
  };

  // ✅ Handle description typing
  const handleDescriptionChange = (id, value, type) => {
    if (type === "category") {
      setCategories((prev) =>
        prev.map((item) => (item.id === id ? { ...item, description: value } : item))
      );
    } else {
      setSubCategories((prev) =>
        prev.map((item) => (item.id === id ? { ...item, description: value } : item))
      );
    }
  };

  // ✅ Save to backend (only new ones)
  const handleSaveCategories = async () => {
    const newOnes = categories.filter((c) => c.isNew && c.description.trim() !== "");
    if (newOnes.length === 0) return alert("No new categories to save.");

    try {
      for (const cat of newOnes) {
        await gameCategoryService.addCategory({ Description: cat.description });
      }
      alert("✅ Categories saved to server!");
      // Reload data from backend to get actual IDs
      await loadData();
    } catch (err) {
      console.error("❌ Error saving categories:", err);
      alert("Error saving categories to server: " + err.message);
    }
  };

  const handleSaveSubCategories = async () => {
    const newOnes = subCategories.filter((s) => s.isNew && s.description.trim() !== "");
    if (newOnes.length === 0) return alert("No new subcategories to save.");

    try {
      for (const sub of newOnes) {
        await gameCategoryService.addSubCategory({ Description: sub.description });
      }
      alert("✅ Sub-categories saved to server!");
      // Reload data from backend to get actual IDs
      await loadData();
    } catch (err) {
      console.error("❌ Error saving subcategories:", err);
      alert("Error saving sub-categories to server: " + err.message);
    }
  };

  // ✅ Delete from backend
  const handleDeleteItem = async (id, type) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this?");
    if (!confirmDelete) return;

    try {
      if (type === "category") {
        await gameCategoryService.deleteCategory(id);
        setCategories(categories.filter((item) => item.id !== id));
        alert("✅ Category deleted successfully");
      } else {
        await gameCategoryService.deleteSubCategory(id);
        setSubCategories(subCategories.filter((item) => item.id !== id));
        alert("✅ Sub-category deleted successfully");
      }
    } catch (err) {
      console.error("❌ Error deleting:", err);
      alert("Error deleting: " + err.message);
    }
  };

  return (
    <div className="game-category-container">
      {/* Header */}
      <div className="game-category-header">
        <span className="game-category-header-icon">🎮</span>
        <h1 className="game-category-header-title">Game Category</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
      ) : (
        <>
          {/* CATEGORY SECTION */}
          <div className="game-category-section">
            <div className="game-category-section-header">
              <div className="game-category-section-header-content">
                <h2 className="game-category-section-title">Category</h2>
                <div className="game-category-button-group">
                  <button onClick={handleAddCategory} className="game-category-btn-add">Add</button>
                  <button onClick={handleSaveCategories} className="game-category-btn-save">Save</button>
                </div>
              </div>
            </div>

            <div className="game-category-table-container">
              <div className="game-category-table-header">
                <div className="game-category-table-header-cell">Description</div>
                <div className="game-category-table-header-cell">Created</div>
                <div className="game-category-table-header-cell">Last used</div>
                <div className="game-category-table-header-cell"></div>
              </div>

              <div className="game-category-table-body">
                {categories.map((item, index) => (
                  <div key={item.id} className={`game-category-table-row ${index % 2 === 1 ? "even" : "odd"}`}>
                    <div className="game-category-table-cell">
                      {item.isNew ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleDescriptionChange(item.id, e.target.value, "category")}
                          placeholder="Enter category name"
                          className="editable-input"
                        />
                      ) : (
                        item.description
                      )}
                    </div>
                    <div className="game-category-table-cell small-text">{item.created}</div>
                    <div className="game-category-table-cell small-text">{item.lastUsed}</div>
                    <div className="game-category-table-cell action">
                      <button onClick={() => handleDeleteItem(item.id, "category")} className="game-category-delete-button">
                        <Trash2 size={16} color="#6b7280" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SUB-CATEGORY SECTION */}
          <div className="game-category-section">
            <div className="game-category-section-header">
              <div className="game-category-section-header-content">
                <h2 className="game-category-section-title">Sub-Category</h2>
                <div className="game-category-button-group">
                  <button onClick={handleAddSubCategory} className="game-category-btn-add">Add</button>
                  <button onClick={handleSaveSubCategories} className="game-category-btn-save">Save</button>
                </div>
              </div>
            </div>

            <div className="game-category-table-container">
              <div className="game-category-table-header">
                <div className="game-category-table-header-cell">Description</div>
                <div className="game-category-table-header-cell">Created</div>
                <div className="game-category-table-header-cell">Last used</div>
                <div className="game-category-table-header-cell"></div>
              </div>

              <div className="game-category-table-body">
                {subCategories.map((item, index) => (
                  <div key={item.id} className={`game-category-table-row ${index % 2 === 1 ? "even" : "odd"}`}>
                    <div className="game-category-table-cell">
                      {item.isNew ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleDescriptionChange(item.id, e.target.value, "subcategory")}
                          placeholder="Enter sub-category name"
                          className="editable-input"
                        />
                      ) : (
                        item.description
                      )}
                    </div>
                    <div className="game-category-table-cell small-text">{item.created}</div>
                    <div className="game-category-table-cell small-text">{item.lastUsed}</div>
                    <div className="game-category-table-cell action">
                      <button onClick={() => handleDeleteItem(item.id, "subcategory")} className="game-category-delete-button">
                        <Trash2 size={16} color="#6b7280" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GameCategory;