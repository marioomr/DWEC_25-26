export function crearProducto(nombre, categoria, precio, stock) {
    return { nombre, categoria, precio, stock };
}

export function filtrarPorCategoria(inventario, categoria) {
    return inventario.filter(prod => prod.categoria === categoria);
}

export function listarProductosAgotados(inventario) {
    return inventario.filter(prod => prod.stock === 0);
}

export function calcularValorTotalInventario(inventario) {
    return inventario.reduce((total, prod) => total + (prod.precio * prod.stock), 0).toFixed(2);
}

export default function resumenInventario(inventario) {
    const totalProductos = inventario.length;
    const categorias = [...new Set(inventario.map(p => p.categoria))];
    const valorTotal = calcularValorTotalInventario(inventario);

    console.log("Resumen del Inventario:");
    console.log(`- Total de productos: ${totalProductos}`);
    console.log(`- Categorías disponibles: ${categorias.length} (${categorias.join(', ')})`);
    console.log(`- Valor total del inventario: $${valorTotal}`);
}
