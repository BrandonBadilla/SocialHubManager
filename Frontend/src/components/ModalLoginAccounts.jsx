import React from 'react';
import '../styles/ModalLoginAccounts.css';
import { redirectToMastodonAuth } from '../../utils/MastodonAPI.js';
import { redirectToRedditAuth } from '../../utils/RedditAPI.js';

const ModalLoginAccounts = ({ accountType, onClose, onConfirm, message }) => {
  const handleLogin = () => {
    if (accountType === "mastodon") {
      redirectToMastodonAuth();
    } else if (accountType === "reddit") {
      redirectToRedditAuth();
    }
    onConfirm();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn-confirm" onClick={handleLogin}>
            {accountType === "mastodon"
              ? "Iniciar sesión con Mastodon"
              : "Iniciar sesión con Reddit"}
          </button>
          <button className="btn-cancel" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalLoginAccounts;