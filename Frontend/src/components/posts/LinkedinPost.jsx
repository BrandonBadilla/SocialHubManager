import React, { useEffect } from 'react';

const LinkedinAuth = () => {
  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (!code) {
        console.error('No se encontró un código de autorización en LinkedIn.');
        return;
      }

      try {
        // Llama a tu backend para intercambiar el código por un token
        const response = await fetch('http://localhost:4000/linkedin/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        if (!response.ok) throw new Error('Error al obtener el token de LinkedIn');

        const data = await response.json();
        const token = data.token;

        // Guardar el token en sessionStorage
        sessionStorage.setItem('linkedinToken', token);

        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('No se encontró el userId en localStorage.');
          return;
        }

        // Guardar token en la base de datos
        const saveResponse = await fetch('http://localhost:4000/linkedin/save-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, token })
        });

        if (!saveResponse.ok) throw new Error('Error al guardar el token en la base de datos');

        console.log('Token de LinkedIn almacenado con éxito.');
        window.location.href = '/home';
      } catch (err) {
        console.error('Error durante la autenticación con LinkedIn:', err);
      }
    };

    handleAuth();
  }, []);

  return <p>Autenticando con LinkedIn...</p>;
};

export default LinkedinAuth;
