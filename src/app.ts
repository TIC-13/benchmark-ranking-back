import express from 'express'
import phoneRouter from './routes/phone';
import inferenceRouter from './routes/inference';
import errorHandler from './middleware/error';
import cors from 'cors';

const app = express()

app.use(cors());

app.use(express.json());

app.use('/phone', phoneRouter);
app.use('/inference', inferenceRouter);

app.use(errorHandler)

export default app