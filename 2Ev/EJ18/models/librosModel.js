const db = require('../config/db');

exports.getAllLibros = async () => {

    const [rows] = await db.query(`SELECT * FROM libros`);
    return rows;
};

exports.getLibroById = async (id) => {

    const [rows] = await db.query(`
        SELECT * FROM libros WHERE id = ?
    `, [id]);

    return rows[0];
};

exports.actualizarEstadoLibro = async (id, estado) => {

    await db.query(`
        UPDATE libros SET estado = ?
        WHERE id = ?
    `, [estado, id]);
};