import React from "react";

const QRCodeDisplay = ({ qrCodeUrl }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {qrCodeUrl ? (
        <div>
          <p>Escanea este código QR para habilitar 2FA:</p>
          <img src={qrCodeUrl} alt="Código QR para 2FA" style={{ maxWidth: "300px" }} />
        </div>
      ) : (
        <p>No hay un código QR disponible para mostrar.</p>
      )}
    </div>
  );
};

export default QRCodeDisplay;