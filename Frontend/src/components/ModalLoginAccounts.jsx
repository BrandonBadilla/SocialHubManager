import React from 'react';
import '../styles/ModalLoginAccounts.css';

const ModalLoginAccounts = ({ onClose, onConfirm, title, message }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
          <button className="btn-confirm" onClick={onConfirm}>Continuar</button>
          <button className="btn-cancel" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalLoginAccounts;