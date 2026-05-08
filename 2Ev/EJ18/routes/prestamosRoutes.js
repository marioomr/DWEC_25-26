const router = require('express').Router();
const c = require('../controllers/prestamosController');

router.get('/prestados', c.listarPrestados);
router.get('/vencidos', c.listarVencidos);
router.get('/prestamos/usuario', c.prestamosUsuario);
router.get('/prestamo/formulario/:libro_id', c.formularioPrestamo);
router.post('/prestamo/nuevo', c.nuevoPrestamo);
router.post('/prestamo/devolver/:libro_id', c.devolverLibro);

module.exports = router;