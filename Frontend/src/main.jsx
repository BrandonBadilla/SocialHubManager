import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import OTPVerification from "./pages/OTPVerification.jsx";
import './styles/style.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
