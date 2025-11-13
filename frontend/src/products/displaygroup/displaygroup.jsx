import React, { useState } from 'react';
import './displaygroup.css';
import DisplayGroupAdd from "./displaygroupadd";

const DisplayGroup = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const [groupData, setGroupData] = useState([
    {
      id: 1,
      active: false,
      displayOrder: 34,
      groupName: 'Trampoline Park',
      subItems: [{ name: 'Round Trampoline', isActive: true }]
    },
    {
      id: 2,
      active: false,
      displayOrder: 45,
      groupName: 'Ninja Park',
      subItems: [
        { name: 'Intermediate Zone', isActive: true },
        { name: 'Advanced Zone', isActive: true }
      ]
    },
    {
      id: 3,
      active: false,
      displayOrder: 89,
      groupName: 'Climbing Wall',
      subItems: [
        { name: 'Bouldering Wall', isActive: true },
        { name: 'Overhang Boulders', isActive: true },
        { name: 'Traverse Wall', isActive: true },
        { name: 'Low Height', isActive: true }
      ]
    }
  ]);

  const handleToggleActive = (id) => {
    setGroupData((prev) =>
      prev.map((group) =>
        group.id === id ? { ...group, active: !group.active } : group
      )
    );
  };

  const handleAddGroup = () => setShowAddModal(true);
  const handleCloseModal = () => setShowAddModal(false);
  const handleSaveGroup = (groupData) => {
    console.log('New group data:', groupData);
    setShowAddModal(false);
  };

  return (
    <div className="display-group-container-gd">
      {/* Header */}
      <div className="display-group-header-gd">
        <h1 className="page-title-gd">
          <img
            src={require('../../components/assets/display-group-icon.png')}
            alt="Display Group Icon"
            className="title-icon-gd"
          />
          Display Group
        </h1>
        <div className="controls-section-gd">
          <button className="refresh-btn-gd">Refresh</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container-gd">
        <div className="table-header-gd">
          <div className="column-header-gd">
            Active <img src={require('../../components/assets/arrows.png')} alt="Sort" className="sort-arrow-gd" />
          </div>
          <div className="column-header-gd">
            Display order <img src={require('../../components/assets/arrows.png')} alt="Sort" className="sort-arrow-gd" />
          </div>
          <div className="column-header-gd">Group</div>
          <div className="column-header-gd header-actions-gd">
            <button className="add-group-btn-gd" onClick={handleAddGroup}>Add Group</button>
          </div>
        </div>

        {/* Group List */}
        <div className="group-list-gd">
          {groupData.map((group) => (
            <div key={group.id} className="group-item-gd">
              <div className="group-main-row-gd">
                <div className="active-cell-gd">
                  <button
                    className="active-toggle-btn-gd"
                    onClick={() => handleToggleActive(group.id)}
                  >
                    <div className={`checkbox-outer-gd ${group.active ? 'active-gd' : ''}`}>
                      {group.active && <img src={require('../../components/assets/Checklist.png')} alt="Check" className="checkbox-inner-gd" />}
                    </div>
                  </button>
                </div>

                <div className="display-order-cell-gd">
                  <span className="order-number-gd">{group.displayOrder}</span>
                </div>
                <div className="group-name-cell-gd">
                  <span className="group-name-gd">{group.groupName}</span>
                </div>
                <div className="group-actions-cell-gd">
                  <button className="action-btn-gd add-btn">
                    <img src={require('../../components/assets/group-add.png')} alt="Add" className="action-icon-gd" />
                  </button>
                  <button className="action-btn-gd cancel-btn">
                    <img src={require('../../components/assets/group-cancel.png')} alt="Cancel" className="action-icon-gd" />
                  </button>
                </div>
              </div>

              {/* Sub Items */}
              <div className="sub-items-gd">
                {group.subItems.map((item, idx) => (
                  <div key={idx} className="sub-item-gd">
                    <div className="sub-item-active-cell-gd"></div>
                    <div className="sub-item-order-cell-gd"></div>
                    <div className="sub-item-content-cell-gd">
                      <span className="sub-item-content-gd">{item.name}</span>
                    </div>
                    <div className="sub-item-actions-cell-gd">
                      <button className="action-btn-gd add-btn">
                        <img src={require('../../components/assets/black_add.png')} alt="Add" className="action-icon-gd" />
                      </button>
                      <button className="action-btn-gd cancel-btn">
                        <img src={require('../../components/assets/black_cancel.png')} alt="Cancel" className="action-icon-gd" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Group Modal */}
      <DisplayGroupAdd 
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSave={handleSaveGroup}
      />
    </div>
  );
};

export default DisplayGroup;