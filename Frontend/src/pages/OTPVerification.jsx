import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OTPVerification.css';

const OTPVerification = () => {
  const [otpCode, setOtpCode] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Para indicar si es éxito o error
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      setModalMessage('Error: Usuario no autenticado');
      setIsSuccess(false);
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await fetch('/api/login/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token: otpCode }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // OTP correcto
        setModalMessage(result.message || 'OTP verificado con éxito');
        setIsSuccess(true);
        setShouldNavigate(true);

        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('userId', result.userId);
        sessionStorage.setItem('username', result.username);
      } else {
        // OTP incorrecto o expirado
        setModalMessage(result.message || 'Código OTP inválido o expirado');
        setIsSuccess(false);
      }

      setIsModalOpen(true); // Abrimos el modal siempre, correcto o error
    } catch (error) {
      console.error('Error al verificar OTP:', error);
      setModalMessage('Error de conexión al verificar OTP');
      setIsSuccess(false);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (shouldNavigate) {
      navigate('/home');
    }
  };

  return (
    <div className="otp-container">
      <form onSubmit={handleVerify} className="otp-form">
        <h2>Verificar OTP</h2>
        <input
          type="text"
          placeholder="Código OTP"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          required
        />
        <button type="submit">Verificar</button>
      </form>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className={`modal-content ${isSuccess ? 'modal-success' : 'modal-error'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <p>{modalMessage}</p>
            <button onClick={handleCloseModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPVerification;
