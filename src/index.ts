import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './db/connection';
import { registerRoutes } from './routes/registerRoutes';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_ORIGIN ?? '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, auth-token');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());
registerRoutes(app);

connectDB().then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});