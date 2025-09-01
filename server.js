// ===== HVAC & APPLIANCE REPAIR WEBSITE QUOTE SYSTEM =====

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const securityConfig = require('./security-config');
const app = express();
const PORT = securityConfig.port;

// Security middleware
if (securityConfig.helmet.enabled) {
    app.use(helmet({
        contentSecurityPolicy: securityConfig.helmet.contentSecurityPolicy,
        hsts: securityConfig.helmet.hsts
    }));
}

// Apply custom security headers
app.use((req, res, next) => {
    Object.entries(securityConfig.securityHeaders).forEach(([header, value]) => {
        res.setHeader(header, value);
    });
    next();
});

// CORS configuration
if (securityConfig.cors.enabled) {
    app.use(cors(securityConfig.cors));
}

// Rate limiting
if (securityConfig.rateLimit.enabled !== false) {
    app.use('/api/', rateLimit(securityConfig.rateLimit));
}

// Compression middleware
if (securityConfig.compression.enabled) {
    app.use(compression(securityConfig.compression));
}

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input validation middleware
const validateInput = (req, res, next) => {
    const sanitizeString = (str) => {
        if (typeof str !== 'string') return '';
        return str.replace(/[<>\"'&]/g, '');
    };
    
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeString(req.body[key]);
            }
        });
    }
    
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitizeString(req.query[key]);
            }
        });
    }
    
    next();
};

app.use(validateInput);

// Security error handling middleware
app.use((err, req, res, next) => {
    console.error('Security Error:', err);
    
    // Don't leak error details in production
    if (securityConfig.nodeEnv === 'production') {
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: 'Something went wrong. Please try again later.'
        });
    } else {
        res.status(500).json({ 
            error: err.message,
            stack: err.stack
        });
    }
});

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(__dirname));

// Serve about-us.html
app.get('/about-us.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'about-us.html'));
});

app.get('/api/quote/packages', (req, res) => {
    res.json([
        {
            id: 'hvac-appliance-website',
            name: 'Professional HVAC & Appliance Website',
            price: 1200,
            originalPrice: 1700,
            timeline: '18-24 days',
            description: 'Complete professional website for HVAC and appliance repair businesses',
            includedFeatures: [
                'Professional Homepage',
                'Mobile-Responsive Design',
                'Contact Forms & Phone Integration',
                'Service Pages (HVAC & Appliance)',
                'About Us Page',
                'Emergency Service Call Buttons',
                'Service Area Coverage',
                'Basic SEO Optimization',
                'Google Analytics Integration',
                'Customer Testimonials Section',
                'Business Hours & Location',
                'Brand Support Information'
            ]
        }
    ]);
});

app.get('/api/quote/additional-features', (req, res) => {
    res.json([
        {
            id: 'online-booking',
            name: 'Smart Booking & Scheduling',
            price: 450,
            timeline: '8-12 days',
            description: 'Professional appointment booking system with calendar sync, SMS reminders, and automated confirmations. Perfect for HVAC maintenance scheduling.',
            icon: 'calendar'
        },
        {
            id: 'enhanced-seo',
            name: 'Premium Local SEO',
            price: 350,
            timeline: '10-15 days',
            description: 'Advanced local SEO optimization including Google My Business management, local citations, and review management for HVAC businesses.',
            icon: 'trending-up'
        },
        {
            id: 'social-media',
            name: 'Social Media Hub',
            price: 250,
            timeline: '5-7 days',
            description: 'Complete social media integration with Facebook, Instagram, and Google Business feeds. Showcase your HVAC work and customer reviews.',
            icon: 'share-2'
        },
        {
            id: 'customer-portal',
            name: 'Customer Service Portal',
            price: 550,
            timeline: '12-18 days',
            description: 'Professional customer portal with service history, digital invoices, maintenance schedules, and warranty tracking for HVAC clients.',
            icon: 'users'
        },
        {
            id: 'live-chat',
            name: '24/7 Live Chat Support',
            price: 400,
            timeline: '6-9 days',
            description: 'Professional live chat system with HVAC-specific automated responses, emergency service requests, and instant customer support.',
            icon: 'message-circle'
        },
        {
            id: 'advanced-analytics',
            name: 'Business Intelligence Dashboard',
            price: 500,
            timeline: '9-14 days',
            description: 'Advanced analytics dashboard with lead tracking, conversion optimization, customer insights, and HVAC business performance metrics.',
            icon: 'bar-chart-3'
        }
    ]);
});

