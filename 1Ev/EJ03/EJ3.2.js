const playlist = [
  { titulo: "Bohemian Rhapsody", artista: "Queen", duracion: 354 },
  { titulo: "Billie Jean", artista: "Michael Jackson", duracion: 294 },
  { titulo: "Imagine", artista: "John Lennon", duracion: 183 },
  { titulo: "Smells Like Teen Spirit", artista: "Nirvana", duracion: 301 },
  { titulo: "Like a Rolling Stone", artista: "Bob Dylan", duracion: 369 },
  { titulo: "Hotel California", artista: "Eagles", duracion: 390 },
  { titulo: "Sweet Child O' Mine", artista: "Guns N' Roses", duracion: 356 },
  { titulo: "Hey Jude", artista: "The Beatles", duracion: 431 },
  { titulo: "Shake It Off", artista: "Taylor Swift", duracion: 242 },
  { titulo: "Lose Yourself", artista: "Eminem", duracion: 326 }
];


const cancionesLargas = playlist.filter(cancion => cancion.duracion > 180);


const mensajes = cancionesLargas.map(cancion => 
  `La canción ‘${cancion.titulo}’ de ${cancion.artista} dura ${cancion.duracion} segundos.`
);


console.log("Canciones con duración mayor a 180 segundos:");
mensajes.forEach(mensaje => console.log(mensaje))