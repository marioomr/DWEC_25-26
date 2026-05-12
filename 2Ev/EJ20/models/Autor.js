const mongoose = require("mongoose")

const autorSchema = new mongoose.Schema(
    {
        referencia: {
            type: String,
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        nacionalidad: {
            type: String
        },
        fechaNacimiento: {
            type: String
        },
        imagenUrl: {
            type: String
        }
    },
    {
        collection: "autores"
    }
)

module.exports = mongoose.model("Autor", autorSchema)