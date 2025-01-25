import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

//? rotes import
import authRoute  from './routes/authRoute'
import attendanceRoute from './routes/attedanceRoute'
import studentRoute from './routes/studentRoute'
import teacherRoute from './routes/teacherRoute'
import testRoute from './routes/testRoute'
import subjectStandardRoute from './routes/subjectStandardRoute'
import notfy from './routes/notfyRoute'

//? middleware import
import { authRateLimiter, verifyToken } from './middleware/midlleware';



const app = express();
const PORT = 3000;
dotenv.config();

app.use(express.json());
app.use(cors());

const api = "/api/v1/free";

// Apply rate limiter to auth routes
app.use(`${api}/auth`, authRateLimiter, authRoute);
app.use(`${api}/attendance`, verifyToken, attendanceRoute);
app.use(`${api}/student`,verifyToken, studentRoute);
app.use(`${api}/teacher`, verifyToken, teacherRoute);
app.use(`${api}/test`, testRoute); // use in app
app.use(`${api}/subject-standard`, subjectStandardRoute); // use in app
app.use(`${api}/notfy`,  notfy); // use in app



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});