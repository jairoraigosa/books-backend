const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    User.findByUsername(username, async (err, results) => {
      if (err) return res.status(500).json({ trans: false, message: 'Database error', error: err });
      if (results.length > 0) return res.status(401).json({ trans: false, message: 'Usuario ya registrado' });

      const hashedPassword = await bcrypt.hash(password, 10);
      User.create(username, hashedPassword, (err) => {
        if (err) return res.status(500).json({ trans: false, message: 'Database error', error: err });
        res.status(201).json({ trans: true, message: 'Usuario registrado exitosamente' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registrando el usuario', error });
  }
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  User.findByUsername(username, async (err, results) => {
    if (err) return res.status(500).json({ trans: false, message: 'Database error', error: err });
    if (results.length === 0) return res.status(401).json({ trans: false, message: 'Usuario o contraseña incorrecta' });

    const user = results[0];
    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ trans: false, message: 'Usuario o contraseña incorrecta' });

      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ trans: true, message: 'Login exitoso', token });
    } catch (error) {
      res.status(500).json({ message: 'Error comparando las contraseñas.', error });
    }
  });
};
