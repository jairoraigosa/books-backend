const express = require('express');
const authController = require('../controllers/authController');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', authenticateJWT, (req, res) => {
  res.json({ trans: true, message: 'Token validado con éxito', user: req.user });
});

module.exports = router;
