const empleados = [
  { id: 1, nombre: "Ana Martínez", departamento: "Ventas", salario: 32000 },
  { id: 2, nombre: "Luis Gómez", departamento: "IT", salario: 45000 },
  { id: 3, nombre: "Marta Pérez", departamento: "Marketing", salario: 38000 },
  { id: 4, nombre: "Jorge Sánchez", departamento: "RRHH", salario: 30000 },
  { id: 5, nombre: "Elena Ruiz", departamento: "Finanzas", salario: 42000 },
  { id: 6, nombre: "Carlos López", departamento: "Ventas", salario: 35000 },
  { id: 7, nombre: "Sofía Díaz", departamento: "IT", salario: 47000 },
  { id: 8, nombre: "Miguel Torres", departamento: "Marketing", salario: 39000 },
  { id: 9, nombre: "Laura Fernández", departamento: "RRHH", salario: 31000 },
  { id: 10, nombre: "David Morales", departamento: "Finanzas", salario: 43000 }
];

function agregarEmpleado(empleado) {
  empleados.push(empleado);
}

function eliminarEmpleado(id) {
  const index = empleados.findIndex(emp => emp.id === id);
  if (index !== -1) {
    empleados.splice(index, 1);
    return true;
  }
  return false;
}

function buscarPorDepartamento(departamento) {
  return empleados.filter(emp => emp.departamento === departamento);
}

function calcularSalarioPromedio() {
  if (empleados.length === 0) return 0;
  const total = empleados.reduce((acc, emp) => acc + emp.salario, 0);
  return total / empleados.length;
}

function obtenerEmpleadosOrdenadosPorSalario() {
  return [...empleados].sort((a, b) => b.salario - a.salario);
}

export {
  agregarEmpleado,
  eliminarEmpleado,
  buscarPorDepartamento,
  calcularSalarioPromedio,
  obtenerEmpleadosOrdenadosPorSalario
};