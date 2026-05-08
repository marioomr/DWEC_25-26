const librosModel = require('../models/librosModel');
const prestamosModel = require('../models/prestamosModel');

// 1. CATÁLOGO
exports.home = async (req, res) => {

    const libros = await librosModel.getAllLibros();

    res.render('index', { libros });
};

// 4. DETALLE LIBRO + BOTONES
exports.detalleLibro = async (req, res) => {

    const libro = await librosModel.getLibroById(req.params.id);

    const historial = await prestamosModel.getHistorialLibro(req.params.id);

    const prestamoActivo = await prestamosModel.getPrestamoActivo(req.params.id);

    res.render('libro', {
        libro,
        historial,
        prestamoActivo
    });
};

// 2. PRESTADOS
exports.prestados = async (req, res) => {

    const libros = await prestamosModel.getLibrosPrestados();

    res.render('prestados', { libros });
};

// 7. VENCIDOS
exports.vencidos = async (req, res) => {

    const libros = await prestamosModel.getVencidos();

    res.render('vencidos', { libros });
};