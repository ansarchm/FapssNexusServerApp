import React, { useState, useEffect } from 'react';
import './timeproductadd.css';
import GameIcon from '../../components/assets/game.png';

const AddGamesModal = ({ isOpen, onClose }) => {
  const [selectedGames, setSelectedGames] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true
  });

  const games = [
    { id: 1, name: 'Games 1', count: 1 },
    { id: 2, name: 'Games 2', count: 2 },
    { id: 3, name: 'Games 3', count: 3 },
    { id: 4, name: 'Games 4', count: 4 },
    { id: 5, name: 'Games 5', count: 5 },
    { id: 6, name: 'Games 6', count: 6 },
    { id: 7, name: 'Games 7', count: 7 },
    { id: 8, name: 'Games 8', count: 8 }
  ];

  // Toggle checkbox state
  const handleCheckboxChange = (gameId) => {
    setSelectedGames(prev => ({
      ...prev,
      [gameId]: !prev[gameId]
    }));
  };

  // Save selected games
  const handleSave = () => {
    console.log('Selected games:', selectedGames);
    onClose();
  };

  // Cancel modal
  const handleCancel = () => {
    onClose();
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="time-add-modal-overlay" onClick={onClose}>
      <div 
        className="time-add-modal-container"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Header */}
        <div className="time-add-modal-header">
          <div className="time-add-header-content">
            <img 
              src={GameIcon} 
              alt="Games" 
              className="time-add-game-image" 
            />
            <h2 className="time-add-modal-title">Add Games</h2>
          </div>
          <button 
            onClick={handleCancel}
            className="time-add-close-button"
          >
            <svg className="time-add-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Table Container */}
        <div className="time-add-table-container">
          <div className="time-add-table-wrapper">
            <table className="time-add-games-table">
              <thead className="time-add-table-header">
                <tr>
                  <th className="time-add-header-cell time-add-header-cell-select">Select</th>
                  <th className="time-add-header-cell time-add-header-cell-game">Game</th>
                  <th className="time-add-header-cell time-add-header-cell-count">Play Count</th>
                </tr>
              </thead>
              <tbody className="time-add-table-body">
                {games.map((game, index) => (
                  <tr 
                    key={game.id} 
                    className={`time-add-body-row ${index % 2 === 0 ? 'time-add-row-yellow' : 'time-add-row-white'}`}
                  >
                    <td className="time-add-table-cell time-add-cell-select">
                      <div className="time-add-checkbox-container">
                        <input
                          type="checkbox"
                          id={`game-${game.id}`}
                          checked={selectedGames[game.id] || false}
                          onChange={() => handleCheckboxChange(game.id)}
                          className="time-add-checkbox-input"
                        />
                        <label
                          htmlFor={`game-${game.id}`}
                          className={`time-add-checkbox-label ${selectedGames[game.id] ? 'time-add-checkbox-checked' : 'time-add-checkbox-unchecked'}`}
                        >
                          {selectedGames[game.id] && (
                            <svg className="time-add-checkmark" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </label>
                      </div>
                    </td>
                    <td className="time-add-table-cell time-add-cell-game">{game.name}</td>
                    <td className="time-add-table-cell time-add-cell-count">{game.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="time-add-modal-footer">
          <button onClick={handleSave} className="time-add-save-button">Save</button>
          <button onClick={handleCancel} className="time-add-cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddGamesModal;