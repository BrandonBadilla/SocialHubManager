export const redirectToMastodonAuth = () => {
  const clientId = import.meta.env.VITE_MASTODON_CLIENT_ID;
  const redirectUri = 'http://localhost:5173/mastodon-auth';
  const scope = 'read write';
  const authUrl = `https://mastodon.social/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  window.location.href = authUrl;
};