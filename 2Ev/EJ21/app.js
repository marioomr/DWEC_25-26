const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const crypto = require('crypto');
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const requiredEnv = [
  'FILEBASE_ENDPOINT',
  'FILEBASE_ACCESS_KEY',
  'FILEBASE_SECRET_KEY',
  'FILEBASE_BUCKET'
];

const requiredDbEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnv = [...requiredDbEnv, ...requiredEnv].filter((k) => !process.env[k]);
if (missingEnv.length) {
  console.error('Faltan variables en .env:', missingEnv.join(', '));
}

const s3 = new S3Client({
  endpoint: process.env.FILEBASE_ENDPOINT,
  region: process.env.FILEBASE_REGION || 'us-east-1',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.FILEBASE_ACCESS_KEY,
    secretAccessKey: process.env.FILEBASE_SECRET_KEY,
  },
});

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  dbQuery('SELECT * FROM alumno')
    .then((results) => {
    res.render('index', { alumnos: results });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error cargando alumnos. Revisa las variables de entorno y la tabla alumno.');
    });
});

app.get('/health', async (req, res) => {
  const env = [...requiredDbEnv, ...requiredEnv].reduce((acc, key) => {
    acc[key] = Boolean(process.env[key]);
    return acc;
  }, {});

  try {
    await dbQuery('SELECT 1');
    res.json({ ok: true, env, db: 'ok' });
  } catch (err) {
    res.status(500).json({
      ok: false,
      env,
      db: err.code || err.message
    });
  }
});

app.post('/crear', upload.single('imagen'), async (req, res) => {

  const { nombre, apellidos, localidad } = req.body;

  if (!req.file) {
    return res.status(400).send('Falta el archivo de imagen');
  }

  const ext = path.extname(req.file.originalname);
  const fileName = crypto.randomUUID() + ext;

  try {

    await s3.send(new PutObjectCommand({
      Bucket: process.env.FILEBASE_BUCKET,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }));

    await dbQuery(
      'INSERT INTO alumno(nombre, apellidos, localidad, imagen) VALUES (?, ?, ?, ?)',
      [nombre, apellidos, localidad, fileName]
    );

    res.redirect('/');

  } catch (error) {
    const http = error?.$metadata?.httpStatusCode;
    const code = error?.name || error?.Code;
    console.error('S3 PUT error:', {
      code,
      http,
      bucket: process.env.FILEBASE_BUCKET,
      endpoint: process.env.FILEBASE_ENDPOINT,
      region: process.env.FILEBASE_REGION,
    });
    console.error(error);

    // En Filebase a veces llega como "NotFound" genérico con 404.
    if (code === 'NoSuchBucket' || (code === 'NotFound' && http === 404)) {
      res.status(500).send(
        `Error: el bucket "${process.env.FILEBASE_BUCKET}" no existe en Filebase. Créalo y reintenta.`
      );
    } else {
      res.status(500).send('Error subiendo imagen');
    }
  }
});

app.get('/eliminar/:id', (req, res) => {

  const id = req.params.id;

  dbQuery('SELECT imagen FROM alumno WHERE id=?', [id]).then(async (rows) => {

    if (!rows || rows.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    const imagen = rows[0].imagen;

    try {

      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.FILEBASE_BUCKET,
        Key: imagen
      }));

      await dbQuery('DELETE FROM alumno WHERE id=?', [id]);
      res.redirect('/');

    } catch (error) {
      console.log(error);
      res.status(500).send('Error eliminando');
    }

  }).catch((err) => {
    console.log(err);
    res.status(500).send('Error buscando usuario');
  });
});

// En Vercel: se exporta el handler y NO se llama a listen().
// En local: sí levantamos el servidor.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('Servidor en puerto ' + PORT);
  });
}

module.exports = app;
