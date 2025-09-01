// API Service for data fetching and caching
import { errorHandler } from '../utils/ErrorHandler.js';

export class ApiService {
    constructor(baseURL = '/api/quote') {
        this.baseURL = baseURL;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
        this.timeout = 10000; // 10 seconds
        this.requestQueue = new Map();
        this.setupErrorRecovery();
    }

    /**
     * Setup error recovery strategies
     */
    setupErrorRecovery() {
        // Register recovery strategy for API errors
        errorHandler.registerRecoveryStrategy('API', (errorInfo) => {
            if (errorInfo.statusCode >= 500) {
                // Server errors - retry after delay
                setTimeout(() => {
                    this.clearCache();
                }, 5000);
            } else if (errorInfo.statusCode === 401) {
                // Unauthorized - redirect to login or refresh token
                this.handleUnauthorized();
            } else if (errorInfo.statusCode === 403) {
                // Forbidden - show access denied message
                this.handleForbidden();
            }
        });
    }
    
    async fetch(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const requestId = `${endpoint}-${Date.now()}`;
        
        // Prevent duplicate requests
        if (this.requestQueue.has(requestId)) {
            return this.requestQueue.get(requestId);
        }
        
        // Check cache first
        if (this.cache.has(url) && !options.forceRefresh) {
            const cached = this.cache.get(url);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }
        
        const requestPromise = this.executeRequest(url, endpoint, options);
        this.requestQueue.set(requestId, requestPromise);
        
        try {
            const result = await requestPromise;
            return result;
        } finally {
            this.requestQueue.delete(requestId);
        }
    }

