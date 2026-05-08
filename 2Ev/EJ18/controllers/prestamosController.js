const prestamosModel = require('../models/prestamosModel');
const librosModel = require('../models/librosModel');

// 3. USUARIO
exports.prestamosUsuario = async (req, res) => {

    const nombre = (req.query.nombre || '').trim();

    if (!nombre) {
        return res.status(400).send('Falta el parámetro nombre');
    }

    try {
        const prestamos = await prestamosModel.getPrestamosUsuario(nombre);
        res.render('usuario', { nombre, prestamos });
    } catch (err) {
        res.status(500).send('Error al cargar préstamos del usuario');
    }
};

// FORMULARIO
exports.formularioPrestamo = async (req, res) => {

    const libro = await librosModel.getLibroById(req.params.libro_id);

    res.render('formularioPrestamo', { libro });
};

// CREAR PRESTAMO
exports.nuevoPrestamo = async (req, res) => {

    const { libro_id, nombre_prestatario, fecha_prestamo, fecha_devolucion } = req.body;

    await prestamosModel.crearPrestamo(libro_id, nombre_prestatario, fecha_prestamo, fecha_devolucion);

    await librosModel.actualizarEstadoLibro(libro_id, 'Prestado');

    res.redirect(`/libro/${libro_id}`);
};

// DEVOLVER
exports.devolverLibro = async (req, res) => {

    const id = req.params.libro_id;

    const fecha = new Date().toISOString().split('T')[0];

    await prestamosModel.registrarDevolucion(id, fecha);

    await librosModel.actualizarEstadoLibro(id, 'Disponible');

    res.redirect(`/libro/${id}`);
};

exports.listarPrestados = async (req, res) => {
    try {
        const libros = await prestamosModel.getLibrosPrestados();
        res.render('prestados', { libros });
    } catch (err) {
        res.status(500).send('Error al cargar libros prestados');
    }
};

exports.listarVencidos = async (req, res) => {
    try {
        const libros = await prestamosModel.getVencidos();
        res.render('vencidos', { libros });
    } catch (err) {
        res.status(500).send('Error al cargar libros vencidos');
    }
};