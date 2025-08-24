import React from 'react';
import { useNavigate } from 'react-router-dom';     // Importa useNavigate
import '../styles/DashboardPage.css';           

const DashboardPage = () => {
    const navigate = useNavigate();                 // Inicializa useNavigate

    const handleCreatePost = () => {
        navigate("/create-post");                   // Navega a la página de posts
    };

    const handleSchedule = () => {
        navigate("/schedule");                      // Navega a la página de horarios
    };

    const handleGoBack = () => {
        navigate(-1); // Regresa a la página anterior
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <ul>
                    <li onClick={handleCreatePost}>Crear una Publicación</li>
                    <li onClick={handleSchedule}>Horarios de Publicación</li>
                    <li onClick={handleGoBack}>← Volver</li>
                </ul>
            </nav>

            <div className="dashboard-content">
                {/* Aquí tu contenido principal del dashboard */}
            </div>
        </div>
    );
};

export default DashboardPage;