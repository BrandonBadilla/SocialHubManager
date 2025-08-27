import React, { useState } from 'react';
import '../../styles/CreatePost.css';

const InstantPost = ({ selectedSocialMedia, onReset }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { title, content };

    try {
      // Publicar en Mastodon si se selecciona Mastodon o Ambas
      if (selectedSocialMedia === 'mastodon' || selectedSocialMedia === 'ambas') {
        const token = sessionStorage.getItem('mastodonToken');
        if (!token) {
          console.error('Token de Mastodon no encontrado. Inicia sesión primero.');
        } else {
          const response = await fetch('http://localhost:4000/mastodon/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...postData, token }),
          });
          if (!response.ok) {
            const error = await response.json();
            console.error('Error al publicar en Mastodon:', error);
          } else {
            console.log('Post publicado en Mastodon exitosamente:', await response.json());
          }
        }
      }

      // Publicar en Reddit si se selecciona Reddit o Ambas
      if (selectedSocialMedia === 'reddit' || selectedSocialMedia === 'ambas') {
        const accessToken = sessionStorage.getItem('redditAccessToken');
        if (!accessToken) {
          console.error('Token de Reddit no encontrado. Autentícate primero.');
        } else {
          const subreddit = 'test'; // <- reemplaza por tu subreddit
          const response = await fetch('http://localhost:4000/reddit/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...postData, access_token: accessToken, subreddit }),
          });
          if (!response.ok) {
            const error = await response.json();
            console.error('Error al publicar en Reddit:', error);
          } else {
            console.log('Post publicado en Reddit exitosamente:', await response.json());
          }
        }
      }

      setTitle('');
      setContent('');
      setIsPublished(true);
      onReset();
      setTimeout(() => setIsPublished(false), 3000);

    } catch (error) {
      console.error('Error al enviar post:', error);
    }
  };

  return (
    <div className="post-container">
      <h2 className="post-header">Post Instantáneo</h2>
      {isPublished && <div className="success-message">¡El post ha sido publicado con éxito!</div>}
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