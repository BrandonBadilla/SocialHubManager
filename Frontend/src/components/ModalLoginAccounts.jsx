import React from 'react';
import '../styles/ModalLoginAccounts.css';
import { redirectToMastodonAuth } from '../../utils/MastodonAPI.js';

const ModalLoginAccounts = ({ accountType, onClose, onConfirm, message }) => {
  const handleLogin = () => {
    if (accountType === "mastodon") {
      redirectToMastodonAuth();
    } else if (accountType === "linkedin") {
      // Aquí podrías agregar la redirección de LinkedIn
      console.log("Redirigiendo a LinkedIn...");
    }
    onConfirm();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          {accountType === "mastodon" ? "Iniciar sesión en Mastodon" : "Iniciar sesión en LinkedIn"}
        </h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn-confirm" onClick={handleLogin}>
            {accountType === "mastodon" ? "Iniciar sesión con Mastodon" : "Iniciar sesión con LinkedIn"}
          </button>
          <button className="btn-cancel" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalLoginAccounts;
