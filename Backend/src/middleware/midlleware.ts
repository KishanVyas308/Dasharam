import rateLimit from 'express-rate-limit';

// Rate limiter middleware
export const authRateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 2 minutes'
});