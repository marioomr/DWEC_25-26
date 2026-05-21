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
    res.send(`
        <h1>API Librería funcionando</h1>
        <ul>
            <li><a href="/api/autores">Ver autores</a></li>
            <li><a href="/api/libros">Ver libros</a></li>
        </ul>
    `)
})

const PORT = process.env.PORT || 3000

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor en http://localhost:${PORT}`)
    })
}

module.exports = app
