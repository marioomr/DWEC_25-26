//1
const ciudades = ["Madrid", "Buenos Aires", "Tokio", "Nueva York", "Paris"]
//2
ciudades.push("Roma");

//3
const ciudadesMayus = ciudades.map(ciudad => ciudad.toUpperCase());

//4 
const ciudadesFiltradas = ciudades.filter(ciudad => ciudad.length > 5);

//5
console.log(ciudades);
console.log(ciudadesMayus);
console.log(ciudadesFiltradas);