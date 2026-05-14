const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
// `path` ya está importado arriba para usarlo también en dotenv.
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL conectado");
});

// Filebase (según su panel) suele mostrar estas claves de config:
// endpoint, accessKeyId, secretAccessKey, region, signatureVersion
// Mantenemos FILEBASE_BUCKET porque tu app necesita un bucket fijo.
const requiredEnv = ['endpoint', 'accessKeyId', 'region', 'FILEBASE_BUCKET'];

const missingEnv = requiredEnv.filter((k) => !process.env[k]);
if (missingEnv.length) {
  console.error('Faltan variables en .env:', missingEnv.join(', '));
}

const s3 = new S3Client({
  // Filebase S3-compatible endpoint
  endpoint: process.env.endpoint,
  // Filebase recomienda "auto" (us-east-1 sigue funcionando en integraciones viejas)
  region: process.env.region || 'auto',
  // En Filebase suele funcionar mejor virtual-hosted style (bucket como subdominio)
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.accessKeyId,
    // Tu .env puede llamarlo secretAccessKey (recomendado) o FILEBASE_SECRET_KEY (legacy)
    secretAccessKey: process.env.secretAccessKey || process.env.FILEBASE_SECRET_KEY,
  },
});

// Validación rápida al arrancar.
// Nota: Filebase puede devolver 404/NotFound en HeadBucket aunque el bucket exista.
// Un check menos problemático es intentar listar (o, en su defecto, no bloquear el arranque).
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

    // No bloqueamos el servidor por un check que en Filebase puede ser ambiguo.
    console.error('S3 WARN: no se pudo verificar el bucket al arrancar:', code, http);
  }
})();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  db.query('SELECT * FROM alumno', (err, results) => {
    if (err) console.log(err);
    res.render('index', { alumnos: results });
  });
});

app.post('/crear', upload.single('imagen'), async (req, res) => {

  const { nombre, apellidos, localidad } = req.body;

  if (!req.file) {
    return res.status(400).send('Falta el archivo de imagen');
  }

  const fileName = req.file.filename;
  const fileContent = fs.readFileSync(req.file.path);

  try {

    await s3.send(new PutObjectCommand({
      Bucket: process.env.FILEBASE_BUCKET,
      Key: fileName,
      Body: fileContent,
      ContentType: req.file.mimetype
    }));

    db.query(
      'INSERT INTO alumno(nombre, apellidos, localidad, imagen) VALUES (?, ?, ?, ?)',
      [nombre, apellidos, localidad, fileName],
      (err) => {
        if (err) console.log(err);

        fs.unlinkSync(req.file.path);
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

    const imagen = rows[0].imagen;

    try {

      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.FILEBASE_BUCKET,
        Key: imagen
      }));

      db.query('DELETE FROM alumno WHERE id=?', [id]);

      res.redirect('/');

    } catch (error) {
      console.log(error);
      res.send('Error eliminando');
    }

  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor en puerto " + PORT);
});