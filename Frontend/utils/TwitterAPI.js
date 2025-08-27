// twitterAuth.js
export const redirectToTwitterAuth = async () => {
  try {
    // Pedimos al backend la URL de autenticación (incluye PKCE y state)
    const res = await fetch('http://localhost:4000/auth/twitter/url');
    const data = await res.json();

    // Guardamos state en sessionStorage para validación posterior
    sessionStorage.setItem('twitter_state', data.state);

    // Redirigimos al usuario a la URL de Twitter
    window.location.href = data.url;
  } catch (err) {
    console.error('Error redirigiendo a Twitter Auth:', err);
  }
};
