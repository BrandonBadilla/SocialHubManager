import express from "express";
import crypto from "crypto";
import fetch from "node-fetch"; // npm i node-fetch@3
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/* ========= ENV ========= */
const CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const REDIRECT_URI = process.env.TWITTER_REDIRECT_URI || "http://localhost:5173/twitter-auth";
// scopes: separados por espacios (no comas). Incluye tweet.write si vas a publicar.
const SCOPE = process.env.TWITTER_SCOPE || "tweet.read tweet.write users.read offline.access";

// Endpoints OAuth2 de X
const AUTH_URL  = "https://twitter.com/i/oauth2/authorize";
const TOKEN_URL = "https://api.twitter.com/2/oauth2/token";

/* ========= PKCE helpers (sin padding) ========= */
function base64url(buffer) {
  return Buffer.from(buffer).toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
function genCodeVerifier() {
  // 64 bytes -> 86 chars base64url aprox. (válido 43–128)
  return base64url(crypto.randomBytes(64));
}
function genCodeChallenge(verifier) {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return base64url(hash);
}
function genState() {
  return base64url(crypto.randomBytes(24));
}

/* ========= Mini store en memoria con TTL ========= */
const verifierStore = new Map(); // state -> { verifier, exp }
const TTL_MS = 10 * 60 * 1000; // 10 min

function putVerifier(state, verifier) {
  verifierStore.set(state, { verifier, exp: Date.now() + TTL_MS });
}
function takeVerifier(state) {
  const item = verifierStore.get(state);
  if (!item) return null;
  verifierStore.delete(state);
  if (Date.now() > item.exp) return null;
  return item.verifier;
}

/* ========= 1) Generar URL de autorización ========= */
router.get("/url", (req, res) => {
  if (!CLIENT_ID) return res.status(500).json({ error: "Falta TWITTER_CLIENT_ID" });

  const state = genState();
  const code_verifier = genCodeVerifier();
  const code_challenge = genCodeChallenge(code_verifier);

  putVerifier(state, code_verifier);

  const url = new URL(AUTH_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("scope", SCOPE);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", code_challenge);
  url.searchParams.set("code_challenge_method", "S256");

  return res.json({ url: url.toString(), state });
});

/* ========= 2) Intercambiar code -> tokens =========
   El frontend debe POSTear { code, state }
   desde la página REDIRECT_URI cuando vuelve de Twitter.
==================================================== */
router.post("/token", express.json(), async (req, res) => {
  try {
    const { code, state } = req.body || {};
    if (!code || !state) return res.status(400).json({ error: "Faltan code/state" });

    const code_verifier = takeVerifier(state);
    if (!code_verifier) return res.status(400).json({ error: "state inválido o expirado" });

    const form = new URLSearchParams();
    form.set("grant_type", "authorization_code");
    form.set("client_id", CLIENT_ID);
    form.set("redirect_uri", REDIRECT_URI);
    form.set("code", code);
    form.set("code_verifier", code_verifier);

    const resp = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });

    const data = await resp.json();
    if (!resp.ok) {
      return res.status(400).json({ error: "token_exchange_failed", detail: data });
    }

    // data: { token_type, expires_in, access_token, scope, refresh_token }
    // Guarda tokens en tu DB si corresponde
    return res.json({ ok: true, tokens: data });
  } catch (err) {
    console.error("Error /auth/twitter/token:", err);
    return res.status(500).json({ error: "server_error" });
  }
});

export default router;
