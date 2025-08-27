import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const REDIRECT_URI = process.env.TWITTER_REDIRECT_URI; // ej: http://localhost:3000/twitter/callback

// Endpoint para generar la URL de autenticación
app.get('/auth/twitter/url', (req, res) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'tweet.read users.read offline.access',
    state: 'state123', // puedes generar un random
    code_challenge: 'challenge', // si usas PKCE
    code_challenge_method: 'plain'
  });

  res.json({ url: `https://twitter.com/i/oauth2/authorize?${params.toString()}` });
});

// Callback para intercambiar el code por tokens
app.post('/auth/twitter/callback', async (req, res) => {
  const { code } = req.body;

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code,
    code_verifier: 'challenge' // si usas PKCE
  });

  try {
    const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const data = await tokenRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error intercambiando code por token' });
  }
});

// Endpoint para obtener info del usuario autenticado
app.get('/twitter/me', async (req, res) => {
  const { access_token } = req.headers;

  try {
    const userRes = await fetch('https://api.twitter.com/2/users/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const userData = await userRes.json();
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo info del usuario' });
  }
});

app.listen(4000, () => console.log('Twitter Auth backend corriendo en puerto 4000'));
