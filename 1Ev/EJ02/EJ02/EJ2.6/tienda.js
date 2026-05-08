import resumenInventario, {
    crearProducto,
    filtrarPorCategoria,
    listarProductosAgotados,
    calcularValorTotalInventario
} from './inventario.js';

const inventario = [
    crearProducto('Portatil Macbook', 'Electrónica', 1200, 5),
    crearProducto('Camiseta Nike', 'Ropa', 25, 0),
    crearProducto('Vaqueros Levis ', 'Ropa', 50, 10),
    crearProducto('Libro JS', 'Libros', 35, 3),
    crearProducto('Audífonos', 'Electrónica', 100, 2),
    crearProducto('Sudadera Adidas', 'Ropa', 40, 4)
];

console.log("Productos de la categoría 'Ropa':");
const ropa = filtrarPorCategoria(inventario, 'Ropa');
ropa.forEach(p => console.log(p));

console.log("Productos agotados:");
const agotados = listarProductosAgotados(inventario);
agotados.forEach(p => console.log(p));

const valorTotal = calcularValorTotalInventario(inventario);
console.log(`Valor total del inventario: $${valorTotal}`);

console.log("Resumen del inventario:");
resumenInventario(inventario);
