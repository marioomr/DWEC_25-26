const coche = {
    marca : "BMW",
    modelo: "M3",
    año: 2018,
    estaDisponible: false
}

const {estaDisponible = false} = coche

console.log(estaDisponible)
