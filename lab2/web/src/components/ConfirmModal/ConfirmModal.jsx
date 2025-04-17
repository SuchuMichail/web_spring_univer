import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-content">
        <p>{message}</p>
        <div className="confirm-modal-actions">
          <button onClick={onCancel} className="btn btn-outline">
            Отмена
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Да, удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;