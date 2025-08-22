import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AccountConfig from "./pages/AccountConfigPage.jsx"
import Dashboard from "./pages/DashboardPage.jsx";
import Home from "./pages/HomePage.jsx";
import LoginPage from "./pages/Login.jsx";
import OTPVerification from "./pages/OTPVerification.jsx";
import RegisterPage from "./pages/Register.jsx";
import SchedulePage from './pages/SchedulePage.jsx';

import './styles/style.css';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  if (!token || !userId) {
    return <Navigate to="/" replace />;
  }
  return children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OTPVerification />} />

        {/* Rutas protegidas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account-config"
          element={
            <ProtectedRoute>
              <AccountConfig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <SchedulePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
