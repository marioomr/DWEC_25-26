const router = require('express').Router();
const c = require('../controllers/librosController');

router.get('/', c.home);
router.get('/libro/:id', c.detalleLibro);
router.get('/prestados', c.prestados);
router.get('/vencidos', c.vencidos);

module.exports = router;