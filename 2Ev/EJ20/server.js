require("dotenv").config()

const express = require("express")
const cors = require("cors")

const conectarDB = require("./config/db")

const autoresRoutes = require("./routes/autoresRoutes")
const librosRoutes = require("./routes/librosRoutes")

const app = express()

conectarDB()

app.use(cors())

app.use(express.json())

app.use("/api/autores", autoresRoutes)

app.use("/api/libros", librosRoutes)

app.get("/", (req, res) => {
    res.send("API Libreria funcionando")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`)
})