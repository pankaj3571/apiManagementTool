import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './db/connection';
import { registerRoutes } from './routes/registerRoutes';

const app = express();
const port = Number(process.env.PORT) || 3000;

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