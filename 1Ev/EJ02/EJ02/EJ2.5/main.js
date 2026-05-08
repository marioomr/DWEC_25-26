// Importamos las funciones desde gestorUsuarios.js
import { crearPerfil, esMayorDeEdad, obtenerMayoresDeEdad, calcularPromedioEdad } from './gestorUsuarios.js';
import mostrarPerfil from './gestorUsuarios.js';

// Creamos un array con 5 usuarios
const usuarios = [
  crearPerfil('Ana', 'ana@mail.com', 25),
  crearPerfil('Luis', 'luis@mail.com', 17),
  crearPerfil('Marta', 'marta@mail.com', 30),
  crearPerfil('Juan', 'juan@mail.com', 16),
  crearPerfil('Sofía', 'sofia@mail.com', 20),
];

// Obtenemos usuarios mayores de edad
const mayores = obtenerMayoresDeEdad(usuarios);

console.log("Usuarios mayores de edad:");
mayores.forEach(usuario => {
  console.log(mostrarPerfil(usuario));
});

// Calculamos y mostramos la edad promedio
const promedio = calcularPromedioEdad(usuarios);
console.log(`La edad promedio de los usuarios es: ${promedio.toFixed(2)}`);