    /**
     * Execute API request with retry logic and error handling
     */
    async executeRequest(url, endpoint, options = {}) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);
                
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    },
                    signal: controller.signal,
                    ...options
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
                    error.status = response.status;
                    error.statusText = response.statusText;
                    error.endpoint = endpoint;
                    
                    // Handle specific HTTP status codes
                    if (response.status >= 500) {
                        error.message = 'Server Error';
                    } else if (response.status === 404) {
                        error.message = 'Not Found';
                    } else if (response.status === 401) {
                        error.message = 'Unauthorized';
                    } else if (response.status === 403) {
                        error.message = 'Forbidden';
                    } else if (response.status === 429) {
                        error.message = 'Too Many Requests';
                    }
                    
                    throw error;
                }
                
                const data = await response.json();
                
                // Validate response data
                if (!this.validateResponse(data, endpoint)) {
                    throw new Error('Invalid response format');
                }
                
                // Cache the response
                this.cache.set(url, {
                    data,
                    timestamp: Date.now()
                });
                
                return data;
                
            } catch (error) {
                lastError = error;
                
                // Handle specific error types
                if (error.name === 'AbortError') {
                    error.message = 'Request Timeout';
                } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    error.message = 'Network Error';
                }
                
                // Log error with attempt information
                errorHandler.handleApiError(error, {
                    endpoint,
                    attempt,
                    maxAttempts: this.retryAttempts,
                    url
                });
                
                // Don't retry on certain errors
                if (this.shouldNotRetry(error)) {
                    break;
                }
                
                // Wait before retry (exponential backoff)
                if (attempt < this.retryAttempts) {
                    const delay = this.retryDelay * Math.pow(2, attempt - 1);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        // All attempts failed
        throw new Error(`Failed to fetch ${endpoint} after ${this.retryAttempts} attempts: ${lastError.message}`);
    }

    /**
     * Check if error should not be retried
     */
    shouldNotRetry(error) {
        // Don't retry on client errors (4xx) except 429
        if (error.status >= 400 && error.status < 500 && error.status !== 429) {
            return true;
        }
        
        // Don't retry on network errors after first attempt
        if (error.message === 'Network Error') {
            return true;
        }
        
        return false;
    }

    /**
     * Validate response data structure
     */
    validateResponse(data, endpoint) {
        if (!data || typeof data !== 'object') {
            return false;
        }
        
        // Basic validation based on endpoint
        switch (endpoint) {
            case '/packages':
                return Array.isArray(data) && data.length > 0;
            case '/features':
                return Array.isArray(data) && data.length > 0;
            case '/addons':
                return Array.isArray(data);
            case '/components':
                return Array.isArray(data);
            default:
                return true;
        }
    }
    
    async fetchAll() {
        const endpoints = [
            '/packages',
            '/features',
            '/addons',
            '/components',
            '/emergency-services',
            '/service-areas',
            '/hvac-features',
            '/appliance-features',
            '/contact-features'
        ];
        
        const results = {};
        const errors = [];
        
        // Fetch endpoints with individual error handling
        const promises = endpoints.map(async (endpoint) => {
            try {
                const data = await this.fetch(endpoint);
                return { endpoint, data, success: true };
            } catch (error) {
                errors.push({ endpoint, error: error.message });
                return { endpoint, data: null, success: false, error };
            }
        });
        
        const responses = await Promise.allSettled(promises);
        
        // Process successful responses
        responses.forEach((response, index) => {
            if (response.status === 'fulfilled' && response.value.success) {
                const { endpoint, data } = response.value;
                const key = this.getDataKey(endpoint);
                results[key] = data;
            }
        });
        
        // Handle partial failures
        if (errors.length > 0) {
            const failedEndpoints = errors.map(e => e.endpoint).join(', ');
            errorHandler.handleError(new Error(`Failed to fetch: ${failedEndpoints}`), {
                context: 'API',
                severity: 'warning',
                userActionable: true,
                recoverable: true,
                failedEndpoints: errors
            });
        }
        
        // Ensure all required data is present
        const requiredKeys = ['packages', 'features'];
        const missingKeys = requiredKeys.filter(key => !results[key]);
        
        if (missingKeys.length > 0) {
            throw new Error(`Critical data missing: ${missingKeys.join(', ')}`);
        }
        
        return results;
    }

    /**
     * Get data key from endpoint
     */
    getDataKey(endpoint) {
        const keyMap = {
            '/packages': 'packages',
            '/features': 'features',
            '/addons': 'addons',
            '/components': 'components',
            '/emergency-services': 'emergencyServices',
            '/service-areas': 'serviceAreas',
            '/hvac-features': 'hvacFeatures',
            '/appliance-features': 'applianceFeatures',
            '/contact-features': 'contactFeatures'
        };
        
        return keyMap[endpoint] || endpoint.replace('/', '');
    }
    
    clearCache() {
        this.cache.clear();
    }
    
    getCacheSize() {
        return this.cache.size;
    }
    
    getCacheStats() {
        const now = Date.now();
        const stats = {
            total: this.cache.size,
            valid: 0,
            expired: 0
        };
        
        for (const [url, cached] of this.cache) {
            if (now - cached.timestamp < this.cacheTimeout) {
                stats.valid++;
            } else {
                stats.expired++;
            }
        }
        
        return stats;
    }

    /**
     * Handle unauthorized access
     */
    handleUnauthorized() {
        errorHandler.handleError(new Error('Unauthorized access'), {
            context: 'API',
            severity: 'error',
            userActionable: true,
            recoverable: false
        });
        
        // Redirect to login or show login modal
        if (window.quoteSystem && window.quoteSystem.showLoginModal) {
            window.quoteSystem.showLoginModal();
        }
    }

    /**
     * Handle forbidden access
     */
    handleForbidden() {
        errorHandler.handleError(new Error('Access forbidden'), {
            context: 'API',
            severity: 'error',
            userActionable: true,
            recoverable: false
        });
    }

    /**
     * Get service health status
     */
    async getHealthStatus() {
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                return { status: 'healthy', timestamp: new Date().toISOString() };
            } else {
                return { status: 'unhealthy', statusCode: response.status };
            }
        } catch (error) {
            return { status: 'unreachable', error: error.message };
        }
    }

    /**
     * Test connectivity
     */
    async testConnectivity() {
        const startTime = Date.now();
        
        try {
            await this.fetch('/packages', { forceRefresh: true });
            const responseTime = Date.now() - startTime;
            
            return {
                connected: true,
                responseTime,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                connected: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}
