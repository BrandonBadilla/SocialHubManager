import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twitterAuthRoutes from "./routes/twitterAuth.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Montamos las rutas de Twitter bajo /auth/twitter
app.use("/auth/twitter", twitterAuthRoutes);

app.listen(4000, () => {
  console.log("✅ Backend corriendo en http://localhost:4000");
});
