const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Book = require('../models/bookModel');
const authenticateJWT = require('../middlewares/authenticateJWT');
const { userIdToken } = require('../helpers/jwtHelper');

exports.list = async (req, res) => {
  try {
    const id = req.query.id!=="" ? req.query.id : null;
    const status = req.query.status!=="" ? req.query.status : null;
    const gender = req.query.gender!=="" ? req.query.gender : null;
    const token = req.headers.authorization?.split(' ')[1]; // Obtén el token del header Authorization
    const user_id = userIdToken(token);
    Book.finBooks(id, status, gender, user_id, async (err, results) => {
      if (err) return res.status(500).json({ trans: false, message: 'Database error', error: err });
      if (results.length === 0) return res.status(201).json({ trans: true, books: [], message: 'Sin datos.' });
      if (results.length > 0) return res.status(201).json({ trans: true, books: results, message: 'Books consultados exitosamente.' });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ocurrio un error ejecutando la consulta.', error });
  }
};
exports.getBookStatuses = async (req, res) => {
  try {
    Book.finBookStatuses(async (err, results) => {
      if (err) return res.status(500).json({ trans: false, message: 'Database error', error: err });
      if (results.length === 0) return res.status(201).json({ trans: true, statuses: [], message: 'Sin datos.' });
      if (results.length > 0) return res.status(201).json({ trans: true, statuses: results, message: 'Estados de lectura de libros consultado exitosamente.' });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ocurrio un error ejecutando la consulta.', error });
  }
};

exports.register = async (req, res) => {
  try {
    const {title, author, status_id, qualification, gender} = req.body;
    const token = req.headers.authorization?.split(' ')[1]; // Obtén el token del header Authorization
    const user_id = userIdToken(token);
    Book.regBook(title, author, status_id, qualification, gender, user_id, async (err, book) => {
      if (err) return res.status(500).json({ trans: false, message: 'Database error', error: err });
      if (book) return res.status(201).json({ trans: true, message: 'Libro guardado exitosamente.', book });

    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ocurrio un error ejecutando la consulta.', error });
  }
};

exports.update = async (req, res) => {
  try {
    const bookId = req.params.id;
    const {title, author, status_id, qualification, gender} = req.body;
    Book.updateBook(bookId, title, author, status_id, qualification, gender, async (err, book) => {
      if (err) return res.status(500).json({ trans: false, message: 'Database error', error: err });
      if (book) return res.status(201).json({ trans: true, message: 'Libro modificado exitosamente.', book });

    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ocurrio un error ejecutando la consulta.', error });
  }
}

exports.delete = async (req, res) => {
  try {
    const bookId = req.params.id;
    Book.deleteBook(bookId, async (err, book) => {
      if (err) return res.status(500).json({ trans: false, message: 'Database error', error: err });
      if (book) return res.status(201).json({ trans: true, message: 'Libro eliminado exitosamente.', book });

    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ocurrio un error ejecutando la consulta.', error });
  }
};