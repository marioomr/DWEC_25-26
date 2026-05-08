const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}
const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// routes
const librosRoutes = require('./routes/librosRoutes');
const prestamosRoutes = require('./routes/prestamosRoutes');

app.use(librosRoutes);
app.use(prestamosRoutes);

// 404
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor http://localhost:${PORT}`);
});