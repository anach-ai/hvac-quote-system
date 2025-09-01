// ===== EVENT MANAGER UTILITY =====
// Centralized event listener management to prevent memory leaks

export class EventManager {
    constructor() {
        this.eventListeners = new Map();
        this.delegatedEvents = new Map();
        this.temporaryListeners = new Set();
        this.isDestroyed = false;
    }

    /**
     * Add an event listener with automatic cleanup tracking
     * @param {Element} element - The element to attach the listener to
     * @param {string} eventType - The event type (e.g., 'click', 'change')
     * @param {Function} handler - The event handler function
     * @param {Object} options - Event listener options
     * @param {string} context - Context identifier for grouping listeners
     * @returns {Function} - Cleanup function to remove this specific listener
     */
    addListener(element, eventType, handler, options = {}, context = 'default') {
        if (this.isDestroyed) {
            console.warn('EventManager is destroyed, cannot add listener');
            return () => {};
        }

        const listenerId = this.generateListenerId();
        const wrappedHandler = this.wrapHandler(handler, listenerId);
        
        // Store listener information
        const listenerInfo = {
            element,
            eventType,
            handler: wrappedHandler,
            originalHandler: handler,
            options,
            context,
            listenerId,
            addedAt: Date.now()
        };

        // Add to tracking
        if (!this.eventListeners.has(context)) {
            this.eventListeners.set(context, new Map());
        }
        this.eventListeners.get(context).set(listenerId, listenerInfo);

        // Attach the listener
        element.addEventListener(eventType, wrappedHandler, options);

        // Return cleanup function
        return () => this.removeListener(listenerId, context);
    }

    /**
     * Add event delegation for dynamic content
     * @param {Element} container - The container element for delegation
     * @param {string} selector - CSS selector for target elements
     * @param {string} eventType - The event type
     * @param {Function} handler - The event handler function
     * @param {Object} options - Event listener options
     * @param {string} context - Context identifier
     * @returns {Function} - Cleanup function
     */
    addDelegatedListener(container, selector, eventType, handler, options = {}, context = 'delegated') {
        if (this.isDestroyed) {
            console.warn('EventManager is destroyed, cannot add delegated listener');
            return () => {};
        }

        const listenerId = this.generateListenerId();
        const wrappedHandler = (event) => {
            const target = event.target.closest(selector);
            if (target && container.contains(target)) {
                handler.call(target, event, target);
            }
        };

        const listenerInfo = {
            element: container,
            eventType,
            handler: wrappedHandler,
            originalHandler: handler,
            selector,
            options,
            context,
            listenerId,
            addedAt: Date.now(),
            isDelegated: true
        };

        // Add to delegated events tracking
        if (!this.delegatedEvents.has(context)) {
            this.delegatedEvents.set(context, new Map());
        }
        this.delegatedEvents.get(context).set(listenerId, listenerInfo);

        // Attach the listener
        container.addEventListener(eventType, wrappedHandler, options);

        // Return cleanup function
        return () => this.removeDelegatedListener(listenerId, context);
    }

    /**
     * Add a temporary listener that auto-removes after first execution
     * @param {Element} element - The element to attach the listener to
     * @param {string} eventType - The event type
     * @param {Function} handler - The event handler function
     * @param {Object} options - Event listener options
     * @returns {Function} - Cleanup function
     */
    addTemporaryListener(element, eventType, handler, options = {}) {
        const wrappedHandler = (event) => {
            handler(event);
            this.removeTemporaryListener(element, eventType, wrappedHandler);
        };

        this.temporaryListeners.add(wrappedHandler);
        element.addEventListener(eventType, wrappedHandler, options);

        return () => this.removeTemporaryListener(element, eventType, wrappedHandler);
    }

    /**
     * Remove a specific listener
     * @param {string} listenerId - The listener ID
     * @param {string} context - The context
     */
    removeListener(listenerId, context = 'default') {
        const contextListeners = this.eventListeners.get(context);
        if (!contextListeners) return;

        const listenerInfo = contextListeners.get(listenerId);
        if (!listenerInfo) return;

        const { element, eventType, handler } = listenerInfo;
        element.removeEventListener(eventType, handler);
        contextListeners.delete(listenerId);

        // Clean up empty contexts
        if (contextListeners.size === 0) {
            this.eventListeners.delete(context);
        }
    }

    /**
     * Remove a delegated listener
     * @param {string} listenerId - The listener ID
     * @param {string} context - The context
     */
    removeDelegatedListener(listenerId, context = 'delegated') {
        const contextListeners = this.delegatedEvents.get(context);
        if (!contextListeners) return;

        const listenerInfo = contextListeners.get(listenerId);
        if (!listenerInfo) return;

        const { element, eventType, handler } = listenerInfo;
        element.removeEventListener(eventType, handler);
        contextListeners.delete(listenerId);

        // Clean up empty contexts
        if (contextListeners.size === 0) {
            this.delegatedEvents.delete(context);
        }
    }

    /**
     * Remove a temporary listener
     * @param {Element} element - The element
     * @param {string} eventType - The event type
     * @param {Function} handler - The handler function
     */
    removeTemporaryListener(element, eventType, handler) {
        element.removeEventListener(eventType, handler);
        this.temporaryListeners.delete(handler);
    }

