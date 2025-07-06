import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js'

/* Import Routes */
import apiRoutes from './routes/api.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

/* Configurar motor de vistas EJS */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Rutas estáticas */
app.use(express.static(path.join(__dirname, 'views')));

/* API Routes */
app.use('/api', apiRoutes);

/* Redirección no permitida GET en /api */
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') {
    return res.redirect('/');
  }
  next();
});

/* Ruta raíz */
app.get('/', (req, res) => {
  res.sendFile(path.resolve('src/views/index.html'));
});

app.set('port', config.server_port);

export default app;