app.get('/api/quote/components', (req, res) => {
    res.json({
        pages: [
            {
                id: 'hvac-homepage',
                name: 'Professional HVAC & Appliance Homepage',
                price: 0,
                description: 'Professional homepage showcasing HVAC and appliance repair services with emergency call buttons, service highlights, and customer testimonials'
            },
            {
                id: 'service-pages',
                name: 'Comprehensive Service Pages',
                price: 0,
                description: 'Detailed pages for HVAC repair, appliance repair, installation, and maintenance services with pricing and service details'
            },
            {
                id: 'contact-form',
                name: 'Contact Form & Phone Integration',
                price: 0,
                description: 'Professional contact forms with phone integration, lead capture, and automated response system'
            },
            {
                id: 'business-hours',
                name: 'Business Hours & Location',
                price: 0,
                description: 'Business hours display, location information, and interactive map integration'
            },
            {
                id: 'about-us',
                name: 'About Us Page',
                price: 99,
                description: 'Professional about us page with company history, team information, and credentials'
            },
            {
                id: 'testimonials-page',
                name: 'Customer Testimonials Page',
                price: 149,
                description: 'Dedicated testimonials page showcasing customer reviews and success stories'
            },
            {
                id: 'service-areas-page',
                name: 'Service Areas Page',
                price: 199,
                description: 'Detailed service areas page with interactive map and coverage information'
            },
            {
                id: 'warranty-page',
                name: 'Warranty Information Page',
                price: 99,
                description: 'Warranty information page with terms, conditions, and coverage details'
            },
            {
                id: 'faq-page',
                name: 'FAQ Page',
                price: 149,
                description: 'Frequently asked questions page with common HVAC and appliance repair queries'
            }
        ],
        features: [
            {
                id: 'local-seo',
                name: 'Local SEO Optimization',
                price: 0,
                description: 'Local SEO optimization for HVAC and appliance repair businesses with Google My Business integration'
            },
            {
                id: 'google-analytics',
                name: 'Google Analytics Integration',
                price: 0,
                description: 'Google Analytics integration, visitor tracking, and performance monitoring'
            },
            {
                id: 'email-support',
                name: 'Email Support System',
                price: 0,
                description: 'Email support system with ticket tracking and basic technical assistance'
            },
            {
                id: 'hvac-brand-support',
                name: 'HVAC Brand Support',
                price: 0,
                description: 'Support for major HVAC brands: Carrier, Trane, Lennox, Rheem, Goodman with warranty information'
            },
            {
                id: 'appliance-brand-support',
                name: 'Appliance Brand Support',
                price: 0,
                description: 'Support for major appliance brands: Samsung, LG, Whirlpool, GE, Maytag with service manuals'
            },
            {
                id: 'emergency-services',
                name: 'Emergency Service Management',
                price: 299,
                description: 'Dedicated page for emergency HVAC and appliance services with 24/7 availability'
            },
            {
                id: 'mobile-design',
                name: 'Mobile-Optimized Design',
                price: 0,
                description: 'Fully responsive mobile-optimized design for all devices with touch-friendly interface'
            },
            {
                id: 'online-booking',
                name: 'Online Booking & Scheduling',
                price: 399,
                description: 'Advanced scheduling system for regular maintenance and repair appointments with calendar integration'
            },
            {
                id: 'testimonials',
                name: 'Customer Reviews & Testimonials',
                price: 199,
                description: 'Showcase customer reviews and testimonials for HVAC and appliance services with rating system'
            },
            {
                id: 'service-areas',
                name: 'Service Area Management',
                price: 249,
                description: 'Interactive map showing service coverage areas with zip code lookup and radius display'
            },
            {
                id: 'premium-seo',
                name: 'Premium SEO & Content Strategy',
                price: 399,
                description: 'Advanced SEO with keyword optimization, content strategy, and performance tracking'
            },
            {
                id: 'social-links',
                name: 'Social Media Links',
                price: 99,
                description: 'Social media links and sharing buttons for Facebook, Instagram, and Google'
            },
            {
                id: 'social-feeds',
                name: 'Social Media Feeds Integration',
                price: 199,
                description: 'Full social media integration with feeds, posting, and analytics dashboard'
            },
            {
                id: 'advanced-analytics',
                name: 'Advanced Analytics Dashboard',
                price: 299,
                description: 'Advanced analytics dashboard with lead tracking, conversion optimization, and performance monitoring'
            },
            {
                id: 'priority-support',
                name: 'Priority Support',
                price: 199,
                description: 'Priority customer support with phone and live chat assistance'
            },
            {
                id: 'commercial-hvac-support',
                name: 'Commercial HVAC Support',
                price: 149,
                description: 'Extended support for commercial HVAC systems and additional brands'
            },
            {
                id: 'commercial-appliance-support',
                name: 'Commercial Appliance Support',
                price: 149,
                description: 'Extended support for commercial appliances and additional brands'
            },
            {
                id: 'maintenance-programs',
                name: 'Maintenance Programs',
                price: 149,
                description: 'Seasonal maintenance scheduling, preventive maintenance programs with automated reminders'
            },
            {
                id: 'installation-services',
                name: 'Installation Services',
                price: 149,
                description: 'New appliance installation, replacement services, old appliance removal with warranty'
            },
            {
                id: 'commercial-hvac',
                name: 'Commercial HVAC Systems',
            price: 199,
                description: 'Commercial HVAC systems, rooftop units, package units, and industrial systems support'
            },
            {
                id: 'commercial-appliances',
                name: 'Commercial Appliance Systems',
                price: 199,
                description: 'Commercial kitchen equipment, restaurant appliances, industrial equipment support'
            },
            {
                id: 'service-request',
                name: 'Service Request System',
                price: 149,
                description: 'Complete service request management system with status tracking and notifications'
            },
            {
                id: 'request-forms',
                name: 'Service Request Forms',
                price: 99,
                description: 'Custom service request forms for different service types with validation'
            }
        ],
        technical: [
            {
                id: 'ssl-certificate',
                name: 'SSL Security Certificate',
                price: 79,
                description: 'SSL certificate for secure HTTPS connection and data protection'
            },
            {
                id: 'backup-system',
                name: 'Automated Backup System',
                price: 99,
                description: 'Daily automated backups with 30-day retention and disaster recovery'
            },
            {
                id: 'cdn-integration',
                name: 'CDN Integration',
                price: 149,
                description: 'Content Delivery Network for faster loading speeds and global accessibility'
            },
            {
                id: 'database-optimization',
                name: 'Database Optimization',
                price: 199,
                description: 'Database optimization for improved performance and faster queries'
            },
            {
                id: 'api-integration',
                name: 'API Integration',
                price: 299,
                description: 'Custom API integration for third-party services and data synchronization'
            },
            {
                id: 'performance-monitoring',
                name: 'Performance Monitoring',
                price: 149,
                description: 'Real-time performance monitoring with uptime tracking and alerting'
            },
            {
                id: 'security-scanning',
                name: 'Security Scanning',
                price: 199,
                description: 'Regular security scanning and vulnerability assessment with automated fixes'
            },
            {
                id: 'load-balancing',
                name: 'Load Balancing',
                price: 399,
                description: 'Load balancing for high traffic handling and improved reliability'
            },
            {
                id: 'caching-system',
                name: 'Advanced Caching System',
                price: 179,
                description: 'Advanced caching system for improved page load speeds and user experience'
            },
            {
                id: 'mobile-app',
                name: 'Mobile App Development',
                price: 599,
                description: 'Native mobile app development for iOS and Android platforms'
            }
        ]
    });
});

