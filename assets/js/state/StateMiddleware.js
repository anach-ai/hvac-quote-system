// ===== STATE MIDDLEWARE =====

import { errorHandler } from '../utils/ErrorHandler.js';
import { StorageUtils } from '../utils/Storage.js';

/**
 * State Middleware - Additional middleware functions for state management
 */

/**
 * Storage Middleware - Automatically save state to localStorage
 */
export function createStorageMiddleware(storageKey = 'quote-state', options = {}) {
    const {
        debounceMs = 1000,
        includeKeys = null, // null means save all
        excludeKeys = ['history', 'historyIndex', 'isLoading', 'error', 'notification', 'modals'],
        compress = false
    } = options;
    
    let saveTimeout = null;
    const storage = new StorageUtils();
    
    return (store, action, next) => {
        const result = next(action);
        
        // Clear existing timeout
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
        
        // Debounce save operation
        saveTimeout = setTimeout(() => {
            try {
                const state = store.getState();
                let stateToSave = state;
                
                // Filter state if includeKeys is specified
                if (includeKeys) {
                    stateToSave = {};
                    includeKeys.forEach(key => {
                        if (state.hasOwnProperty(key)) {
                            stateToSave[key] = state[key];
                        }
                    });
                }
                
                // Remove excluded keys
                excludeKeys.forEach(key => {
                    if (stateToSave.hasOwnProperty(key)) {
                        delete stateToSave[key];
                    }
                });
                
                // Save to storage
                storage.save(stateToSave, storageKey);
                
            } catch (error) {
                errorHandler.handleError(error, {
                    context: 'StorageMiddleware',
                    action: action.type
                });
            }
        }, debounceMs);
        
        return result;
    };
}

/**
 * Analytics Middleware - Track state changes for analytics
 */
export function createAnalyticsMiddleware(analyticsConfig = {}) {
    const {
        trackActions = true,
        trackStateChanges = false,
        trackPerformance = true,
        customEvents = {},
        excludeActions = ['SET_LOADING_STATE', 'HIDE_NOTIFICATION']
    } = analyticsConfig;
    
    return (store, action, next) => {
        const startTime = performance.now();
        
        // Track action before execution
        if (trackActions && !excludeActions.includes(action.type)) {
            try {
                // Simulate analytics tracking
                console.log('Analytics: Action tracked', {
                    action: action.type,
                    timestamp: new Date().toISOString(),
                    payload: action.payload
                });
                
                // Custom event handling
                if (customEvents[action.type]) {
                    customEvents[action.type](action, store.getState());
                }
            } catch (error) {
                errorHandler.handleError(error, {
                    context: 'AnalyticsMiddleware',
                    action: action.type
                });
            }
        }
        
        const result = next(action);
        const endTime = performance.now();
        
        // Track performance
        if (trackPerformance) {
            const duration = endTime - startTime;
            if (duration > 16) { // Log slow actions (>16ms)
                console.warn('Slow action detected:', {
                    action: action.type,
                    duration: `${duration.toFixed(2)}ms`
                });
            }
        }
        
        // Track state changes
        if (trackStateChanges) {
            const newState = store.getState();
            console.log('State changed:', {
                action: action.type,
                stateKeys: Object.keys(newState).length
            });
        }
        
        return result;
    };
}

/**
 * Validation Middleware - Validate state changes
 */
export function createValidationMiddleware(validationRules = {}) {
    return (store, action, next) => {
        const currentState = store.getState();
        
        // Pre-action validation
        if (validationRules.preAction) {
            const preValidation = validationRules.preAction(action, currentState);
            if (!preValidation.isValid) {
                throw new Error(`Pre-action validation failed: ${preValidation.error}`);
            }
        }
        
        const result = next(action);
        const newState = store.getState();
        
        // Post-action validation
        if (validationRules.postAction) {
            const postValidation = validationRules.postAction(action, newState, currentState);
            if (!postValidation.isValid) {
                // Revert state if validation fails
                store.dispatch({ type: 'REVERT_STATE', payload: { previousState: currentState } });
                throw new Error(`Post-action validation failed: ${postValidation.error}`);
            }
        }
        
        return result;
    };
}

/**
 * Throttle Middleware - Throttle specific actions
 */
export function createThrottleMiddleware(throttleConfig = {}) {
    const actionTimestamps = new Map();
    
    return (store, action, next) => {
        const { actionType, throttleMs } = throttleConfig[action.type] || {};
        
        if (throttleMs) {
            const lastTimestamp = actionTimestamps.get(action.type) || 0;
            const now = Date.now();
            
            if (now - lastTimestamp < throttleMs) {
                console.warn(`Action ${action.type} throttled`);
                return store.getState(); // Return current state without executing action
            }
            
            actionTimestamps.set(action.type, now);
        }
        
        return next(action);
    };
}

/**
 * Retry Middleware - Retry failed actions
 */
