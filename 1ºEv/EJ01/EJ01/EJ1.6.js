//1
const cursos = [
    {
        nombre: "DWEC", profesor: "Pablo", estudiantes: [
            { nombre: "Mario", calificacion: 9 },
            { nombre: "Dario", calificacion: 3 },
            { nombre: "Sergio", calificacion: 7 },
        ]
    },
    {
        nombre: "DIW", profesor: "Daniel", estudiantes: [
            { nombre: "Mario", calificacion: 6 },
            { nombre: "Dario", calificacion: 5 },
            { nombre: "Sergio", calificacion: 1 },
        ]
    },
    {
        nombre: "FOL", profesor: "Arturo", estudiantes: [
            { nombre: "Mario", calificacion: 8 },
            { nombre: "Dario", calificacion: 6 },
            { nombre: "Sergio", calificacion: 7 },
        ]
    },
    {
        nombre: "DAW", profesor: "Marco", estudiantes: [
            { nombre: "Mario", calificacion: 10 },
            { nombre: "Dario", calificacion: 6 },
            { nombre: "Sergio", calificacion: 8 },
        ]
    },
]

//2
const resumenCursos = cursos.map(curso => {
    const nombreCurso = curso.nombre
    // const sumCalificaciones = estudiantes.reduce((acum, estudiante) => acum + estudiante.calificacion, 0);

});

//3
const cursosDestacados = cursos.filter(curso => {
    const total = curso.estudiantes.reduce((acum, estudiante) => acum + estudiante.calificacion, 0);
    const promedio = total / curso.estudiantes.length;
    return promedio >= 7;
});

//4
cursosDestacados.forEach(curso => {
    const total = curso.estudiantes.reduce((acum, estudiante) => acum + estudiante.calificacion, 0);
    const promedio = total / curso.estudiantes.length;
    console.log(`📘 El curso ${curso.nombre} tiene un promedio de ${promedio.toFixed(2)} y es considerado destacado.`);
});

//5
cursos.forEach(curso => {
    const menos4 = curso.estudiantes.some(estudiante => estudiante.calificacion < 4);
    if(menos4){
        console.log(`⚠️ Atención: En el curso ${curso.nombre} hay estudiantes con calificaciones muy bajas.`);
    }
});