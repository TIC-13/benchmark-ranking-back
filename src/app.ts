import express from 'express'
import router from './routes/phone';
import errorHandler from './middleware/error';

const app = express()

app.use(express.json());

app.use('/', router);

app.use(errorHandler)

export default app