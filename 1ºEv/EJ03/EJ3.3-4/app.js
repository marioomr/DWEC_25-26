import { agregarLibro, obtenerLibros, buscarLibro, eliminarLibro } from './biblioteca.js';

const nuevoLibro = {
  id: 11,
  titulo: "El juego del ángel",
  autor: "Carlos Ruiz Zafón",
  paginas: 672
};


agregarLibro(nuevoLibro);

console.log("Colección inicial de libros:");
obtenerLibros().forEach(libro => {
  console.log(`- ${libro.titulo} (${libro.autor}) - ${libro.paginas} páginas`);
});


const idBuscar = 4;
const libroEncontrado = buscarLibro(idBuscar);
console.log(`\nLibro buscado con id=${idBuscar}:`);
if (libroEncontrado) {
  console.log(`${libroEncontrado.titulo} (${libroEncontrado.autor}) - ${libroEncontrado.paginas} páginas`);
} else {
  console.log("No se encontró el libro.");
}


const idEliminar = 2;
const eliminado = eliminarLibro(idEliminar);
console.log(`\nEliminando libro con id=${idEliminar}: ${eliminado ? 'Eliminado' : 'No encontrado'}`);


console.log("\nColección final tras eliminación:");
obtenerLibros().forEach(libro => {
  console.log(`- ${libro.titulo} (${libro.autor}) - ${libro.paginas} páginas`);
});