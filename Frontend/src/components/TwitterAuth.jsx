import React, { useEffect, useState } from 'react';

export default function TwitterAuth() {
  const [user, setUser] = useState(null);

  const login = async () => {
    // 1️⃣ Pedimos la URL de autenticación
    const res = await fetch('http://localhost:4000/auth/twitter/url');
    const data = await res.json();
    window.location.href = data.url;
  };

  useEffect(() => {
    // 2️⃣ Revisamos si viene un ?code= en la URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      fetch('http://localhost:4000/auth/twitter/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
        .then(res => res.json())
        .then(async (tokens) => {
          const userRes = await fetch('http://localhost:4000/twitter/me', {
            headers: { access_token: tokens.access_token }
          });
          const userInfo = await userRes.json();
          setUser(userInfo);
        });
    }
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h2>Bienvenido, {user.data.username}</h2>
          <p>ID: {user.data.id}</p>
        </div>
      ) : (
        <button onClick={login}>Login con Twitter</button>
      )}
    </div>
  );
}
