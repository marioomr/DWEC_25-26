import {
  agregarEmpleado,
  eliminarEmpleado,
  buscarPorDepartamento,
  calcularSalarioPromedio,
  obtenerEmpleadosOrdenadosPorSalario
} from './empleados.js';

console.log("Lista inicial de empleados ordenados por salario (de mayor a menor):");
obtenerEmpleadosOrdenadosPorSalario().forEach(emp => {
  console.log(`- ${emp.nombre} (${emp.departamento}): €${emp.salario}`);
});

const nuevoEmpleado = { id: 11, nombre: "Isabel Navarro", departamento: "IT", salario: 46000 };
agregarEmpleado(nuevoEmpleado);
console.log("\nSe añadió un nuevo empleado: Isabel Navarro");

const empleadosIT = buscarPorDepartamento("IT");
console.log("\nEmpleados en IT:");
empleadosIT.forEach(emp => {
  console.log(`- ${emp.nombre} (Salario: €${emp.salario})`);
});

const salarioPromedio = calcularSalarioPromedio();
console.log(`\nSalario promedio: €${salarioPromedio.toFixed(2)}`);

console.log("\nEmpleados ordenados por salario tras añadir nuevo empleado:");
obtenerEmpleadosOrdenadosPorSalario().forEach(emp => {
  console.log(`- ${emp.nombre} (${emp.departamento}): €${emp.salario}`);
});

const idEliminar = 4; 
const eliminado = eliminarEmpleado(idEliminar);
console.log(`\nEmpleado con id=${idEliminar} ${eliminado ? "eliminado" : "no encontrado"}`);

console.log("\nLista actualizada de empleados:");
obtenerEmpleadosOrdenadosPorSalario().forEach(emp => {
  console.log(`- ${emp.nombre} (${emp.departamento}): €${emp.salario}`);
});
