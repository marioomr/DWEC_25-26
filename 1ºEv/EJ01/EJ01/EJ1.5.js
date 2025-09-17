//1
const estudiantes = [
    { nombre: "Ana", apellidos: "Gonzalez", calificacion: 8, aprobado: true },
    { nombre: "Luis", apellidos: "Fernandez", calificacion: 3, aprobado: false },
    { nombre: "Jose", apellidos: "Martinez", calificacion: 9, aprobado: false },
    { nombre: "Marta", apellidos: "Lopez", calificacion: 6, aprobado: true }
];

//2
const estudiantesID = estudiantes.map((estudiante, index) => {
    return {
        ...estudiante,
        id: index + 1,
    };
});

//3
const estudiantesFiltrados = estudiantes.filter(estudiante => estudiante.calificacion >= 5 );

//4
estudiantesFiltrados.forEach(estudiante => {
    console.log(`¡Felicidades ${estudiante.nombre}, has aprobado con ${estudiante.calificacion}!`)
});

//5
estudiantes.forEach(estudiante => {
  const { nombre, calificacion, aprobado } = estudiante;
  const aprobadoCorrecto = calificacion >= 5;

  if (aprobado !== aprobadoCorrecto) {
    console.log(`⚠️ Incoherencia en el registro de ${nombre}: calificación = ${calificacion}, aprobado = ${aprobado}`);
  }
});

