import { rateLimit } from 'express-rate-limit';

/**
 * Rate limiting middleware configuration.
 * Limits requests per IP address to prevent abuse and ensure API stability.
 *
 * Configuration:
 * - Window: 15 minutes
 * - Limit: 100 requests per IP per window
 * - Headers: Standard rate limit headers enabled
 * - Legacy headers: Disabled for cleaner response headers
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Too many requests, please try again later.',
  },
});

export default limiter;
