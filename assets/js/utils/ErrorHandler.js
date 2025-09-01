/**
 * Comprehensive Error Handler for HVAC Quote System
 * Provides centralized error handling, logging, user notifications, and recovery mechanisms
 */

export class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this.notificationQueue = [];
        this.isProcessingNotifications = false;
        this.errorCounts = new Map();
        this.recoveryStrategies = new Map();
        this.setupGlobalErrorHandlers();
    }

    /**
     * Setup global error handlers for unhandled errors
     */
    setupGlobalErrorHandlers() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
                context: 'Global',
                severity: 'critical',
                recoverable: false
            });
            event.preventDefault();
        });

        // Handle unhandled errors
        window.addEventListener('error', (event) => {
            this.handleError(new Error(`Unhandled Error: ${event.message}`), {
                context: 'Global',
                severity: 'critical',
                recoverable: false,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Handle resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target && event.target.tagName) {
                this.handleError(new Error(`Resource Loading Error: ${event.target.src || event.target.href}`), {
                    context: 'Resource',
                    severity: 'warning',
                    recoverable: true,
                    element: event.target
                });
            }
        }, true);
    }

    /**
     * Main error handling method
     * @param {Error} error - The error object
     * @param {Object} options - Error handling options
     */
    handleError(error, options = {}) {
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            context: options.context || 'Unknown',
            severity: options.severity || 'error',
            recoverable: options.recoverable !== false,
            userActionable: options.userActionable !== false,
            ...options
        };

        // Log the error
        this.logError(errorInfo);

        // Update error counts
        this.updateErrorCount(errorInfo);

        // Show user notification if needed
        if (errorInfo.userActionable) {
            this.showUserNotification(errorInfo);
        }

        // Attempt recovery if possible
        if (errorInfo.recoverable) {
            this.attemptRecovery(errorInfo);
        }

        // Report to analytics/monitoring if critical
        if (errorInfo.severity === 'critical') {
            this.reportToAnalytics(errorInfo);
        }

        return errorInfo;
    }

    /**
     * Log error to internal log and console
     * @param {Object} errorInfo - Error information
     */
    logError(errorInfo) {
        // Add to internal log
        this.errorLog.push(errorInfo);
        
        // Maintain log size
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog.shift();
        }

        // Console logging based on severity
        const logMethod = errorInfo.severity === 'critical' ? 'error' : 
                         errorInfo.severity === 'warning' ? 'warn' : 'log';
        
        console[logMethod](`[${errorInfo.severity.toUpperCase()}] ${errorInfo.context}: ${errorInfo.message}`, {
            timestamp: errorInfo.timestamp,
            stack: errorInfo.stack,
            ...errorInfo
        });
    }

    /**
     * Update error count for rate limiting
     * @param {Object} errorInfo - Error information
     */
    updateErrorCount(errorInfo) {
        const key = `${errorInfo.context}:${errorInfo.message}`;
        const count = this.errorCounts.get(key) || 0;
        this.errorCounts.set(key, count + 1);
    }

    /**
     * Show user-friendly notification
     * @param {Object} errorInfo - Error information
     */
    showUserNotification(errorInfo) {
        const notification = {
            id: `error-${Date.now()}-${Math.random()}`,
            type: this.getNotificationType(errorInfo.severity),
            title: this.getNotificationTitle(errorInfo),
            message: this.getUserFriendlyMessage(errorInfo),
            duration: this.getNotificationDuration(errorInfo.severity),
            errorInfo: errorInfo
        };

        this.notificationQueue.push(notification);
        this.processNotificationQueue();
    }

    /**
     * Process notification queue
     */
    async processNotificationQueue() {
        if (this.isProcessingNotifications || this.notificationQueue.length === 0) {
            return;
        }

        this.isProcessingNotifications = true;

        while (this.notificationQueue.length > 0) {
            const notification = this.notificationQueue.shift();
            
            try {
                // Use existing notification system if available
                if (window.quoteSystem && window.quoteSystem.showNotification) {
                    window.quoteSystem.showNotification(notification.message, notification.type);
                } else {
                    // Fallback to browser notification
                    this.showFallbackNotification(notification);
                }

                // Wait between notifications to avoid spam
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error('Error showing notification:', error);
            }
        }

        this.isProcessingNotifications = false;
    }

    /**
     * Fallback notification method
     * @param {Object} notification - Notification object
     */
    showFallbackNotification(notification) {
        // Create a simple alert as fallback
        const alertDiv = document.createElement('div');
        alertDiv.className = `error-alert error-alert-${notification.type}`;
        alertDiv.innerHTML = `
            <div class="error-alert-content">
                <strong>${notification.title}</strong>
                <p>${notification.message}</p>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, notification.duration);
    }

    /**
     * Get notification type based on severity
     * @param {string} severity - Error severity
     * @returns {string} Notification type
     */
    getNotificationType(severity) {
        switch (severity) {
            case 'critical': return 'error';
            case 'error': return 'error';
            case 'warning': return 'warning';
            case 'info': return 'info';
            default: return 'error';
        }
    }

    /**
     * Get notification title
     * @param {Object} errorInfo - Error information
     * @returns {string} Notification title
     */
    getNotificationTitle(errorInfo) {
        switch (errorInfo.context) {
            case 'API': return 'Connection Error';
            case 'Validation': return 'Input Error';
            case 'Storage': return 'Data Error';
            case 'Resource': return 'Loading Error';
            case 'Global': return 'System Error';
            default: return 'Error';
        }
    }

    /**
     * Get user-friendly error message
     * @param {Object} errorInfo - Error information
     * @returns {string} User-friendly message
     */
    getUserFriendlyMessage(errorInfo) {
        const messages = {
            'API': {
                'Network Error': 'Unable to connect to the server. Please check your internet connection and try again.',
                'Timeout': 'The request took too long to complete. Please try again.',
                'Server Error': 'The server encountered an error. Please try again later.',
                'Not Found': 'The requested information was not found.',
                'Unauthorized': 'You are not authorized to perform this action.',
                'Forbidden': 'Access to this resource is forbidden.',
                'default': 'There was a problem connecting to the server. Please try again.'
            },
            'Validation': {
                'Email Invalid': 'Please enter a valid email address.',
                'Phone Invalid': 'Please enter a valid phone number.',
                'Required Field': 'This field is required.',
                'Min Length': 'This field must be at least {min} characters long.',
                'Max Length': 'This field must be no more than {max} characters long.',
                'default': 'Please check your input and try again.'
            },
            'Storage': {
                'Quota Exceeded': 'Storage space is full. Some data may not be saved.',
                'Not Available': 'Local storage is not available. Your data will not be saved.',
                'Corrupted': 'Saved data appears to be corrupted. Starting fresh.',
                'default': 'There was a problem saving your data.'
            },
            'Resource': {
                'Image Failed': 'Failed to load image. Please refresh the page.',
                'Script Failed': 'Failed to load required resources. Please refresh the page.',
                'Style Failed': 'Failed to load styles. The page may not display correctly.',
                'default': 'Failed to load a required resource. Please refresh the page.'
            },
            'Global': {
                'default': 'An unexpected error occurred. Please refresh the page and try again.'
            }
        };

        const contextMessages = messages[errorInfo.context] || messages['Global'];
        const specificMessage = contextMessages[errorInfo.message] || contextMessages['default'];
        
        return specificMessage.replace(/\{(\w+)\}/g, (match, key) => errorInfo[key] || match);
    }

    /**
     * Get notification duration
     * @param {string} severity - Error severity
     * @returns {number} Duration in milliseconds
     */
    getNotificationDuration(severity) {
        switch (severity) {
            case 'critical': return 10000; // 10 seconds
            case 'error': return 8000;     // 8 seconds
            case 'warning': return 6000;   // 6 seconds
            case 'info': return 4000;      // 4 seconds
            default: return 5000;          // 5 seconds
        }
    }

    /**
     * Attempt error recovery
     * @param {Object} errorInfo - Error information
     */
    attemptRecovery(errorInfo) {
        const recoveryStrategy = this.recoveryStrategies.get(errorInfo.context);
        
        if (recoveryStrategy && typeof recoveryStrategy === 'function') {
            try {
                recoveryStrategy(errorInfo);
            } catch (recoveryError) {
                console.error('Recovery attempt failed:', recoveryError);
            }
        }
    }

    /**
     * Register recovery strategy for specific context
     * @param {string} context - Error context
     * @param {Function} strategy - Recovery function
     */
    registerRecoveryStrategy(context, strategy) {
        this.recoveryStrategies.set(context, strategy);
    }

    /**
     * Report error to analytics/monitoring
     * @param {Object} errorInfo - Error information
     */
    reportToAnalytics(errorInfo) {
        // In a real application, this would send to monitoring service
        // For now, we'll just log it
        console.error('CRITICAL ERROR REPORT:', {
            message: errorInfo.message,
            context: errorInfo.context,
            timestamp: errorInfo.timestamp,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
    }

    /**
     * Create specific error types
     * @param {string} message - Error message
     * @param {string} context - Error context
     * @param {Object} options - Additional options
     * @returns {Error} Custom error object
     */
    createError(message, context, options = {}) {
        const error = new Error(message);
        error.context = context;
        error.timestamp = new Date().toISOString();
        error.userActionable = options.userActionable !== false;
        error.recoverable = options.recoverable !== false;
        error.severity = options.severity || 'error';
        return error;
    }

    /**
     * Handle API errors specifically
     * @param {Error} error - API error
     * @param {Object} requestInfo - Request information
     */
    handleApiError(error, requestInfo = {}) {
        const apiError = this.createError(
            error.message,
            'API',
            {
                severity: this.getApiErrorSeverity(error),
                userActionable: true,
                recoverable: true
            }
        );

        apiError.requestInfo = requestInfo;
        apiError.statusCode = error.status || error.statusCode;
        apiError.endpoint = requestInfo.endpoint;

        this.handleError(apiError);
        return apiError;
    }

    /**
     * Get API error severity based on status code
     * @param {Error} error - API error
     * @returns {string} Error severity
     */
    getApiErrorSeverity(error) {
        const status = error.status || error.statusCode;
        
        if (status >= 500) return 'critical';
        if (status >= 400) return 'error';
        if (status >= 300) return 'warning';
        return 'info';
    }

    /**
     * Handle validation errors
     * @param {Array} validationErrors - Array of validation errors
     * @param {Object} fieldInfo - Field information
     */
    handleValidationErrors(validationErrors, fieldInfo = {}) {
        validationErrors.forEach(error => {
            const validationError = this.createError(
                error.message,
                'Validation',
                {
                    severity: 'warning',
                    userActionable: true,
                    recoverable: true
                }
            );

            validationError.field = error.field;
            validationError.fieldInfo = fieldInfo;

            this.handleError(validationError);
        });
    }

    /**
     * Handle storage errors
     * @param {Error} error - Storage error
     * @param {Object} storageInfo - Storage information
     */
    handleStorageError(error, storageInfo = {}) {
        const storageError = this.createError(
            error.message,
            'Storage',
            {
                severity: 'warning',
                userActionable: false,
                recoverable: true
            }
        );

        storageError.storageInfo = storageInfo;
        this.handleError(storageError);
        return storageError;
    }

    /**
     * Get error statistics
     * @returns {Object} Error statistics
     */
    getErrorStats() {
        const stats = {
            totalErrors: this.errorLog.length,
            errorCounts: Object.fromEntries(this.errorCounts),
            recentErrors: this.errorLog.slice(-10),
            severityBreakdown: {
                critical: 0,
                error: 0,
                warning: 0,
                info: 0
            }
        };

        this.errorLog.forEach(error => {
            stats.severityBreakdown[error.severity]++;
        });

        return stats;
    }

    /**
     * Clear error log
     */
    clearErrorLog() {
        this.errorLog = [];
        this.errorCounts.clear();
    }

    /**
     * Export error log for debugging
     * @returns {string} JSON string of error log
     */
    exportErrorLog() {
        return JSON.stringify({
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            errors: this.errorLog,
            stats: this.getErrorStats()
        }, null, 2);
    }
}

// Create global error handler instance
export const errorHandler = new ErrorHandler();

// Export for use in other modules
export default errorHandler;
