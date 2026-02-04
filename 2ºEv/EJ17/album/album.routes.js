const express = require('express');
const router = express.Router();
const controller = require('./album.controller');

router.get('/albumes', controller.listar);

router.get('/album/form', controller.form);
router.get('/album/form/:id', controller.form);
router.post('/album/save', controller.guardar);

router.get('/album/delete/:id', controller.eliminar);

module.exports = router;
