import helmet from 'helmet';

// Security middleware configuration
const securityMiddleware = [
  // Basic security headers
  helmet(),

  // Content Security Policy
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  }),

  // Cross-Origin Resource Policy
  helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }),

  // DNS Prefetch Control
  helmet.dnsPrefetchControl(),

  // Don't Sniff Mimetype
  helmet.noSniff(),

  // Referrer Policy
  helmet.referrerPolicy({ policy: 'no-referrer' }),

  // XSS Protection
  helmet.xssFilter(),

  // Replace noCache with Cache-Control header
  (req, res, next) => {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  },

  // HSTS (only in production)
  ...(process.env.NODE_ENV === 'production'
    ? [
        helmet.hsts({
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }),
      ]
    : []),
].filter(Boolean);

export { securityMiddleware };
