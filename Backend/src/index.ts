import express from 'express';

//? rotes import
import authRoute  from './routes/authRoute'

//? middleware import
import { authRateLimiter } from './middleware/midlleware';



const app = express();
const PORT = 3000;



// Apply rate limiter to auth routes
app.use('/auth', authRateLimiter, authRoute);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});