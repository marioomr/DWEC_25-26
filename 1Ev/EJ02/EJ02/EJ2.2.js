//1
function calcularAreaRectangulo(base = 3, altura = 6) {
    return base * altura;
};
console.log(calcularAreaRectangulo());

//2
const calcularAreaTriangulo = function (base = 4, altura = 6) {
    return (base * altura) / 2;
};
console.log(calcularAreaTriangulo());

//3
const calcularAreaTriangulo2 = (base = 4, altura = 6) => (base * altura) / 2;
console.log(calcularAreaTriangulo2());

//4
//5
console.log("------------");
console.log(calcularAreaRectangulo());       // Usa valores por defecto
console.log(calcularAreaRectangulo(10, 2)); // Usa valores que pasamos
console.log("------------");
console.log(calcularAreaTriangulo());        // Por defecto
console.log(calcularAreaTriangulo(5, 8));   // Con argumentos
console.log("------------");
console.log(calcularAreaTriangulo2());       // Por defecto
console.log(calcularAreaTriangulo2(6, 9));  // Con argumentos
