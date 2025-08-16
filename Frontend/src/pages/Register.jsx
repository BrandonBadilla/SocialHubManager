import React, { useState } from "react";
import { Link } from "react-router-dom";
import QRCodeDisplay from "../components/QRCodeDisplay";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        setQrCodeUrl(result.qrCodeUrl); // Guardar URL del QR
        alert(result.message); // Mostrar mensaje de éxito
      } else {
        alert(result.error || "Error al registrar el usuario");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
        <h2>Registrarse</h2>
        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
        <p>
          ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
        </p>
      </form>

      {/* Mostrar el componente QRCodeDisplay si hay un QR disponible */}
      {qrCodeUrl && <QRCodeDisplay qrCodeUrl={qrCodeUrl} />}

    </div>
  );
};

export default RegisterPage;