const express = require("express")

const router = express.Router()

const {
    obtenerAutores,
    obtenerAutorPorId,
    crearAutor,
    actualizarAutor,
    eliminarAutor,
    obtenerLibrosAutor
} = require("../controllers/autoresController")

router.get("/", obtenerAutores)

router.get("/:id/libros", obtenerLibrosAutor)

router.get("/:id", obtenerAutorPorId)

router.post("/", crearAutor)

router.put("/:id", actualizarAutor)

router.delete("/:id", eliminarAutor)

module.exports = router