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
import {  verifyToken } from './middleware/midlleware';

const corsOptions = {
    origin: 'https://dasaram-admin.pages.dev', // Allow this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};


const app = express();
const PORT = 3000;
dotenv.config();

app.use(express.json());
app.use(cors(corsOptions));
// This is needed for preflight requests (OPTIONS requests)
app.options('*', cors(corsOptions));

const api = "/api/v1/free";

// Apply rate limiter to auth routes
app.use(`${api}/auth`, authRoute);
app.use(`${api}/attendance`, verifyToken, attendanceRoute);
app.use(`${api}/student`,verifyToken, studentRoute);
app.use(`${api}/teacher`, verifyToken, teacherRoute);
app.use(`${api}/test`, testRoute); // use in app
app.use(`${api}/subject-standard`, subjectStandardRoute); // use in app
app.use(`${api}/notfy`,  notfy); // use in app



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});