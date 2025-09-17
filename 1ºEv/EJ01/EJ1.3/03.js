const producto = {
    nombre : "Libro",
    precio: 20
}

const cliente = {
    nombreCliente: "Ana",
    esPremium: true
}

const pedido = {
    ...producto,
    ...cliente
}
