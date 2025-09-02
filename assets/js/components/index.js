// ===== COMPONENT ARCHITECTURE EXPORTS =====
// Central export file for all components

// Base Components
export { BaseComponent } from './BaseComponent.js';
export { Card } from './Card.js';
export { CardGrid } from './CardGrid.js';
export { Modal } from './Modal.js';
export { ComponentManager, componentManager } from './ComponentManager.js';

// Legacy CardRenderer (for backward compatibility)
export { CardRenderer } from './CardRenderer.js';

// Component Manager instance
export const cm = componentManager;

// Convenience functions for common component operations
export const Components = {
    /**
     * Create a card component
     * @param {Object} config - Card configuration
     * @returns {Card} Card instance
     */
    createCard(config = {}) {
        return componentManager.create('Card', config);
    },
    
    /**
     * Create a card grid component
     * @param {Object} config - Card grid configuration
     * @returns {CardGrid} Card grid instance
     */
    createCardGrid(config = {}) {
        return componentManager.create('CardGrid', config);
    },
    
    /**
     * Create a modal component
     * @param {Object} config - Modal configuration
     * @returns {Modal} Modal instance
     */
    createModal(config = {}) {
        return componentManager.create('Modal', config);
    },
    
    /**
     * Show an alert modal
     * @param {string} message - Alert message
     * @param {string} title - Alert title
     * @param {Object} options - Modal options
     * @returns {Promise} Promise that resolves when modal is closed
     */
    alert(message, title = 'Alert', options = {}) {
        return Modal.alert(message, title, options);
    },
    
    /**
     * Show a confirm modal
     * @param {string} message - Confirm message
     * @param {string} title - Confirm title
     * @param {Object} options - Modal options
     * @returns {Promise<boolean>} Promise that resolves to true if confirmed
     */
    confirm(message, title = 'Confirm', options = {}) {
        return Modal.confirm(message, title, options);
    },
    
    /**
     * Show a prompt modal
     * @param {string} message - Prompt message
     * @param {string} defaultValue - Default input value
     * @param {string} title - Prompt title
     * @param {Object} options - Modal options
     * @returns {Promise<string|null>} Promise that resolves to input value or null if cancelled
     */
    prompt(message, defaultValue = '', title = 'Input', options = {}) {
        return Modal.prompt(message, defaultValue, title, options);
    }
};

// Component registration helper
export const registerComponents = () => {
    // Import components to ensure they're available
    import('./Card.js').then(({ Card }) => {
        componentManager.register('Card', Card, {
            type: 'default',
            selectable: false,
            disabled: false
        });
    });
    
    import('./CardGrid.js').then(({ CardGrid }) => {
        componentManager.register('CardGrid', CardGrid, {
            layout: 'grid',
            columns: 3,
            selectable: false,
            multiSelect: false
        });
    });
    
    import('./Modal.js').then(({ Modal }) => {
        componentManager.register('Modal', Modal, {
            size: 'medium',
            closable: true,
            backdrop: true,
            animation: true
        });
    });
    
    };

// Auto-register components when this module is imported
if (typeof window !== 'undefined') {
    // Register components after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', registerComponents);
    } else {
        registerComponents();
    }
}

export default Components;
