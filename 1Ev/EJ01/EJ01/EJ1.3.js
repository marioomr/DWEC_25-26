//1 
const producto = {
    nombre : "Libro",
    precio: 20
}

//2
const cliente = {
    nombreCliente: "Ana",
    esPremium: true
}

//3
const pedido = {
    ...producto,
    ...cliente
}

//4
console.log(pedido)

//5
const producto2 = {
    nombre : "Libro",
    precio: 20
}
const combinado = {
    ...producto2,
    ...cliente
}
console.log(combinado)