export function createRetryMiddleware(retryConfig = {}) {
    const {
        maxRetries = 3,
        retryDelay = 1000,
        retryableActions = ['LOAD_DATA', 'SAVE_TO_STORAGE'],
        shouldRetry = (error, action) => true
    } = retryConfig;
    
    return (store, action, next) => {
        if (!retryableActions.includes(action.type)) {
            return next(action);
        }
        
        let retryCount = 0;
        
        const attemptAction = async () => {
            try {
                return next(action);
            } catch (error) {
                retryCount++;
                
                if (retryCount <= maxRetries && shouldRetry(error, action)) {
                    console.log(`Retrying action ${action.type} (attempt ${retryCount}/${maxRetries})`);
                    
                    await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
                    return attemptAction();
                }
                
                throw error;
            }
        };
        
        return attemptAction();
    };
}

/**
 * Cache Middleware - Cache action results
 */
export function createCacheMiddleware(cacheConfig = {}) {
    const {
        cacheDuration = 5 * 60 * 1000, // 5 minutes
        cacheableActions = ['LOAD_DATA'],
        cacheKey = (action) => `${action.type}_${JSON.stringify(action.payload)}`
    } = cacheConfig;
    
    const cache = new Map();
    
    return (store, action, next) => {
        if (!cacheableActions.includes(action.type)) {
            return next(action);
        }
        
        const key = cacheKey(action);
        const cached = cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < cacheDuration) {
            console.log(`Using cached result for action ${action.type}`);
            return cached.result;
        }
        
        const result = next(action);
        
        cache.set(key, {
            result,
            timestamp: Date.now()
        });
        
        return result;
    };
}

/**
 * Debug Middleware - Enhanced debugging
 */
export function createDebugMiddleware(debugConfig = {}) {
    const {
        logActions = true,
        logStateChanges = false,
        logPerformance = true,
        logStackTraces = false,
        groupActions = true
    } = debugConfig;
    
    return (store, action, next) => {
        const startTime = performance.now();
        
        if (logActions) {
            if (groupActions) {
                console.group(`Action: ${action.type}`);
            } else {
                console.log(`Action: ${action.type}`);
            }
            
            console.log('Payload:', action.payload);
            console.log('Timestamp:', new Date().toISOString());
            
            if (logStackTraces) {
                console.trace('Action stack trace');
            }
        }
        
        const result = next(action);
        const endTime = performance.now();
        
        if (logPerformance) {
            const duration = endTime - startTime;
            console.log(`Duration: ${duration.toFixed(2)}ms`);
        }
        
        if (logStateChanges) {
            const newState = store.getState();
            console.log('New state keys:', Object.keys(newState));
        }
        
        if (logActions && groupActions) {
            console.groupEnd();
        }
        
        return result;
    };
}

/**
 * Sync Middleware - Synchronize state across tabs/windows
 */
export function createSyncMiddleware(syncConfig = {}) {
    const {
        channel = 'quote-state-sync',
        includeKeys = null,
        excludeKeys = ['history', 'historyIndex', 'isLoading', 'error', 'notification', 'modals']
    } = syncConfig;
    
    let broadcastChannel = null;
    
    try {
        broadcastChannel = new BroadcastChannel(channel);
    } catch (error) {
        console.warn('BroadcastChannel not supported, sync disabled');
    }
    
    if (broadcastChannel) {
        broadcastChannel.onmessage = (event) => {
            if (event.data.type === 'STATE_UPDATE') {
                // Handle incoming state updates
                console.log('Received state update from another tab');
            }
        };
    }
    
    return (store, action, next) => {
        const result = next(action);
        
        // Broadcast state changes to other tabs
        if (broadcastChannel) {
            try {
                const state = store.getState();
                let stateToSync = state;
                
                if (includeKeys) {
                    stateToSync = {};
                    includeKeys.forEach(key => {
                        if (state.hasOwnProperty(key)) {
                            stateToSync[key] = state[key];
                        }
                    });
                }
                
                excludeKeys.forEach(key => {
                    if (stateToSync.hasOwnProperty(key)) {
                        delete stateToSync[key];
                    }
                });
                
                broadcastChannel.postMessage({
                    type: 'STATE_UPDATE',
                    action: action.type,
                    state: stateToSync,
                    timestamp: Date.now()
                });
            } catch (error) {
                errorHandler.handleError(error, {
                    context: 'SyncMiddleware',
                    action: action.type
                });
            }
        }
        
        return result;
    };
}

/**
 * Performance Middleware - Monitor performance metrics
 */
export function createPerformanceMiddleware(perfConfig = {}) {
    const {
        trackMetrics = true,
        alertThreshold = 100, // ms
        metricsHistory = []
    } = perfConfig;
    
    return (store, action, next) => {
        const startTime = performance.now();
        const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
        
        const result = next(action);
        
        const endTime = performance.now();
        const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
        
        if (trackMetrics) {
            const duration = endTime - startTime;
            const memoryDelta = endMemory - startMemory;
            
            const metric = {
                action: action.type,
                duration,
                memoryDelta,
                timestamp: Date.now(),
                stateSize: JSON.stringify(store.getState()).length
            };
            
            metricsHistory.push(metric);
            
            // Keep only last 100 metrics
            if (metricsHistory.length > 100) {
                metricsHistory.shift();
            }
            
            if (duration > alertThreshold) {
                console.warn('Performance alert:', metric);
            }
        }
        
        return result;
    };
}

