const mongoose = require("mongoose")

const libroSchema = new mongoose.Schema(
    {
        referencia: {
            type: String,
            required: true
        },
        titulo: {
            type: String,
            required: true
        },
        genero: {
            type: String
        },
        anyoPublicacion: {
            type: Number
        },
        autor: {
            type: String,
            required: true
        },
        imagenUrl: {
            type: String
        }
    },
    {
        collection: "libros"
    }
)

module.exports = mongoose.model("Libro", libroSchema)