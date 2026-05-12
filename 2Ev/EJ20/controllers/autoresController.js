const Autor = require("../models/Autor")
const Libro = require("../models/Libro")

const obtenerAutores = async (req, res) => {
    try {
        const filtro = {}

        if (req.query.nacionalidad) {
            filtro.nacionalidad = req.query.nacionalidad
        }

        const autores = await Autor.find(filtro)

        res.json(autores)
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        })
    }
}

const obtenerAutorPorId = async (req, res) => {
    try {
        const autor = await Autor.findOne({
            referencia: req.params.id
        })

        if (!autor) {
            return res.status(404).json({
                mensaje: "Autor no encontrado"
            })
        }

        res.json(autor)
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        })
    }
}

const crearAutor = async (req, res) => {
    try {
        const autor = new Autor(req.body)

        const nuevoAutor = await autor.save()

        res.status(201).json(nuevoAutor)
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        })
    }
}

const actualizarAutor = async (req, res) => {
    try {
        const autor = await Autor.findOneAndUpdate(
            { referencia: req.params.id },
            req.body,
            { new: true }
        )

        if (!autor) {
            return res.status(404).json({
                mensaje: "Autor no encontrado"
            })
        }

        res.json(autor)
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        })
    }
}

const eliminarAutor = async (req, res) => {
    try {
        const autor = await Autor.findOneAndDelete({
            referencia: req.params.id
        })

        if (!autor) {
            return res.status(404).json({
                mensaje: "Autor no encontrado"
            })
        }

        res.json({
            mensaje: "Autor eliminado"
        })
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        })
    }
}

const obtenerLibrosAutor = async (req, res) => {
    try {
        const autor = await Autor.findOne({
            referencia: req.params.id
        })

        if (!autor) {
            return res.status(404).json({
                mensaje: "Autor no encontrado"
            })
        }

        const libros = await Libro.find({
            autor: autor.referencia
        })

        res.json(libros)
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        })
    }
}

module.exports = {
    obtenerAutores,
    obtenerAutorPorId,
    crearAutor,
    actualizarAutor,
    eliminarAutor,
    obtenerLibrosAutor
}