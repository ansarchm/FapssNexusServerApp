import React, { useState } from 'react';
import './displaygroupadd.css';
import ConsoleIcon from '../../components/assets/console.png';

const DisplayGroupAdd = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    group: '',
    image: null,
    imagePreview: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: file.name
      }));
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      group: '',
      image: null,
      imagePreview: ''
    });
    if (onClose) {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-displaygroupadd" onClick={handleOverlayClick}>
      <div className="modal-container-displaygroupadd">
        {/* Modal Header */}
        <div className="modal-header-displaygroupadd">
          <div className="modal-title-section-displaygroupadd">
            <img src={ConsoleIcon} alt="Console Icon" className="modal-icon-displaygroupadd" />
            <h2 className="modal-title-displaygroupadd">New Group</h2>
          </div>
          <button className="close-btn-displaygroupadd" onClick={handleClose}>
            <svg className="close-icon-displaygroupadd" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Details Section */}
        <div className="details-section-displaygroupadd">
          <h3 className="details-title-displaygroupadd">Details</h3>
        </div>

        {/* Details Container */}
        <div className="details-container-displaygroupadd">
          {/* Form Content */}
          <div className="form-content-displaygroupadd">
            <div className="form-group-displaygroupadd">
              <label className="form-label-displaygroupadd" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input-displaygroupadd"
                placeholder="Trampoline"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group-displaygroupadd">
              <label className="form-label-displaygroupadd" htmlFor="group">Group</label>
              <input
                type="text"
                id="group"
                name="group"
                className="form-input-displaygroupadd"
                placeholder="Products/Climbing Wall/Low height/"
                value={formData.group}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group-displaygroupadd">
              <label className="form-label-displaygroupadd">Image</label>
              <div className="image-upload-section-displaygroupadd">
                <div className="file-input-container-displaygroupadd">
                  <div className="file-input-wrapper-displaygroupadd">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      className="file-input-displaygroupadd"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="image" className="file-input-label-displaygroupadd">
                      <div className="file-input-left-section-displaygroupadd">
                        <span className="file-input-text-displaygroupadd">Choose File</span>
                      </div>
                      <div className="file-input-separator-displaygroupadd"></div>
                      <div className="file-input-right-section-displaygroupadd">
                        <span className="file-preview-text-displaygroupadd">
                          {formData.imagePreview || 'Trampoline.jpg'}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions-displaygroupadd">
          <button className="action-button-displaygroupadd save-btn-displaygroupadd" onClick={handleSave}>
            Save
          </button>
          <button className="action-button-displaygroupadd close-action-btn-displaygroupadd" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplayGroupAdd;