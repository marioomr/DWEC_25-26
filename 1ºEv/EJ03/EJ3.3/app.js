import { agregarLibro, obtenerLibros } from './biblioteca.js';


console.log("Colección inicial de libros:");
obtenerLibros().forEach(libro => {
  console.log(`- ${libro.titulo} (${libro.autor}) - ${libro.paginas} páginas`);
});


const nuevoLibro = {
  id: 11,
  titulo: "El juego del ángel",
  autor: "Carlos Ruiz Zafón",
  paginas: 672
};


agregarLibro(nuevoLibro);


console.log("\nColección actualizada tras agregar un nuevo libro:");
obtenerLibros().forEach(libro => {
  console.log(`- ${libro.titulo} (${libro.autor}) - ${libro.paginas} páginas`);
});