app.get('/api/quote/addon-services', (req, res) => {
    res.json([
        {
            id: 'content-creation',
            name: 'Professional Content Creation',
            price: 450,
            timeline: '12-18 days',
            description: 'Complete content creation including HVAC service descriptions, company story, blog posts, and SEO-optimized content for better search rankings.',
            icon: 'file-text'
        },
        {
            id: 'google-ads-setup',
            name: 'Google Ads & PPC Management',
            price: 600,
            timeline: '8-12 days',
            description: 'Complete Google Ads setup with HVAC-specific keywords, local targeting, conversion tracking, and first month campaign management.',
            icon: 'trending-up'
        },
        {
            id: 'website-maintenance',
            name: 'Premium Website Maintenance',
            price: 150,
            timeline: '3-5 days',
            description: 'Monthly website maintenance including security updates, performance optimization, content updates, and technical support.',
            icon: 'settings'
        },
        {
            id: 'mobile-app-development',
            name: 'Mobile App Development',
            price: 1599,
            timeline: '25-35 days',
            description: 'Professional mobile app development for iOS and Android platforms with HVAC service booking, emergency contact, service tracking, and customer portal.',
            icon: 'smartphone'
        },
        {
            id: 'sms-integration',
            name: 'SMS Integration & Notifications',
            price: 299,
            timeline: '7-10 days',
            description: 'SMS integration for appointment reminders, service updates, emergency notifications, and automated customer communication via text messages.',
            icon: 'message-circle'
        },
        {
            id: 'multi-language-support',
            name: 'Multi-Language Support',
            price: 199,
            timeline: '10-15 days',
            description: 'Multi-language website support with language switcher, translated content for Spanish, French, and other languages, and localized SEO optimization. Includes 2 languages ($99 per additional language).',
            icon: 'languages'
        },
        {
            id: 'domain-reservation',
            name: 'Domain Name Reservation',
            price: 20,
            timeline: '2-3 days',
            description: 'Professional domain name reservation and registration for your HVAC business website.',
            icon: 'globe'
        },
        {
            id: 'cpanel-hosting-3months',
            name: 'cPanel Hosting (3 Months)',
            price: 60,
            timeline: '2-3 days',
            description: 'Professional cPanel hosting for 3 months with SSL certificate, email hosting, database support, and 24/7 technical support.',
            icon: 'server'
        },
        {
            id: 'cpanel-hosting-1year',
            name: 'cPanel Hosting (1 Year) - Save $40',
            price: 200,
            timeline: '2-3 days',
            description: 'Professional cPanel hosting for 1 year with SSL certificate, email hosting, database support, and 24/7 technical support. Save $40 compared to 3-month plan.',
            icon: 'server'
        },
        {
            id: 'advanced-security-audit',
            name: 'Advanced Security & Audit',
            price: 399,
            timeline: '8-12 days',
            description: 'Comprehensive security audit, vulnerability assessment, penetration testing, security monitoring, and compliance reporting for your HVAC business website.',
            icon: 'shield-check'
        }
    ]);
});

