const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

if (process.env.VERCEL) {
  app.use(morgan('combined'));
} else {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(require('./album/album.routes'));
app.use(require('./artista/artista.routes'));

app.get('/', (req, res) => {
  res.render('index');
});

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
  });
}

module.exports = app;
