import { agregarLibro, 
  obtenerLibros, 
  buscarLibro, 
  eliminarLibro, 
  calcularTotalPaginas, 
  ordenarPorPaginas,
  hayLibrosLargos,
  todosSonLibrosCortos  } from './biblioteca.js';

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

ordenarPorPaginas();

console.log("\nColección de libros después de ordenar por páginas:");
obtenerLibros().forEach(libro => {
  console.log(`- ${libro.titulo} (${libro.paginas} páginas)`);
});

const totalPaginas = calcularTotalPaginas();
console.log(`\nTotal de páginas en la biblioteca: ${totalPaginas}`);


const limites = [100, 300, 800];

limites.forEach(limite => {
  console.log(`\n¿Hay libros con más de ${limite} páginas? ${hayLibrosLargos(limite)}`);
  console.log(`¿Todos los libros tienen menos de ${limite} páginas? ${todosSonLibrosCortos(limite)}`);
});