const express = require('express');
const router = express.Router();
const db = require('../config/db');
const md5 = require('md5');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {

  const { username, password, email } = req.body;

  const sql = `
    INSERT INTO users (username, password, email)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [username, md5(password), email], (err) => {

    if (err) {
      console.log(err);
      return res.send('Error al registrar usuario');
    }

    res.redirect('/login');
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {

  const { username, password } = req.body;

  const sql = `
    SELECT * FROM users
    WHERE username = ? AND password = ?
  `;

  db.query(sql, [username, md5(password)], (err, results) => {

    if (err) {
      console.log(err);
      return res.send('Error del servidor');
    }

    if (results.length === 0) {
      return res.send('Credenciales incorrectas');
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