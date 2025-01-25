import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Rate limiter middleware
export const authRateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 2 minutes'
});

// JWT token verifier middleware
export const verifyToken = (req: any, res: any, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

