export const redirectToTwitterAuth = async () => {
  try {
    const response = await fetch("http://localhost:4000/auth/twitter/url");
    const data = await response.json();

    sessionStorage.setItem("twitter_oauth_state", data.state);
    window.location.href = data.url;
  } catch (err) {
    console.error("Error al redirigir a Twitter:", err);
  }
};
