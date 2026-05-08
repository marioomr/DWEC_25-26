const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', portfolioRoutes);

app.get('/', (req, res) => {
  res.redirect('/login');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});