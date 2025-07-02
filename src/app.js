/* Import Extensions  */
import express from 'express';
import cors from 'cors';
import path from 'path';

/* Import Routes */
import apiRoutes from './routes/api.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

/* Ruta de archivos estáticos (Servir HTML) */
app.use(express.static(path.resolve('src/views')));

/* Use Routes */
app.use('/api', apiRoutes);

/* Redirección de accesos no permitidos a rutas '/api' con metodo GET */
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') {
    return res.redirect('/');
  }
  next();
});

/* Root '/' */
app.get('/', (req, res) => {
  res.sendFile(path.resolve('src/views/index.html'));
});

/* Set Port  */
app.set('port', 5000);

export default app;
