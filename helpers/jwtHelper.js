// /helpers/jwtHelper.js
const jwt = require('jsonwebtoken');

const userIdToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica y verifica el token
        return decoded.id; // Extrae el user_id del payload del token
    } catch (err) {
        console.error('Error al decodificar el token:', err);
        return null;
    }
};

module.exports = {
    userIdToken,
};
