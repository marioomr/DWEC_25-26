const path = require('path');

let db;
try {
    db = require(path.join('..', 'database'));
} catch (e) {
    db = require(path.join('..', 'db'));
}

// 2. LIBROS PRESTADOS (REQUISITO 2)
exports.getLibrosPrestados = async () => {

    const [rows] = await db.query(`
        SELECT 
            l.id,
            l.titulo,
            l.autor,
            p.nombre_prestatario,
            p.fecha_devolucion
        FROM libros l
        JOIN prestamos p ON p.libro_id = l.id
        WHERE l.estado = 'Prestado' 
        AND p.fecha_entrega IS NULL
        ORDER BY p.fecha_devolucion ASC
    `);

    return rows;
};

// 3. PRESTAMOS POR USUARIO (REQUISITO 3)
exports.getPrestamosUsuario = async (nombre) => {

    const [rows] = await db.query(`
        SELECT 
            l.id,
            l.id,
            l.titulo,
            l.autor,
            p.fecha_devolucion
        FROM prestamos p
        JOIN libros l ON l.id = p.libro_id
        WHERE p.nombre_prestatario = ? 
        AND p.fecha_entrega IS NULL
        ORDER BY p.fecha_devolucion ASC
    `, [nombre]);

    return rows;
};

// 4. HISTORIAL LIBRO
exports.getHistorialLibro = async (id) => {

    const [rows] = await db.query(`
        SELECT * FROM prestamos
        WHERE libro_id = ?
    `, [id]);

    return rows;
};

// 4. PRESTAMO ACTIVO
exports.getPrestamoActivo = async (id) => {

    const [rows] = await db.query(`
        SELECT * FROM prestamos
        WHERE libro_id = ?
        AND fecha_entrega IS NULL
    `, [id]);

    return rows[0];
};

// 7. VENCIDOS
exports.getVencidos = async () => {

    const [rows] = await db.query(`
        SELECT 
            l.id,
            l.titulo,
            l.autor,
            p.nombre_prestatario,
            p.fecha_devolucion
        FROM libros l
        JOIN prestamos p ON p.libro_id = l.id
        WHERE p.fecha_entrega IS NULL
        AND p.fecha_devolucion < CURDATE()
        ORDER BY p.fecha_devolucion ASC
    `);

    return rows;
};

// CREAR PRESTAMO (REQUISITO 5)
exports.crearPrestamo = async (libro_id, nombre, f1, f2) => {

    await db.query(`
        INSERT INTO prestamos
        (libro_id, nombre_prestatario, fecha_prestamo, fecha_devolucion, fecha_entrega)
        VALUES (?,?,?,?,NULL)
    `, [libro_id, nombre, f1, f2]);
};

// DEVOLVER (REQUISITO 6)
exports.registrarDevolucion = async (libro_id, fecha) => {

    await db.query(`
        UPDATE prestamos
        SET fecha_entrega = ?
        WHERE libro_id = ?
        AND fecha_entrega IS NULL
    `, [fecha, libro_id]);
};