import React, { useState } from "react";
import { Link } from "react-router-dom";
import QRCodeDisplay from "../components/QRCodeDisplay";
import "../styles/SchedulePage.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Estado para el modal
  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
  });

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
        setModal({
          visible: true,
          title: "Registro Exitoso",
          message: result.message,
        });
      } else {
        setModal({
          visible: true,
          title: "Error",
          message: result.error || "Error al registrar el usuario",
        });
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      setModal({
        visible: true,
        title: "Error",
        message: "Error al registrar el usuario",
      });
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

      {/* Modal de éxito / error */}
      {modal.visible && (
        <div
          className="modal-overlay"
          onClick={() => setModal({ ...modal, visible: false })}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modal.title}</h3>
            <p>{modal.message}</p>
            <button
              className="confirm"
              onClick={() => setModal({ ...modal, visible: false })}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;