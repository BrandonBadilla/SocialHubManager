import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const OTPVerification = () => {
  const [otpCode, setOtpCode] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Error: Usuario no autenticado');
      return;
    }
    try {
      const response = await fetch('/api/login/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token: otpCode }),
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('userId', result.userId);
        sessionStorage.setItem('username', result.username)
        navigate('/home');
      } else {
        alert(result.message || 'Error al verificar OTP');
      }
    } catch (error) {
      console.error('Error al verificar OTP:', error);
    }
  };

  return (
    <form onSubmit={handleVerify}>
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
  );
};

export default OTPVerification;