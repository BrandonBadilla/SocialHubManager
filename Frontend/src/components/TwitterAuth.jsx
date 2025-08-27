import { useEffect } from "react";

export default function TwitterAuth() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const savedState = sessionStorage.getItem("twitter_oauth_state");

    if (code && state === savedState) {
      fetch("http://localhost:4000/auth/twitter/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, state }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ Tokens recibidos:", data);
          sessionStorage.setItem("twitter_access_token", data.access_token);
        })
        .catch((err) => console.error("Error en callback:", err));
    }
  }, []);

  return <h2>Procesando autenticación con Twitter...</h2>;
}
