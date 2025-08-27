import React, { useEffect } from 'react';

const RedditAuth = () => {
  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code'); // Captura el código de autorización

      if (!code) {
        console.error('No se encontró un código de autorización.');
        return;
      }

      try {
        // Llama al backend para intercambiar el código por un token
        const response = await fetch('http://localhost:4000/reddit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            redirect_uri: import.meta.env.VITE_REDDIT_REDIRECT_URI
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(`Error al obtener token: ${errData.error || 'Unknown'}`);
        }

        const data = await response.json();
        const { access_token, refresh_token, expires_in, scope } = data;

        // Guardar token en sessionStorage
        sessionStorage.setItem('redditAccessToken', access_token);
        if (refresh_token) sessionStorage.setItem('redditRefreshToken', refresh_token);
        if (expires_in) sessionStorage.setItem('redditTokenExpiresIn', expires_in);
        if (scope) sessionStorage.setItem('redditTokenScope', scope);

        const userId = sessionStorage.getItem('userId'); // o localStorage según tu flujo
        if (!userId) {
          console.error('No se encontró el userId en sessionStorage.');
          return;
        }

        // Guardar token en la base de datos
        const saveResponse = await fetch('http://localhost:4000/reddit/save-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            access_token,
            refresh_token,
            expires_in,
            scope
          }),
        });

        if (!saveResponse.ok) {
          const errSave = await saveResponse.json();
          throw new Error(`Error guardando token: ${errSave.error || 'Unknown'}`);
        }

        console.log('Token de Reddit almacenado exitosamente.');
        window.location.href = '/home'; // Redirigir al home
      } catch (error) {
        console.error('Error durante la autenticación con Reddit:', error);
      }
    };

    handleAuth();
  }, []);

  return <p>Autenticando con Reddit...</p>;
};

export default RedditAuth;