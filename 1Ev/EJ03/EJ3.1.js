const playlist = [
  { titulo: "Control", artista: "Playboi Carti", duracion: 197 },
  { titulo: "One Dance", artista: "Drake", duracion: 294 },
  { titulo: "Disturbia", artista: "Rihanna", duracion: 283 },
  { titulo: "Sorry", artista: "Justin Bieber", duracion: 301 },
  { titulo: "Draco", artista: "Future", duracion: 169 },
  { titulo: "Champions", artista: "Kanye West", duracion: 390 },
  { titulo: "Rack City", artista: "Tyga", duracion: 356 },
  { titulo: "She Will", artista: "Lil Wayne", duracion: 431 },
  { titulo: "Again", artista: "Fetty Wap", duracion: 242 },
  { titulo: "Lose Yourself", artista: "Eminem", duracion: 326 }
];


playlist.forEach(cancion => {
  console.log(`Título: ${cancion.titulo} - Artista: ${cancion.artista}`);
});