// API endpoint for emergency services
app.get('/api/quote/emergency-services', (req, res) => {
    const emergencyServices = [
        {
            id: 'standard-emergency',
            name: 'Standard Emergency Service',
            price: 149,
            responseTime: '2-4 hours',
            features: [
                '24/7 emergency hotline',
                'Same-day service availability',
                'Emergency dispatch system',
                'Customer notification system'
            ],
            popular: false
        },
        {
            id: 'premium-emergency',
            name: 'Premium Emergency Service',
            price: 299,
            responseTime: '1-2 hours',
            features: [
                'Priority emergency response',
                'Real-time technician tracking',
                'Advanced notification system',
                'Extended service hours',
                'Emergency parts availability'
            ],
            popular: false
        },
        {
            id: 'vip-emergency',
            name: 'VIP Emergency Service',
            price: 449,
            responseTime: '30-60 minutes',
            features: [
                'Ultra-fast emergency response',
                'Dedicated emergency team',
                'Premium customer support',
                'Guaranteed response time',
                'Comprehensive emergency coverage'
            ],
            popular: false
        }
    ];
    res.json(emergencyServices);
});

// API endpoint for service areas
app.get('/api/quote/service-areas', (req, res) => {
    const serviceAreas = [
        {
            id: 'primary-zone',
            name: 'Primary Service Zone',
            price: 0,
            radius: '15-mile radius',
            responseTime: 'Same day',
            features: [
                'Standard service coverage',
                'Regular maintenance visits',
                'Emergency service availability',
                'Local parts availability'
            ]
        },
        {
            id: 'extended-zone',
            name: 'Extended Service Zone',
            price: 199,
            radius: '30-mile radius',
            responseTime: 'Next day',
            features: [
                'Extended service coverage',
                'Travel time included',
                'Emergency service with surcharge',
                'Remote diagnostics available'
            ]
        },
        {
            id: 'premium-zone',
            name: 'Premium Service Zone',
            price: 349,
            radius: '50-mile radius',
            responseTime: 'Within 48 hours',
            features: [
                'Maximum service coverage',
                'Premium travel arrangements',
                'Emergency service priority',
                'Comprehensive service guarantee'
            ]
        }
    ];
    res.json(serviceAreas);
});

