import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleCreatePost = () => navigate("/create-post");
    const handleSchedule = () => navigate("/schedule");
    const handleGoBack = () => navigate(-1);

    useEffect(() => {
        const fetchQueue = async () => {
            const userId = sessionStorage.getItem("userId");
            if (!userId) {
                console.error("No se encontró el ID del usuario.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/api/queue-posts/${userId}`);
                if (!response.ok) throw new Error("Error al obtener la cola de publicaciones");
                const data = await response.json();
                setQueue(data);
            } catch (error) {
                console.error("Error cargando la cola:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQueue();
    }, []);

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
                <h2>Cola de Publicaciones</h2>

                {loading ? (
                    <p>Cargando cola...</p>
                ) : queue.pending.length === 0 && queue.published.length === 0 ? (
                    <p>No tienes publicaciones en la cola.</p>
                ) : (
                    <>
                        <h3>Pendientes</h3>
                        <table className="queue-table">
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Contenido</th>
                                    <th>Red Social</th>
                                    <th>Fecha Programada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queue.pending.map(post => (
                                    <tr key={post.id}>
                                        <td>{post.title}</td>
                                        <td>{post.content}</td>
                                        <td>{post.social_network}</td>
                                        <td>{post.scheduled_time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h3>Publicados</h3>
                        <table className="queue-table">
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Contenido</th>
                                    <th>Red Social</th>
                                    <th>Fecha Publicada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queue.published.map(post => (
                                    <tr key={post.id}>
                                        <td>{post.title}</td>
                                        <td>{post.content}</td>
                                        <td>{post.social_network}</td>
                                        <td>{post.published_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;