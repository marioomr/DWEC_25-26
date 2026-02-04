const { albumes } = require('./album.model');
const { artistas } = require('../artista/artista.model');

exports.listar = (req, res) => {
  const resultado = albumes.map(al => ({
    ...al,
    artista: artistas.find(ar => ar.id === al.artistaId)
  }));
  res.render('albumes', { albumes: resultado });
};

exports.form = (req, res) => {
  const album = albumes.find(a => a.id == req.params.id);
  res.render('album-form', { album, artistas, error: null });
};

exports.guardar = (req, res) => {
  const { id, titulo, anio, artistaId, foto } = req.body;

  if (!titulo || !anio) {
    return res.render('album-form', {
      album: req.body,
      artistas,
      error: 'El título y el año son obligatorios'
    });
  }

  if (id) {
    const album = albumes.find(a => a.id == id);
    album.titulo = titulo;
    album.anio = anio;
    album.artistaId = Number(artistaId);
    album.foto = foto;
  } else {
    albumes.push({
      id: Date.now(),
      titulo,
      anio,
      artistaId: Number(artistaId),
      foto
    });
  }

  res.redirect('/albumes');
};

exports.eliminar = (req, res) => {
  const index = albumes.findIndex(a => a.id == req.params.id);
  albumes.splice(index, 1);
  res.redirect('/albumes');
};
