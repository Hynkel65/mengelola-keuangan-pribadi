import React from 'react';

import '../style/DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ show, onClose, onDelete }) => {
  if (!show) return null;

  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-content">
          <p>Apakah Anda yakin ingin menghapus ini? Tindakan ini tidak dapat dibatalkan.</p>
          <button onClick={onDelete}>Ya, Hapus</button>
          <button onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
