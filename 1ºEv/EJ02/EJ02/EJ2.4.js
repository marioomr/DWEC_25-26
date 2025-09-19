//1
const usuarios = {
    nombre: "Carlos",
    email: "carlos@gmail.com"
}

//2
const perfil = {
    puuesto: "Desarrollador",
    empresa: "Google"
}

//3
const empleado = {
    ...usuarios,
    perfil
}
console.log(empleado)

//4
const ciudad = empleado.perfil?.direccion?.ciudad;

//5
const ciudadFinal = ciudad ?? "Ciudad no especificada";

console.log(ciudadFinal);