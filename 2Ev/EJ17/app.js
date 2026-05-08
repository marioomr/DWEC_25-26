const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

// Morgan → access.log
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// EJS
app.set('view engine', 'ejs');

// Rutas
app.use(require('./album/album.routes'));
app.use(require('./artista/artista.routes'));

// Home
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
