const db = require('../config/db');

const Book = {
  finBooks: (id=null, status=null, gender=null, user_id, callback) => {
    // Base de la consulta
    let query = 'SELECT a.id, a.title, a.author, b.id as status_id, b.name as status_name, a.qualification, a.gender, DATE_FORMAT(a.created_at, \'%d-%m-%Y %r\') as fecha ' +
                'FROM books as a JOIN book_statuses as b ON (a.status_id = b.id) ' +
                'WHERE a.deleted_at IS NULL AND a.user_id = ?';
    
    let queryParams = [user_id];
    
    if (id !== null) {
        query += ' AND a.id = ?';
        queryParams.push(id);
    }
    if (status !== null) {
        query += ' AND b.id = ?';
        queryParams.push(status);
    }
    if (gender !== null) {
        query += ' AND a.gender LIKE ?';
        queryParams.push(`%${gender}%`);
    }
    return db.query(query, queryParams, callback);
    // return db.query('SELECT a.id, a.title, a.author, b.id as status_id, b.name as status_name, a.qualification, a.gender, DATE_FORMAT(a.created_at, \'%d-%m-%Y %r\') as fecha FROM books as a JOIN book_statuses as b ON (a.status_id = b.id) WHERE a.deleted_at IS NULL AND a.user_id = ?', [user_id], callback);
  },
  finBookStatuses: (callback) => {
    // return db.query('SELECT * FROM books WHERE username = ?', [username], callback);
    return db.query('SELECT id, name, description FROM book_statuses', callback);
  },
  regBook: (title, author, status_id, qualification, gender, user_id, callback) => {
    db.query(
      'INSERT INTO books (title, author, status_id, qualification, gender, user_id) VALUES (?, ?, ?, ?, ?, ?)', 
      [title, author, status_id, qualification, gender, user_id], 
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        const insertedId = result.insertId;

        // Verificar si el libro se insertó correctamente
        db.query('SELECT * FROM books WHERE id = ?', [insertedId], (err, rows) => {
          if (err) {
            return callback(err, null);
          }

          if (rows.length > 0) {
            return callback(null, rows[0]);
          } else {
            return callback(new Error('No se encontró el libro insertado.'), null);
          }
        });
      }
    );
  },
  updateBook: (id, title, author, status_id, qualification, gender, callback) => {
    db.query(
      'UPDATE books SET title = ?, author = ?, status_id = ?, qualification = ?, gender = ?, update_at = NOW() WHERE id = ?', 
      [title, author, status_id, qualification, gender, id], 
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        // Verificar si el libro se insertó correctamente
        db.query('SELECT * FROM books WHERE id = ?', [id], (err, rows) => {
          if (err) {
            return callback(err, null);
          }

          if (rows.length > 0) {
            return callback(null, rows[0]);
          } else {
            return callback(new Error('No se encontró el libro insertado.'), null);
          }
        });
      }
    );
  },
  deleteBook: (id, callback) => {
    return db.query('UPDATE books SET deleted_at = NOW() WHERE id = ?', [id], callback);
  },
};

module.exports = Book;
