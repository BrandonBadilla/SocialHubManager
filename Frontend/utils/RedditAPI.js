export const redirectToRedditAuth = () => {
  const clientId = import.meta.env.VITE_REDDIT_CLIENT_ID;
  const redirectUri = 'http://localhost:5173/reddit-auth';
  const scope = 'identity submit';
  const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=random_string&redirect_uri=${encodeURIComponent(redirectUri)}&duration=temporary&scope=${encodeURIComponent(scope)}`;
  window.location.href = authUrl;
};