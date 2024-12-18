import express from 'express';
import * as dotenv from 'dotenv';

//? rotes import
import authRoute  from './routes/authRoute'
import attendanceRoute from './routes/attedanceRoute'
import studentRoute from './routes/studentRoute'
import teacherRoute from './routes/teacherRoute'
import testRoute from './routes/testRoute'
import subjectStandardRoute from './routes/subjectStandardRoute'


//? middleware import
import { authRateLimiter } from './middleware/midlleware';



const app = express();
const PORT = 3000;
dotenv.config();


// Apply rate limiter to auth routes
app.use('/auth', authRateLimiter, authRoute);
app.use('/attendance', attendanceRoute);
app.use('/student', studentRoute);
app.use('/teacher', teacherRoute);
app.use('/test', testRoute);
app.use('/subject-standard', subjectStandardRoute);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});