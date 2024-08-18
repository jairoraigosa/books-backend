const db = require('../config/db');

const User = {
  findByUsername: (username, callback) => {
    return db.query('SELECT * FROM users WHERE username = ?', [username], callback);
  },
  create: (username, password, callback) => {
    return db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], callback);
  },
};

module.exports = User;
