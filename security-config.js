// ===== SECURITY CONFIGURATION =====

module.exports = {
    // Server Configuration
    port: process.env.PORT || 3031,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // CORS Configuration
    cors: {
        enabled: process.env.CORS_ENABLED !== 'false',
        origins: process.env.ALLOWED_ORIGINS ? 
            process.env.ALLOWED_ORIGINS.split(',') : 
            ['http://localhost:3031', 'http://127.0.0.1:3031'],
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    
    // Rate Limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // requests per window
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false
    },
    
    // Helmet Configuration
    helmet: {
        enabled: process.env.HELMET_ENABLED !== 'false',
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
                "script-src-attr": ["'none'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https://flagcdn.com"],
                connectSrc: ["'self'"],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: []
            }
        },
        hsts: {
            maxAge: parseInt(process.env.HSTS_MAX_AGE) || 31536000,
            includeSubDomains: process.env.HSTS_INCLUDE_SUBDOMAINS !== 'false',
            preload: process.env.HSTS_PRELOAD !== 'false'
        }
    },
    
    // Compression
    compression: {
        enabled: process.env.COMPRESSION_ENABLED !== 'false',
        level: 6,
        threshold: 1024
    },
    
    // Input Validation
    inputValidation: {
        maxLength: 1000,
        allowedTags: [],
        allowedAttributes: []
    },
    
    // Security Headers
    securityHeaders: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    }
};