// API endpoint for HVAC features
app.get('/api/quote/hvac-features', (req, res) => {
    const hvacFeatures = [
        {
            id: 'hvac-brand-support',
            name: 'HVAC Brand Support',
            price: 149,
            description: 'Support for all major HVAC brands with comprehensive service coverage',
            brands: ['Carrier', 'Trane', 'Lennox', 'Rheem', 'Goodman', 'Bryant', 'American Standard']
        },
        {
            id: 'commercial-hvac',
            name: 'Commercial HVAC Systems',
            price: 299,
            description: 'Commercial HVAC systems, rooftop units, package units, and industrial systems',
            brands: ['All Commercial Brands', 'Rooftop Units', 'Package Units', 'Industrial Systems']
        },
        {
            id: 'maintenance-programs',
            name: 'Maintenance Programs',
            price: 199,
            description: 'Seasonal maintenance scheduling and preventive maintenance programs',
            brands: ['All Systems', 'Bi-annual', 'Annual', 'Preventive']
        },
        {
            id: 'hvac-installation',
            name: 'HVAC Installation Services',
            price: 249,
            description: 'Complete HVAC system installation with warranty and support',
            brands: ['Carrier', 'Trane', 'Lennox', 'Rheem', 'Goodman']
        },
        {
            id: 'hvac-repair',
            name: 'HVAC Repair Services',
            price: 199,
            description: 'Professional HVAC repair for all major brands and systems',
            brands: ['All Major Brands', 'Residential', 'Commercial']
        }
    ];
    res.json(hvacFeatures);
});

// API endpoint for appliance features
app.get('/api/quote/appliance-features', (req, res) => {
    const applianceFeatures = [
        {
            id: 'appliance-brand-support',
            name: 'Appliance Brand Support',
            price: 149,
            description: 'Support for all major appliance brands with comprehensive service coverage',
            brands: ['Samsung', 'LG', 'Whirlpool', 'GE', 'Maytag', 'Bosch', 'KitchenAid']
        },
        {
            id: 'commercial-appliances',
            name: 'Commercial Appliance Systems',
            price: 299,
            description: 'Commercial kitchen equipment, restaurant appliances, industrial equipment',
            brands: ['All Commercial Brands', 'Restaurant Equipment', 'Industrial Systems', 'Kitchen Equipment']
        },
        {
            id: 'installation-services',
            name: 'Installation Services',
            price: 199,
            description: 'New appliance installation, replacement services, old appliance removal',
            brands: ['All Brands', 'Installation', 'Replacement', 'Removal']
        },
        {
            id: 'refrigerator-repair',
            name: 'Refrigerator Repair',
            price: 179,
            description: 'Professional refrigerator repair for all major brands',
            brands: ['Samsung', 'LG', 'Whirlpool', 'GE', 'Frigidaire']
        },
        {
            id: 'washer-dryer-repair',
            name: 'Washer & Dryer Repair',
            price: 159,
            description: 'Complete washer and dryer repair services',
            brands: ['Maytag', 'Whirlpool', 'Samsung', 'LG', 'GE']
        }
    ];
    res.json(applianceFeatures);
});

// API endpoint for contact features
app.get('/api/quote/contact-features', (req, res) => {
    const contactFeatures = [
        {
            id: 'emergency-hotline',
            name: '24/7 Emergency Hotline',
            price: 149,
            description: 'Dedicated emergency hotline for urgent HVAC and appliance issues'
        },
        {
            id: 'online-chat',
            name: 'Live Chat Support',
            price: 99,
            description: 'Real-time chat support for customer inquiries and scheduling'
        },
        {
            id: 'callback-request',
            name: 'Callback Request System',
            price: 79,
            description: 'Automated callback request system for customer convenience'
        },
        {
            id: 'contact-forms',
            name: 'Advanced Contact Forms',
            price: 89,
            description: 'Custom contact forms with file uploads and service selection'
        },
        {
            id: 'phone-integration',
            name: 'Phone System Integration',
            price: 199,
            description: 'Integration with business phone systems and call tracking'
        }
    ];
    res.json(contactFeatures);
});

// Serve success.html
app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'success.html'));
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler - must be last
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: 'The requested resource was not found.'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 HVAC & Appliance Repair Quote System running on http://localhost:${PORT}`);
    console.log(`📋 Quote packages and features available`);
    console.log(`🔧 Emergency services and service areas configured`);
});

module.exports = app;

