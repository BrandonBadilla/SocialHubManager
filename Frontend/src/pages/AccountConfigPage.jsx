import React, { useState } from 'react';
import '../styles/AccountConfigPage.css'
import BackButton from "../components/BackButton";
import ModalLoginAccounts from "../components/ModalLoginAccounts";

const AccountConfigPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeAccount, setActiveAccount] = useState(null); // LinkedIn o Mastodon
    const [pendingState, setPendingState] = useState(null);
    const [checkedAccounts, setCheckedAccounts] = useState({
        twitter: false,
        mastodon: false
    });

    const closeModal = () => {
        setIsModalOpen(false);
        setActiveAccount(null);
        setPendingState(null);
    };

    const handleCheckboxChange = (account) => {
        // Invertimos el estado actual para saber qué quiere el usuario
        const nextState = !checkedAccounts[account];
        setPendingState(nextState);
        setActiveAccount(account);
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        // Aplica el cambio (activar o desactivar)
        setCheckedAccounts(prev => ({
        ...prev,
        [activeAccount]: pendingState
        }));
        closeModal();
    };

    return(
        <div>
            <div className="container-back-button">
                <BackButton 
                    label="Regresar" 
                    className="custom-back-btn" 
                    fallbackPath="/home"
                />
            </div>
            <h1>Configuración de Cuentas</h1>
            <div className="grid-divs-container">
                <div className="grid-div">
                    <img src="/images/twitter.jpg" alt="Twitter" className="div-icon" />
                    Twitter
                    <label className="switch">
                        <input
                        type="checkbox"
                        checked={!!checkedAccounts.twitter}
                        onChange={() => handleCheckboxChange('twitter')}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="grid-div">
                    <img src="/images/mastodon.png" alt="Mastodon" className="div-icon" />
                    Mastodon
                    <label className="switch">
                        <input
                        type="checkbox"
                        checked={!!checkedAccounts.mastodon}
                        onChange={() => handleCheckboxChange('mastodon')}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            {isModalOpen && (
                <ModalLoginAccounts
                    accountType={activeAccount}
                    onConfirm={handleConfirm}
                    onClose={closeModal}
                    title="¡Atención!"
                    message={
                        pendingState
                        ? "Estás activando esta cuenta. ¿Deseas continuar?"
                        : "Estás desactivando esta cuenta. ¿Deseas continuar?"
                    }
                />
            )}
        </div>
    )
}

export default AccountConfigPage;