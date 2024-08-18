const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');


dotenv.config();

const app = express();
const port = 3000;

app.use(cors({
  origin: process.env.URL_FRONTEND  // Reemplaza con la URL de tu frontend
}));
// Middleware
app.use(bodyParser.json());

// Configuración de MySQL
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Rutas de autenticación
// Registro de usuario
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        return res.status(500).json({ 
          trans: false,
          message: 'Database error', error: err 
        });
      }
      if (results.length > 0) {
        return res.status(401).json({ 
          trans: false,
          message: 'Este usuario ya se encuentra registrado, por favor ingrese otro.' 
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
        if (err) {
          return res.status(500).json({ 
            trans: false,
            message: 'Database error', 
            error: err 
          });
        }
        res.status(201).json({ 
          trans: true,
          message: 'Usuario registrado exitosamente.' 
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registrando el usuario', error });
  }
});

// Login de usuario
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ 
        trans: false,
        message: 'Database error', error: err 
      });
    }
    if (results.length === 0) {
      return res.status(401).json({ 
        trans: false,
        message: 'Usuario o contraseña incorrecta.' 
      });
    }
    const user = results[0];
    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ 
          trans: false,
          message: 'Usuario o contraseña incorrecta.' 
        });
      }
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ 
        trans: true,
        message: 'Login exitoso',
        token 
      });
    } catch (error) {
      res.status(500).json({ message: 'Error comparando las contraseñas.', error });
    }
  });
});

// Middleware para proteger rutas
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Ruta protegida
app.get('/verify', authenticateJWT, (req, res) => {
  res.json({ 
    trans: true,
    message: 'Esta es una ruta protegida', user: req.user 
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
