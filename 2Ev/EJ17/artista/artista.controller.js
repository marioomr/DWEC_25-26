const { artistas } = require('./artista.model');
const { albumes } = require('../album/album.model');

exports.listar = (req, res) => {
  res.render('artistas', { artistas });
};

exports.detalle = (req, res) => {
  const artista = artistas.find(a => a.id == req.params.id);
  const albums = albumes.filter(al => al.artistaId == artista.id);
  res.render('artista-detalle', { artista, albums });
};

exports.form = (req, res) => {
  const artista = artistas.find(a => a.id == req.params.id);
  res.render('artista-form', { artista });
};

exports.guardar = (req, res) => {
  const { id, nombre, pais, genero, fecha_formacion, foto } = req.body;

  if (id) {
    const artista = artistas.find(a => a.id == id);
    Object.assign(artista, { nombre, pais, genero, fecha_formacion, foto });
  } else {
    artistas.push({
      id: Date.now(),
      nombre,
      pais,
      genero,
      fecha_formacion,
      foto
    });
  }

  res.redirect('/artistas');
};

exports.eliminar = (req, res) => {
  const index = artistas.findIndex(a => a.id == req.params.id);
  artistas.splice(index, 1);
  res.redirect('/artistas');
};
