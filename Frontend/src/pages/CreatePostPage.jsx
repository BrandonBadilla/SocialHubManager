import React, { useState } from 'react';
import '../styles/CreatePostPage.css';
import InstantPost from '../components/posts/InstantPost.jsx';
import ScheduledPost from '../components/posts/ScheduledPost.jsx';
import QueuePost from '../components/posts/PostQueue.jsx';

const CreatePostPage = () => {
  const [selectedPostType, setSelectedPostType] = useState('');
  const [selectedSocialMedia, setSelectedSocialMedia] = useState('');

  const resetForm = () => {
    setSelectedPostType('');
    setSelectedSocialMedia('');
  };

  const renderPostComponent = () => {
    switch (selectedPostType) {
      case 'instantaneo':
        return <InstantPost selectedSocialMedia={selectedSocialMedia} onReset={resetForm} />;
      case 'cola':
        return <QueuePost selectedSocialMedia={selectedSocialMedia} onReset={resetForm} />;
      case 'programado':
        return <ScheduledPost selectedSocialMedia={selectedSocialMedia} onReset={resetForm} />;
      default:
        return null;
    }
  };

  return (
    <div className="create-post-page">
      <h1 className="create-post-title">Crear Post / Social Hub</h1>

      {/* Selección de Red Social */}
      <div className="social-media-options">
        <h3>Seleccione la Red Social:</h3>
        {['Red 1', 'Mastodon', 'Ambas'].map((media) => (
          <button
            key={media}
            className={`social-button ${selectedSocialMedia === media.toLowerCase() ? 'active' : ''}`}
            onClick={() => setSelectedSocialMedia(media.toLowerCase())}
          >
            {media}
          </button>
        ))}
      </div>

      {/* Selección de tipo de post */}
      <div className="post-type-options">
        <h3>Seleccione el Tipo de Post:</h3>
        {[
          { label: 'Instantáneo', value: 'instantaneo' },
          { label: 'En cola', value: 'cola' },
          { label: 'Programado', value: 'programado' },
        ].map((post) => (
          <div
            key={post.value}
            className={`post-card ${selectedPostType === post.value ? 'selected' : ''}`}
            onClick={() => setSelectedPostType(post.value)}
          >
            {post.label}
          </div>
        ))}
      </div>

      {/* Render del componente de post */}
      <div className="posts-field">{renderPostComponent()}</div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Volver
      </button>
    </div>
  );
};

export default CreatePostPage;
