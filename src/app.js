/* Import Extension  */
import express from 'express';
import cors from 'cors';

/* Import Routes */
import apiRoutes from './routes/api.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

/* Use Routes */
app.use('/api', apiRoutes);

/* Set Port  */
app.set('port', 5000);

export default app;
