const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL conectado");
});

const requiredEnv = [
  'FILEBASE_ENDPOINT',
  'FILEBASE_ACCESS_KEY',
  'FILEBASE_SECRET_KEY',
  'FILEBASE_BUCKET'
];

const missingEnv = requiredEnv.filter((k) => !process.env[k]);
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

(async () => {
  if (missingEnv.length) return;
  try {
    await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.FILEBASE_BUCKET,
        MaxKeys: 1,
      })
    );
    console.log('S3 OK: acceso al bucket ->', process.env.FILEBASE_BUCKET);
  } catch (err) {
    const http = err?.$metadata?.httpStatusCode;
    const code = err?.name || err?.Code;

    console.error('S3 WARN: no se pudo verificar el bucket al arrancar:', code, http);
  }
})();

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  db.query('SELECT * FROM alumno', (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error cargando alumnos. Revisa que exista la tabla alumno.');
    }
    res.render('index', { alumnos: results });
  });
});

app.post('/crear', upload.single('imagen'), async (req, res) => {

  const { nombre, apellidos, localidad } = req.body;

  if (!req.file) {
    return res.status(400).send('Falta el archivo de imagen');
  }

  const ext = path.extname(req.file.originalname);
  const fileName = uuidv4() + ext;

  try {

    await s3.send(new PutObjectCommand({
      Bucket: process.env.FILEBASE_BUCKET,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }));

    db.query(
      'INSERT INTO alumno(nombre, apellidos, localidad, imagen) VALUES (?, ?, ?, ?)',
      [nombre, apellidos, localidad, fileName],
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Error guardando usuario');
        }
        res.redirect('/');
      }
    );

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

  db.query('SELECT imagen FROM alumno WHERE id=?', [id], async (err, rows) => {

    if (err) console.log(err);

    if (!rows || rows.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    const imagen = rows[0].imagen;

    try {

      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.FILEBASE_BUCKET,
        Key: imagen
      }));

      db.query('DELETE FROM alumno WHERE id=?', [id], (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Error eliminando usuario');
        }
        res.redirect('/');
      });

    } catch (error) {
      console.log(error);
      res.send('Error eliminando');
    }

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
