import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';


import { initializeSocket } from './socket/socket.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);


const io = initializeSocket(server);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api', routes);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


export { io };