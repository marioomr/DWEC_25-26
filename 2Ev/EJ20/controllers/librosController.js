const Libro = require("../models/Libro")

const obtenerLibros = async (req, res) => {
    try {
        let consulta = Libro.find()

        if (req.query.sort === "titulo") {
            consulta = consulta.sort({
                titulo: 1
            })
        }

        const libros = await consulta

        res.json(libros)
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        })
    }
}

const obtenerLibroPorId = async (req, res) => {
    try {
        const libro = await Libro.findOne({
            referencia: req.params.id
        })

        if (!libro) {
            return res.status(404).json({
                mensaje: "Libro no encontrado"
            })
        }

        res.json(libro)
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        })
    }
}

const crearLibro = async (req, res) => {
    try {
        const libro = new Libro(req.body)

        const nuevoLibro = await libro.save()

        res.status(201).json(nuevoLibro)
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        })
    }
}

const actualizarLibro = async (req, res) => {
    try {
        const libro = await Libro.findOneAndUpdate(
            { referencia: req.params.id },
            req.body,
            { new: true }
        )

        if (!libro) {
            return res.status(404).json({
                mensaje: "Libro no encontrado"
            })
        }

        res.json(libro)
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        })
    }
}

const eliminarLibro = async (req, res) => {
    try {
        const libro = await Libro.findOneAndDelete({
            referencia: req.params.id
        })

        if (!libro) {
            return res.status(404).json({
                mensaje: "Libro no encontrado"
            })
        }

        res.json({
            mensaje: "Libro eliminado"
        })
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        })
    }
}

module.exports = {
    obtenerLibros,
    obtenerLibroPorId,
    crearLibro,
    actualizarLibro,
    eliminarLibro
}
