const librosModel = require('../models/librosModel');
const prestamosModel = require('../models/prestamosModel');

// 1. CATÁLOGO
exports.home = async (req, res) => {
    try {
        const libros = await librosModel.getAllLibros();
        res.render('index', { libros });
    } catch (err) {
        res.status(500).send('Error al cargar el catálogo. Revisa la conexión con la base de datos.');
    }
};

// 4. DETALLE LIBRO + BOTONES
exports.detalleLibro = async (req, res) => {
    try {
        const libro = await librosModel.getLibroById(req.params.id);

        if (!libro) {
            return res.status(404).send('Libro no encontrado');
        }

        const historial = await prestamosModel.getHistorialLibro(req.params.id);
        const prestamoActivo = await prestamosModel.getPrestamoActivo(req.params.id);

        res.render('libro', {
            libro,
            historial,
            prestamoActivo
        });
    } catch (err) {
        res.status(500).send('Error al cargar el detalle del libro.');
    }
};

// 2. PRESTADOS
exports.prestados = async (req, res) => {
    try {
        const libros = await prestamosModel.getLibrosPrestados();
        res.render('prestados', { libros });
    } catch (err) {
        res.status(500).send('Error al cargar libros prestados');
    }
};

// 7. VENCIDOS
exports.vencidos = async (req, res) => {
    try {
        const libros = await prestamosModel.getVencidos();
        res.render('vencidos', { libros });
    } catch (err) {
        res.status(500).send('Error al cargar libros vencidos');
    }
};
