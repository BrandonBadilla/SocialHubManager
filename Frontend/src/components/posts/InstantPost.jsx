import React, { useState } from 'react';
import '../../styles/CreatePost.css';

const InstantPost = ({ selectedSocialMedia, onReset }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublished, setIsPublished] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const postData = { title, content };
    
        if (selectedSocialMedia === 'mastodon') {
            try {
                console.log('Enviando post a Mastodon:', postData);
                const token = sessionStorage.getItem('mastodonToken');
    
                if (!token) {
                    console.error('Token no encontrado. Inicia sesión en Mastodon primero.');
                    return;
                }
    
                const response = await fetch('http://localhost:4000/mastodon/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...postData,
                        token,
                    }),
                });
    
                if (!response.ok) {
                    const error = await response.json();
                    console.error('Error al publicar en Mastodon:', error);
                    return;
                }
    
                console.log('Post publicado en Mastodon exitosamente:', await response.json());
            } catch (error) {
                console.error('Error al enviar post a Mastodon:', error);
            }
        } else {
            console.log('Red social no soportada o seleccionada:', selectedSocialMedia);
        }
    

        setTitle('');
        setContent('');
        setIsPublished(true);

        onReset();

        setTimeout(() => setIsPublished(false), 3000);
    };
    

    return (
        <div className="post-container">
            <h2 className="post-header">Post Instantáneo</h2>
            {isPublished && (
                <div className="success-message">
                    ¡El post ha sido publicado con éxito!
                </div>
            )}
            <form onSubmit={handleSubmit} className="post-form">
                <div className="post-group">
                    <label htmlFor="title" className="post-label">Título:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="post-input"
                        placeholder="Escribe el título aquí"
                        required
                    />
                </div>
                <div className="post-group">
                    <label htmlFor="content" className="post-label">Contenido:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="post-textarea"
                        placeholder="Escribe el contenido aquí"
                        required
                    />
                </div>
                <button type="submit" className="post-button">Publicar</button>
            </form>
        </div>
    );
};

export default InstantPost;