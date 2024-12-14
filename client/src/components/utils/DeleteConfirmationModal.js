import React from 'react';

import '../style/DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ show, onClose, onDelete }) => {
  if (!show) return null;

  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-content">
          <p>Are you sure you want to delete this? This action can't be undone.</p>
          <button onClick={onDelete}>Yes, Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