/**
 * Error Recovery Middleware - Handle errors gracefully
 */
export function createErrorRecoveryMiddleware(recoveryConfig = {}) {
    const {
        maxErrors = 10,
        errorWindow = 60000, // 1 minute
        recoveryStrategies = {}
    } = recoveryConfig;
    
    const errorHistory = [];
    
    return (store, action, next) => {
        try {
            return next(action);
        } catch (error) {
            const now = Date.now();
            
            // Clean old errors
            const recentErrors = errorHistory.filter(
                err => now - err.timestamp < errorWindow
            );
            
            errorHistory.length = 0;
            errorHistory.push(...recentErrors);
            
            // Add current error
            errorHistory.push({
                action: action.type,
                error: error.message,
                timestamp: now
            });
            
            // Check if too many errors
            if (errorHistory.length > maxErrors) {
                console.error('Too many errors, triggering recovery');
                
                // Execute recovery strategy
                const strategy = recoveryStrategies[action.type] || recoveryStrategies.default;
                if (strategy) {
                    try {
                        strategy(store, action, error);
                    } catch (recoveryError) {
                        console.error('Recovery strategy failed:', recoveryError);
                    }
                }
            }
            
            throw error;
        }
    };
}

/**
 * Batch Middleware - Batch multiple actions
 */
export function createBatchMiddleware(batchConfig = {}) {
    const {
        batchDelay = 16, // ms
        batchableActions = ['SELECT_FEATURE', 'DESELECT_FEATURE', 'TOGGLE_FEATURE']
    } = batchConfig;
    
    let batchTimeout = null;
    let batchedActions = [];
    
    return (store, action, next) => {
        if (!batchableActions.includes(action.type)) {
            return next(action);
        }
        
        batchedActions.push(action);
        
        if (batchTimeout) {
            clearTimeout(batchTimeout);
        }
        
        return new Promise((resolve) => {
            batchTimeout = setTimeout(() => {
                const actions = [...batchedActions];
                batchedActions = [];
                
                // Execute batched actions
                actions.forEach(action => {
                    next(action);
                });
                
                resolve(store.getState());
            }, batchDelay);
        });
    };
}

/**
 * Compose multiple middleware functions
 */
export function composeMiddleware(...middlewares) {
    return (store, action, next) => {
        let index = 0;
        
        function executeMiddleware(action) {
            if (index >= middlewares.length) {
                return next(action);
            }
            
            const middleware = middlewares[index++];
            return middleware(store, action, executeMiddleware);
        }
        
        return executeMiddleware(action);
    };
}

/**
 * Default middleware configuration
 */
export const defaultMiddlewareConfig = {
    storage: {
        debounceMs: 1000,
        excludeKeys: ['history', 'historyIndex', 'isLoading', 'error', 'notification', 'modals']
    },
    analytics: {
        trackActions: true,
        trackPerformance: true,
        excludeActions: ['SET_LOADING_STATE', 'HIDE_NOTIFICATION']
    },
    validation: {
        preAction: null,
        postAction: null
    },
    throttle: {
        'CALCULATE_PRICE': { throttleMs: 500 },
        'UPDATE_TOTAL_PRICE': { throttleMs: 100 }
    },
    retry: {
        maxRetries: 3,
        retryDelay: 1000,
        retryableActions: ['LOAD_DATA', 'SAVE_TO_STORAGE']
    },
    cache: {
        cacheDuration: 5 * 60 * 1000,
        cacheableActions: ['LOAD_DATA']
    },
    debug: {
        logActions: true,
        logPerformance: true,
        groupActions: true
    },
    sync: {
        channel: 'quote-state-sync',
        excludeKeys: ['history', 'historyIndex', 'isLoading', 'error', 'notification', 'modals']
    },
    performance: {
        trackMetrics: true,
        alertThreshold: 100
    },
    errorRecovery: {
        maxErrors: 10,
        errorWindow: 60000
    },
    batch: {
        batchDelay: 16,
        batchableActions: ['SELECT_FEATURE', 'DESELECT_FEATURE', 'TOGGLE_FEATURE']
    }
};

export default {
    createStorageMiddleware,
    createAnalyticsMiddleware,
    createValidationMiddleware,
    createThrottleMiddleware,
    createRetryMiddleware,
    createCacheMiddleware,
    createDebugMiddleware,
    createSyncMiddleware,
    createPerformanceMiddleware,
    createErrorRecoveryMiddleware,
    createBatchMiddleware,
    composeMiddleware,
    defaultMiddlewareConfig
};
