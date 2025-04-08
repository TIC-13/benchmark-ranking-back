import express from 'express'
import phoneRouter from './routes/phone';
import inferenceRouter from './routes/inference';
import llmInferenceRouter from "./routes/llmInferences"
import reportRouter from "./routes/report"
import utilsRouter from "./routes/utils"
import errorHandler from './middleware/error';
import cors from 'cors';
import decryptRequestBody from './middleware/decrypt';

const app = express()

app.use(cors());

app.use(express.json());

app.use(decryptRequestBody)

app.use('/phone', phoneRouter);
app.use('/inference', inferenceRouter);
app.use("/llmInference", llmInferenceRouter)
app.use("/utils", utilsRouter)
app.use("/report", reportRouter)

app.use(errorHandler)

export default app