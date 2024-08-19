const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT
});

db.connect(err => {
  if (err) {
    console.error('Error conectandose a MySQL:', err);
    process.exit(1);
  }
  console.log('Conexion exitosa.');
});

module.exports = db;