    /**
     * Remove all listeners for a specific context
     * @param {string} context - The context to clean up
     */
    removeContext(context) {
        // Remove regular listeners
        const contextListeners = this.eventListeners.get(context);
        if (contextListeners) {
            contextListeners.forEach((listenerInfo) => {
                const { element, eventType, handler } = listenerInfo;
                element.removeEventListener(eventType, handler);
            });
            this.eventListeners.delete(context);
        }

        // Remove delegated listeners
        const contextDelegated = this.delegatedEvents.get(context);
        if (contextDelegated) {
            contextDelegated.forEach((listenerInfo) => {
                const { element, eventType, handler } = listenerInfo;
                element.removeEventListener(eventType, handler);
            });
            this.delegatedEvents.delete(context);
        }
    }

    /**
     * Remove all listeners for a specific element
     * @param {Element} element - The element to clean up
     */
    removeElementListeners(element) {
        // Remove from regular listeners
        this.eventListeners.forEach((contextListeners) => {
            contextListeners.forEach((listenerInfo, listenerId) => {
                if (listenerInfo.element === element) {
                    const { eventType, handler } = listenerInfo;
                    element.removeEventListener(eventType, handler);
                    contextListeners.delete(listenerId);
                }
            });
        });

        // Remove from delegated listeners
        this.delegatedEvents.forEach((contextListeners) => {
            contextListeners.forEach((listenerInfo, listenerId) => {
                if (listenerInfo.element === element) {
                    const { eventType, handler } = listenerInfo;
                    element.removeEventListener(eventType, handler);
                    contextListeners.delete(listenerId);
                }
            });
        });

        // Clean up empty contexts
        this.cleanupEmptyContexts();
    }

    /**
     * Clean up all event listeners
     */
    destroy() {
        if (this.isDestroyed) return;

        // Remove all regular listeners
        this.eventListeners.forEach((contextListeners) => {
            contextListeners.forEach((listenerInfo) => {
                const { element, eventType, handler } = listenerInfo;
                element.removeEventListener(eventType, handler);
            });
        });

        // Remove all delegated listeners
        this.delegatedEvents.forEach((contextListeners) => {
            contextListeners.forEach((listenerInfo) => {
                const { element, eventType, handler } = listenerInfo;
                element.removeEventListener(eventType, handler);
            });
        });

        // Remove all temporary listeners
        this.temporaryListeners.forEach((handler) => {
            // Note: We can't easily remove temporary listeners without tracking their elements
            // This is a limitation of the current implementation
        });

        // Clear all tracking
        this.eventListeners.clear();
        this.delegatedEvents.clear();
        this.temporaryListeners.clear();
        this.isDestroyed = true;
    }

    /**
     * Get statistics about event listeners
     * @returns {Object} - Statistics object
     */
    getStats() {
        const stats = {
            totalListeners: 0,
            totalDelegated: 0,
            totalTemporary: this.temporaryListeners.size,
            contexts: {},
            delegatedContexts: {},
            isDestroyed: this.isDestroyed
        };

        // Count regular listeners
        this.eventListeners.forEach((contextListeners, context) => {
            stats.contexts[context] = contextListeners.size;
            stats.totalListeners += contextListeners.size;
        });

        // Count delegated listeners
        this.delegatedEvents.forEach((contextListeners, context) => {
            stats.delegatedContexts[context] = contextListeners.size;
            stats.totalDelegated += contextListeners.size;
        });

        return stats;
    }

    /**
     * Generate a unique listener ID
     * @returns {string} - Unique ID
     */
    generateListenerId() {
        return `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Wrap handler to add error handling and logging
     * @param {Function} handler - The original handler
     * @param {string} listenerId - The listener ID
     * @returns {Function} - Wrapped handler
     */
    wrapHandler(handler, listenerId) {
        return (event) => {
            try {
                return handler.call(event.target, event);
            } catch (error) {
                console.error(`Error in event listener ${listenerId}:`, error);
                // Optionally report to error tracking service
                if (window.errorHandler) {
                    window.errorHandler.handleError(error, {
                        context: 'EventManager',
                        listenerId,
                        eventType: event.type,
                        target: event.target
                    });
                }
            }
        };
    }

    /**
     * Clean up empty contexts
     */
    cleanupEmptyContexts() {
        // Clean up empty regular contexts
        this.eventListeners.forEach((contextListeners, context) => {
            if (contextListeners.size === 0) {
                this.eventListeners.delete(context);
            }
        });

        // Clean up empty delegated contexts
        this.delegatedEvents.forEach((contextListeners, context) => {
            if (contextListeners.size === 0) {
                this.delegatedEvents.delete(context);
            }
        });
    }

    /**
     * Check if a listener exists
     * @param {string} listenerId - The listener ID
     * @param {string} context - The context
     * @returns {boolean} - Whether the listener exists
     */
    hasListener(listenerId, context = 'default') {
        const contextListeners = this.eventListeners.get(context);
        return contextListeners ? contextListeners.has(listenerId) : false;
    }

    /**
     * Check if a delegated listener exists
     * @param {string} listenerId - The listener ID
     * @param {string} context - The context
     * @returns {boolean} - Whether the delegated listener exists
     */
    hasDelegatedListener(listenerId, context = 'delegated') {
        const contextListeners = this.delegatedEvents.get(context);
        return contextListeners ? contextListeners.has(listenerId) : false;
    }
}

// Create a global instance
export const eventManager = new EventManager();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        eventManager.destroy();
    });
}

export default eventManager;
