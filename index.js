const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authenticateJWT = require('./middlewares/authenticateJWT');

dotenv.config();

const app = express();
const port = 3000;

app.use(cors({ origin: process.env.URL_FRONTEND }));
app.use(bodyParser.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/books', authenticateJWT, bookRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
