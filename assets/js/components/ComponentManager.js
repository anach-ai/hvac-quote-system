// ===== COMPONENT MANAGER =====
// Centralized component registration and lifecycle management

import { errorHandler } from '../utils/ErrorHandler.js';

export class ComponentManager {
    constructor() {
        this.components = new Map();
        this.factories = new Map();
        this.instances = new Map();
        this.globalConfig = {};
        this.isDestroyed = false;
    }
    
    /**
     * Register a component class
     * @param {string} name - Component name
     * @param {Class} componentClass - Component class
     * @param {Object} defaultConfig - Default configuration
     */
    register(name, componentClass, defaultConfig = {}) {
        if (this.isDestroyed) {
            return;
        }
        
        try {
            this.components.set(name, {
                class: componentClass,
                defaultConfig,
                registeredAt: Date.now()
            });
            
            } catch (error) {
            errorHandler.handleError(error, {
                context: 'ComponentManager',
                method: 'register',
                componentName: name
            });
        }
    }
    
    /**
     * Register a component factory
     * @param {string} name - Factory name
     * @param {Function} factory - Factory function
     */
    registerFactory(name, factory) {
        if (this.isDestroyed) {
            return;
        }
        
        try {
            this.factories.set(name, {
                factory,
                registeredAt: Date.now()
            });
            
            } catch (error) {
            errorHandler.handleError(error, {
                context: 'ComponentManager',
                method: 'registerFactory',
                factoryName: name
            });
        }
    }
    
