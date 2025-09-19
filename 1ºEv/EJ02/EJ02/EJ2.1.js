//1
let numeros = [5, 7, 2, 9, 6, 6];
console.log(numeros);

//2
let dobles = numeros.map(num => num * 2);
console.log(dobles);

//3
let pares = numeros.filter(num => num % 2 === 0);
console.log(pares);

//4
for(let imprimir of pares) {
    console.log(imprimir);
}
