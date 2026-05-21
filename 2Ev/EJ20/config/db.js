const mongoose = require("mongoose")

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB_NAME || "libreria"
        })

        console.log("MongoDB conectado")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = conectarDB
