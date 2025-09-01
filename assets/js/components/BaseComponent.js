// ===== BASE COMPONENT CLASS =====
// Foundation for all UI components in the HVAC Quote System

import { eventManager } from '../utils/EventManager.js';
import { errorHandler } from '../utils/ErrorHandler.js';

export class BaseComponent {
    constructor(config = {}) {
        this.id = config.id || this.generateId();
        this.element = null;
        this.config = { ...this.getDefaultConfig(), ...config };
        this.state = this.getInitialState();
        this.eventListeners = new Map();
        this.children = new Map();
        this.isMounted = false;
        this.isDestroyed = false;
        
        // Bind methods to preserve context
        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
        this.destroy = this.destroy.bind(this);
        this.handleEvent = this.handleEvent.bind(this);
        
        // Initialize component
        this.init();
    }
    
    /**
     * Get default configuration
     * @returns {Object} Default configuration
     */
    getDefaultConfig() {
        return {
            container: null,
            template: null,
            events: {},
            styles: {},
            attributes: {},
            className: '',
            tagName: 'div'
        };
    }
    
    /**
     * Get initial state
     * @returns {Object} Initial state
     */
    getInitialState() {
        return {};
    }
    
    /**
     * Initialize component
     */
    init() {
        try {
            this.beforeInit();
            this.createElement();
            this.setupEventListeners();
            this.afterInit();
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'BaseComponent',
                componentId: this.id,
                method: 'init'
            });
        }
    }
    
    /**
     * Lifecycle hook - called before initialization
     */
    beforeInit() {
        // Override in subclasses
    }
    
    /**
     * Create the component element
     */
    createElement() {
        if (this.config.container) {
            this.element = this.config.container;
        } else {
            this.element = document.createElement(this.config.tagName);
            this.element.id = this.id;
            this.element.className = this.config.className;
            
            // Set attributes
            Object.entries(this.config.attributes).forEach(([key, value]) => {
                this.element.setAttribute(key, value);
            });
            
            // Set styles
            Object.entries(this.config.styles).forEach(([property, value]) => {
                this.element.style[property] = value;
            });
        }
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        Object.entries(this.config.events).forEach(([eventType, handler]) => {
            this.addEventListener(eventType, handler);
        });
    }
    
    /**
     * Lifecycle hook - called after initialization
     */
    afterInit() {
        // Override in subclasses
    }
    
    /**
     * Mount component to DOM
     * @param {Element} parent - Parent element to mount to
     */
    mount(parent) {
        if (this.isDestroyed) {
            console.warn(`Component ${this.id} is destroyed, cannot mount`);
            return;
        }
        
        try {
            this.beforeMount();
            
            if (parent && this.element && !this.isMounted) {
                parent.appendChild(this.element);
                this.isMounted = true;
            }
            
            this.afterMount();
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'BaseComponent',
                componentId: this.id,
                method: 'mount'
            });
        }
    }
    
    /**
     * Lifecycle hook - called before mounting
     */
    beforeMount() {
        // Override in subclasses
    }
    
    /**
     * Lifecycle hook - called after mounting
     */
    afterMount() {
        // Override in subclasses
    }
    
    /**
     * Render component content
     * @returns {string} HTML content
     */
    render() {
        if (this.config.template) {
            return this.config.template(this.state);
        }
        return '';
    }
    
    /**
     * Update component with new state
     * @param {Object} newState - New state to merge
     * @param {boolean} reRender - Whether to re-render the component
     */
    update(newState = {}, reRender = true) {
        if (this.isDestroyed) {
            console.warn(`Component ${this.id} is destroyed, cannot update`);
            return;
        }
        
        try {
            this.beforeUpdate(newState);
            
            // Merge new state
            this.state = { ...this.state, ...newState };
            
            if (reRender && this.element) {
                this.element.innerHTML = this.render();
                this.afterRender();
            }
            
            this.afterUpdate(newState);
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'BaseComponent',
                componentId: this.id,
                method: 'update',
                newState
            });
        }
    }
    
    /**
     * Lifecycle hook - called before update
     * @param {Object} newState - New state being applied
     */
    beforeUpdate(newState) {
        // Override in subclasses
    }
    
    /**
     * Lifecycle hook - called after update
     * @param {Object} newState - New state that was applied
     */
    afterUpdate(newState) {
        // Override in subclasses
    }
    
    /**
     * Lifecycle hook - called after render
     */
    afterRender() {
        // Override in subclasses
    }
    
    /**
     * Add event listener
     * @param {string} eventType - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    addEventListener(eventType, handler, options = {}) {
        if (!this.element) return;
        
        const wrappedHandler = (event) => this.handleEvent(event, handler);
        const cleanup = eventManager.addListener(
            this.element,
            eventType,
            wrappedHandler,
            options,
            `component_${this.id}`
        );
        
        this.eventListeners.set(`${eventType}_${handler.name || 'anonymous'}`, cleanup);
    }
    
    /**
     * Remove event listener
     * @param {string} eventType - Event type
     * @param {Function} handler - Event handler
     */
    removeEventListener(eventType, handler) {
        const key = `${eventType}_${handler.name || 'anonymous'}`;
        const cleanup = this.eventListeners.get(key);
        
        if (cleanup) {
            cleanup();
            this.eventListeners.delete(key);
        }
    }
    
    /**
     * Handle component events
     * @param {Event} event - DOM event
     * @param {Function} handler - Event handler
     */
    handleEvent(event, handler) {
        try {
            handler.call(this, event, this.state);
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'BaseComponent',
                componentId: this.id,
                method: 'handleEvent',
                eventType: event.type
            });
        }
    }
    
    /**
     * Add child component
     * @param {string} key - Child key
     * @param {BaseComponent} child - Child component
     */
    addChild(key, child) {
        this.children.set(key, child);
        
        if (this.element && child.element) {
            this.element.appendChild(child.element);
        }
    }
    
    /**
     * Remove child component
     * @param {string} key - Child key
     */
    removeChild(key) {
        const child = this.children.get(key);
        if (child) {
            child.destroy();
            this.children.delete(key);
        }
    }
    
    /**
     * Get child component
     * @param {string} key - Child key
     * @returns {BaseComponent|null} Child component
     */
    getChild(key) {
        return this.children.get(key) || null;
    }
    
    /**
     * Show component
     */
    show() {
        if (this.element) {
            this.element.style.display = '';
            this.element.style.visibility = 'visible';
        }
    }
    
    /**
     * Hide component
     */
    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }
    
    /**
     * Toggle component visibility
     */
    toggle() {
        if (this.element) {
            const isVisible = this.element.style.display !== 'none';
            if (isVisible) {
                this.hide();
            } else {
                this.show();
            }
        }
    }
    
    /**
     * Add CSS class
     * @param {string} className - CSS class name
     */
    addClass(className) {
        if (this.element) {
            this.element.classList.add(className);
        }
    }
    
    /**
     * Remove CSS class
     * @param {string} className - CSS class name
     */
    removeClass(className) {
        if (this.element) {
            this.element.classList.remove(className);
        }
    }
    
    /**
     * Toggle CSS class
     * @param {string} className - CSS class name
     */
    toggleClass(className) {
        if (this.element) {
            this.element.classList.toggle(className);
        }
    }
    
    /**
     * Check if component has CSS class
     * @param {string} className - CSS class name
     * @returns {boolean} Whether component has the class
     */
    hasClass(className) {
        return this.element ? this.element.classList.contains(className) : false;
    }
    
    /**
     * Set component attribute
     * @param {string} name - Attribute name
     * @param {string} value - Attribute value
     */
    setAttribute(name, value) {
        if (this.element) {
            this.element.setAttribute(name, value);
        }
    }
    
    /**
     * Get component attribute
     * @param {string} name - Attribute name
     * @returns {string|null} Attribute value
     */
    getAttribute(name) {
        return this.element ? this.element.getAttribute(name) : null;
    }
    
    /**
     * Remove component attribute
     * @param {string} name - Attribute name
     */
    removeAttribute(name) {
        if (this.element) {
            this.element.removeAttribute(name);
        }
    }
    
    /**
     * Set component style
     * @param {string} property - CSS property
     * @param {string} value - CSS value
     */
    setStyle(property, value) {
        if (this.element) {
            this.element.style[property] = value;
        }
    }
    
    /**
     * Get component style
     * @param {string} property - CSS property
     * @returns {string} CSS value
     */
    getStyle(property) {
        return this.element ? this.element.style[property] : '';
    }
    
    /**
     * Destroy component and clean up resources
     */
    destroy() {
        if (this.isDestroyed) return;
        
        try {
            this.beforeDestroy();
            
            // Clean up event listeners
            this.eventListeners.forEach(cleanup => cleanup());
            this.eventListeners.clear();
            
            // Destroy children
            this.children.forEach(child => child.destroy());
            this.children.clear();
            
            // Remove from DOM
            if (this.element && this.element.parentElement) {
                this.element.parentElement.removeChild(this.element);
            }
            
            // Clear references
            this.element = null;
            this.isMounted = false;
            this.isDestroyed = true;
            
            this.afterDestroy();
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'BaseComponent',
                componentId: this.id,
                method: 'destroy'
            });
        }
    }
    
    /**
     * Lifecycle hook - called before destruction
     */
    beforeDestroy() {
        // Override in subclasses
    }
    
    /**
     * Lifecycle hook - called after destruction
     */
    afterDestroy() {
        // Override in subclasses
    }
    
    /**
     * Generate unique component ID
     * @returns {string} Unique ID
     */
    generateId() {
        return `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Get component statistics
     * @returns {Object} Component statistics
     */
    getStats() {
        return {
            id: this.id,
            isMounted: this.isMounted,
            isDestroyed: this.isDestroyed,
            eventListeners: this.eventListeners.size,
            children: this.children.size,
            stateKeys: Object.keys(this.state).length
        };
    }
    
    /**
     * Emit custom event
     * @param {string} eventName - Event name
     * @param {*} data - Event data
     */
    emit(eventName, data = null) {
        if (this.element) {
            const event = new CustomEvent(eventName, {
                detail: data,
                bubbles: true,
                cancelable: true
            });
            this.element.dispatchEvent(event);
        }
    }
    
    /**
     * Listen for custom events
     * @param {string} eventName - Event name
     * @param {Function} handler - Event handler
     */
    on(eventName, handler) {
        this.addEventListener(eventName, handler);
    }
    
    /**
     * Stop listening for custom events
     * @param {string} eventName - Event name
     * @param {Function} handler - Event handler
     */
    off(eventName, handler) {
        this.removeEventListener(eventName, handler);
    }
}
