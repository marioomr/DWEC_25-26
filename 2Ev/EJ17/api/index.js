const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(morgan('combined'));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '../views'));

app.use(require('../album/album.routes'));
app.use(require('../artista/artista.routes'));

app.get('/', (req, res) => {
  res.render('index');
});

module.exports = app;
