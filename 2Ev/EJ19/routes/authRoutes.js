const express = require('express');
const router = express.Router();
const db = require('../config/db');
const md5 = require('md5');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {

  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.render('register', { error: 'Todos los campos son requeridos' });
  }

  if (password.length < 6) {
    return res.render('register', { error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  const sql = `INSERT INTO users (username, password, bio, email, photo) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [username, md5(password), '', email, ''], (err) => {
    if (err) {
      console.error('Register Error:', err.message);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.render('register', { error: 'El usuario o email ya existe' });
      }
      return res.render('register', { error: 'Error al registrar usuario' });
    }
    res.redirect('/login');
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('login', { error: 'Usuario y contraseña requeridos' });
  }

  const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;

  db.query(sql, [username, md5(password)], (err, results) => {
    if (err) {
      console.error('Login Error:', err.message);
      return res.render('login', { error: 'Error del servidor' });
    }

    if (!results || results.length === 0) {
      return res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }

    req.session.user = results[0];
    res.redirect('/dashboard');
  });
});

router.get('/logout', (req, res) => {

  req.session.destroy(() => {
    res.redirect('/login');
  });

});

module.exports = router;
