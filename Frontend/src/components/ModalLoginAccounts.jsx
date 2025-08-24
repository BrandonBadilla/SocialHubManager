import React from 'react';
import '../styles/ModalLoginAccounts.css';
import { redirectToMastodonAuth } from '../../utils/MastodonAPI.js';

const ModalLoginAccounts = ({ onClose }) => {
    const handleLogin = () => {
        redirectToMastodonAuth(); // Redirige al flujo de autenticación de Mastodon
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Iniciar sesión en Mastodon</h2>
                <p>Para continuar, serás redirigido a la página de autorización de Mastodon.</p>
                <button className="login-button" onClick={handleLogin}>
                    Iniciar sesión con Mastodon
                </button>
                <button className="close-button" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ModalLoginAccounts;