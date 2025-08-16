require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const app = express();
app.use(express.json());

// Configuración de la base de datos
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Funciones auxiliares
async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function verifyPassword(inputPassword, storedPassword) {
  return await bcrypt.compare(inputPassword, storedPassword);
}

function generateSessionToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

async function saveUserSecret(userId, secret) {
  await pool.query('UPDATE users SET two_factor_secret = $1 WHERE id = $2', [secret, userId]);
}

async function getUserSecret(userId) {
  const result = await pool.query('SELECT two_factor_secret FROM users WHERE id = $1', [userId]);
  return result.rows[0]?.two_factor_secret;
}

// Rutas para servir archivos HTML (si los hubiera)
app.use(express.static(path.join(__dirname)));

// Registro de usuario
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validación de entrada
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
  }

  try {
    // Verificar si el email ya existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'El correo ya está registrado' });
    }

    // Cifrar contraseña y guardar usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    const userId = result.rows[0].id;

    // Generar secreto 2FA
    const secret = speakeasy.generateSecret({ name: "Social Hub Manager" });
    await saveUserSecret(userId, secret.base32);

    // Generar QR
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente. Escanea el código QR para habilitar 2FA.',
      qrCodeUrl
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al registrar usuario' });
  }
});

// Inicio de sesión
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Validación de entrada
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' });
  }

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password))) {
    return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  }

  // Si el usuario no tiene 2FA configurado
  if (!user.two_factor_secret) {
    const secret = speakeasy.generateSecret({ name: "Social Hub Manager" });
    await saveUserSecret(user.id, secret.base32);
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    return res.json({
      success: true,
      require2FA: true,
      message: 'Configura 2FA escaneando el código QR.',
      qrCodeUrl
    });
  }

  // Si ya tiene 2FA
  res.json({
    success: true,
    require2FA: true,
    message: 'Ingresa tu código OTP',
    userId: user.id
  });
});

// Verificar OTP
app.post('/api/login/verify-otp', async (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({ success: false, message: 'Usuario y token requeridos' });
  }

  try {
    const userSecret = await getUserSecret(userId);
    if (!userSecret) {
      return res.status(400).json({ success: false, message: 'No se encontró el secreto de 2FA para el usuario' });
    }

    const verified = speakeasy.totp.verify({
      secret: userSecret,
      encoding: 'base32',
      token: token,
    });

    if (verified) {
      const sessionToken = generateSessionToken({ id: userId });
      return res.json({
        success: true,
        message: 'Código OTP verificado correctamente',
        token: sessionToken
      });
    } else {
      return res.status(400).json({ success: false, message: 'Código OTP incorrecto' });
    }
  } catch (error) {
    console.error('Error al verificar el código OTP:', error);
    res.status(500).json({ success: false, message: 'Error en la verificación de OTP' });
  }
});

// Configuración del servidor
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});