    /**
     * Create a component instance
     * @param {string} name - Component name
     * @param {Object} config - Component configuration
     * @returns {BaseComponent} Component instance
     */
    create(name, config = {}) {
        if (this.isDestroyed) {
            return null;
        }
        
        try {
            const componentInfo = this.components.get(name);
            if (!componentInfo) {
                throw new Error(`Component '${name}' not found`);
            }
            
            const { class: ComponentClass, defaultConfig } = componentInfo;
            
            // Merge configurations
            const mergedConfig = {
                ...this.globalConfig,
                ...defaultConfig,
                ...config
            };
            
            // Create instance
            const instance = new ComponentClass(mergedConfig);
            
            // Store instance
            const instanceId = instance.id;
            this.instances.set(instanceId, {
                name,
                instance,
                config: mergedConfig,
                createdAt: Date.now()
            });
            
            return instance;
            
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'ComponentManager',
                method: 'create',
                componentName: name,
                config
            });
            return null;
        }
    }
    
    /**
     * Create component using factory
     * @param {string} name - Factory name
     * @param {Object} config - Factory configuration
     * @returns {BaseComponent} Component instance
     */
    createWithFactory(name, config = {}) {
        if (this.isDestroyed) {
            return null;
        }
        
        try {
            const factoryInfo = this.factories.get(name);
            if (!factoryInfo) {
                throw new Error(`Factory '${name}' not found`);
            }
            
            const { factory } = factoryInfo;
            const instance = factory(config, this);
            
            if (instance && instance.id) {
                this.instances.set(instance.id, {
                    name: `factory_${name}`,
                    instance,
                    config,
                    createdAt: Date.now(),
                    isFactory: true
                });
            }
            
            return instance;
            
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'ComponentManager',
                method: 'createWithFactory',
                factoryName: name,
                config
            });
            return null;
        }
    }
    
    /**
     * Get component instance by ID
     * @param {string} id - Component instance ID
     * @returns {BaseComponent|null} Component instance
     */
    getInstance(id) {
        const instanceInfo = this.instances.get(id);
        return instanceInfo ? instanceInfo.instance : null;
    }
    
    /**
     * Get all instances of a component type
     * @param {string} name - Component name
     * @returns {Array} Array of component instances
     */
    getInstances(name) {
        const instances = [];
        this.instances.forEach((instanceInfo, id) => {
            if (instanceInfo.name === name) {
                instances.push(instanceInfo.instance);
            }
        });
        return instances;
    }
    
    /**
     * Destroy a component instance
     * @param {string} id - Component instance ID
     */
    destroyInstance(id) {
        const instanceInfo = this.instances.get(id);
        if (instanceInfo) {
            try {
                instanceInfo.instance.destroy();
                this.instances.delete(id);
                } catch (error) {
                errorHandler.handleError(error, {
                    context: 'ComponentManager',
                    method: 'destroyInstance',
                    instanceId: id
                });
            }
        }
    }
    
    /**
     * Destroy all instances of a component type
     * @param {string} name - Component name
     */
    destroyInstances(name) {
        const instancesToDestroy = [];
        
        this.instances.forEach((instanceInfo, id) => {
            if (instanceInfo.name === name) {
                instancesToDestroy.push(id);
            }
        });
        
        instancesToDestroy.forEach(id => {
            this.destroyInstance(id);
        });
    }
    
    /**
     * Destroy all component instances
     */
    destroyAllInstances() {
        const instanceIds = Array.from(this.instances.keys());
        instanceIds.forEach(id => {
            this.destroyInstance(id);
        });
    }
    
    /**
     * Set global configuration
     * @param {Object} config - Global configuration
     */
    setGlobalConfig(config) {
        this.globalConfig = { ...this.globalConfig, ...config };
    }
    
    /**
     * Get global configuration
     * @returns {Object} Global configuration
     */
    getGlobalConfig() {
        return { ...this.globalConfig };
    }
    
    /**
     * Check if component is registered
     * @param {string} name - Component name
     * @returns {boolean} Whether component is registered
     */
    isRegistered(name) {
        return this.components.has(name);
    }
    
    /**
     * Check if factory is registered
     * @param {string} name - Factory name
     * @returns {boolean} Whether factory is registered
     */
    isFactoryRegistered(name) {
        return this.factories.has(name);
    }
    
    /**
     * Get registered component names
     * @returns {Array} Array of component names
     */
    getRegisteredComponents() {
        return Array.from(this.components.keys());
    }
    
    /**
     * Get registered factory names
     * @returns {Array} Array of factory names
     */
    getRegisteredFactories() {
        return Array.from(this.factories.keys());
    }
    
    /**
     * Get component information
     * @param {string} name - Component name
     * @returns {Object|null} Component information
     */
    getComponentInfo(name) {
        const componentInfo = this.components.get(name);
        if (!componentInfo) return null;
        
        return {
            name,
            class: componentInfo.class,
            defaultConfig: componentInfo.defaultConfig,
            registeredAt: componentInfo.registeredAt,
            instanceCount: this.getInstances(name).length
        };
    }
    
    /**
     * Get instance information
     * @param {string} id - Instance ID
     * @returns {Object|null} Instance information
     */
    getInstanceInfo(id) {
        const instanceInfo = this.instances.get(id);
        if (!instanceInfo) return null;
        
        return {
            id,
            name: instanceInfo.name,
            config: instanceInfo.config,
            createdAt: instanceInfo.createdAt,
            isFactory: instanceInfo.isFactory || false,
            isMounted: instanceInfo.instance.isMounted,
            isDestroyed: instanceInfo.instance.isDestroyed
        };
    }
    
    /**
     * Get statistics
     * @returns {Object} Component manager statistics
     */
    getStats() {
        const stats = {
            registeredComponents: this.components.size,
            registeredFactories: this.factories.size,
            activeInstances: 0,
            destroyedInstances: 0,
            components: {},
            instances: {}
        };
        
        // Count instances by component
        this.instances.forEach((instanceInfo, id) => {
            const { name, instance } = instanceInfo;
            
            if (!stats.components[name]) {
                stats.components[name] = {
                    total: 0,
                    active: 0,
                    destroyed: 0
                };
            }
            
            stats.components[name].total++;
            
            if (instance.isDestroyed) {
                stats.components[name].destroyed++;
                stats.destroyedInstances++;
            } else {
                stats.components[name].active++;
                stats.activeInstances++;
            }
        });
        
        return stats;
    }
    
    /**
     * Clean up destroyed instances
     */
    cleanup() {
        const instancesToRemove = [];
        
        this.instances.forEach((instanceInfo, id) => {
            if (instanceInfo.instance.isDestroyed) {
                instancesToRemove.push(id);
            }
        });
        
        instancesToRemove.forEach(id => {
            this.instances.delete(id);
        });
        
        }
    
    /**
     * Destroy component manager
     */
    destroy() {
        if (this.isDestroyed) return;
        
        try {
            // Destroy all instances
            this.destroyAllInstances();
            
            // Clear registrations
            this.components.clear();
            this.factories.clear();
            this.instances.clear();
            
            this.isDestroyed = true;
            
            } catch (error) {
            errorHandler.handleError(error, {
                context: 'ComponentManager',
                method: 'destroy'
            });
        }
    }
    
    /**
     * Create component with validation
     * @param {string} name - Component name
     * @param {Object} config - Component configuration
     * @param {Object} validation - Validation rules
     * @returns {BaseComponent} Component instance
     */
    createWithValidation(name, config = {}, validation = {}) {
        // Validate configuration
        const validationErrors = this.validateConfig(config, validation);
        if (validationErrors.length > 0) {
            throw new Error(`Configuration validation failed: ${validationErrors.join(', ')}`);
        }
        
        return this.create(name, config);
    }
    
    /**
     * Validate configuration
     * @param {Object} config - Configuration to validate
     * @param {Object} validation - Validation rules
     * @returns {Array} Array of validation errors
     */
    validateConfig(config, validation) {
        const errors = [];
        
        Object.entries(validation).forEach(([key, rule]) => {
            const value = config[key];
            
            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(`${key} is required`);
            }
            
            if (value !== undefined && value !== null) {
                if (rule.type && typeof value !== rule.type) {
                    errors.push(`${key} must be of type ${rule.type}`);
                }
                
                if (rule.min !== undefined && value < rule.min) {
                    errors.push(`${key} must be at least ${rule.min}`);
                }
                
                if (rule.max !== undefined && value > rule.max) {
                    errors.push(`${key} must be at most ${rule.max}`);
                }
                
                if (rule.pattern && !rule.pattern.test(value)) {
                    errors.push(`${key} must match pattern ${rule.pattern}`);
                }
                
                if (rule.enum && !rule.enum.includes(value)) {
                    errors.push(`${key} must be one of: ${rule.enum.join(', ')}`);
                }
            }
        });
        
        return errors;
    }
}

// Create global instance
export const componentManager = new ComponentManager();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        componentManager.destroy();
    });
}

export default componentManager;
