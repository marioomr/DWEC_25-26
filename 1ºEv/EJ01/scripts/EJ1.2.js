//1
const coche = {
    marca : "BMW",
    modelo: "M3",
    año: 2018,
    estaDisponible: true
}

//2
console.table(coche)

//3
const {marca, modelo} = coche
console.log(marca)
console.log(modelo)

//4
const {estaDisponible = true} = coche

//5
coche.color = "Azul"

//6
delete coche.año

//7
console.table(coche)

