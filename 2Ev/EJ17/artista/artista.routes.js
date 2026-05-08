const express = require('express');
const router = express.Router();
const controller = require('./artista.controller');

router.get('/artistas', controller.listar);

router.get('/artista/form', controller.form);
router.get('/artista/form/:id', controller.form);
router.post('/artista/save', controller.guardar);

router.get('/artista/delete/:id', controller.eliminar);

// SIEMPRE LA ÚLTIMA
router.get('/artista/:id', controller.detalle);

module.exports = router;
