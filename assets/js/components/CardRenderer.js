// Card Renderer component for safe DOM manipulation
import { ValidationUtils } from '../utils/Validation.js';
import { eventManager } from '../utils/EventManager.js';

export class CardRenderer {
    constructor() {
        this.templates = this.createTemplates();
        this.cleanupFunctions = new Map();
    }
    
    createTemplates() {
        return {
            package: (data) => `
                <div class="package-card" data-package-id="${ValidationUtils.sanitizeString(data.id)}">
                    <div class="package-header">
                        <div class="package-name">${ValidationUtils.sanitizeString(data.name)}</div>
                        <div class="package-price">$${data.price}</div>
                        ${data.originalPrice ? `<div class="package-original-price">$${data.originalPrice}</div>` : ''}
                        <div class="package-timeline">${ValidationUtils.sanitizeString(data.timeline)}</div>
                    </div>
                    <div class="package-description">${ValidationUtils.sanitizeString(data.description)}</div>
                    
                    <div class="included-components-section">
                        <h4 class="included-title">
                            <i data-lucide="check-circle"></i>
                            Included Components (${data.includedComponents?.length || 0})
                        </h4>
                        <ul class="package-components">
                            ${(data.includedComponents || []).map(component => `
                                <li class="component-included">
                                    <i data-lucide="check"></i>
                                    ${ValidationUtils.sanitizeString(component)}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="package-action">
                        <button class="select-package-btn" disabled>
                            <i data-lucide="check"></i>
                            Package Selected
                        </button>
                    </div>
                </div>
            `,
            
            feature: (data) => `
                <div class="feature-card" data-feature-id="${ValidationUtils.sanitizeString(data.id)}" data-card-type="feature">
                    <div class="feature-header">
                        <h4>${ValidationUtils.sanitizeString(data.name)}</h4>
                        <span class="feature-price">$${data.price}</span>
                    </div>
                    <p>${ValidationUtils.sanitizeString(data.description)}</p>
                    ${data.brands ? `
                        <div class="feature-brands">
                            ${data.brands.map(brand => `
                                <span class="brand-tag">${ValidationUtils.sanitizeString(brand)}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `,
            
            addon: (data) => `
                <div class="addon-card" data-addon-id="${ValidationUtils.sanitizeString(data.id)}" data-card-type="addon">
                    <div class="addon-header">
                        <h4>${ValidationUtils.sanitizeString(data.name)}</h4>
                        <span class="addon-price">$${data.price}</span>
                    </div>
                    <p>${ValidationUtils.sanitizeString(data.description)}</p>
                </div>
            `,
            
            component: (data) => `
                <div class="component-card" data-component-id="${ValidationUtils.sanitizeString(data.id)}" data-card-type="component">
                    <div class="component-header">
                        <h4>${ValidationUtils.sanitizeString(data.name)}</h4>
                        <span class="component-price">$${data.price}</span>
                    </div>
                    <p>${ValidationUtils.sanitizeString(data.description)}</p>
                </div>
            `,
            
            emergency: (data) => `
                <div class="emergency-card ${data.popular ? 'featured' : ''}" data-emergency-id="${ValidationUtils.sanitizeString(data.id)}" data-card-type="emergency">
                    <div class="emergency-header">
                        <i data-lucide="clock"></i>
                        <h4>${ValidationUtils.sanitizeString(data.name)}</h4>
                        <span class="emergency-price">$${data.price}</span>
                    </div>
                    <p>${ValidationUtils.sanitizeString(data.description)}</p>
                    <div class="emergency-features">
                        ${(data.features || []).map(feature => `
                            <span class="feature-tag">${ValidationUtils.sanitizeString(feature)}</span>
                        `).join('')}
                    </div>
                </div>
            `,
            
            serviceArea: (data) => `
                <div class="area-card" data-area-id="${ValidationUtils.sanitizeString(data.id)}" data-card-type="serviceArea">
                    <div class="area-header">
                        <h3>${ValidationUtils.sanitizeString(data.name)}</h3>
                        <span class="area-radius">${ValidationUtils.sanitizeString(data.radius)}</span>
                    </div>
                    <div class="area-details">
                        ${(data.details || []).map(detail => `
                            <p>${ValidationUtils.sanitizeString(detail)}</p>
                        `).join('')}
                    </div>
                    <div class="area-price">${ValidationUtils.sanitizeString(data.price)}</div>
                </div>
            `,
            
            contact: (data) => `
                <div class="contact-feature-card" data-feature-id="${ValidationUtils.sanitizeString(data.id)}" data-card-type="contact">
                    <div class="contact-feature-header">
                        <i data-lucide="${data.icon || 'phone'}"></i>
                        <h4>${ValidationUtils.sanitizeString(data.name)}</h4>
                        <span class="contact-feature-price">$${data.price}</span>
                    </div>
                    <p>${ValidationUtils.sanitizeString(data.description)}</p>
                </div>
            `
        };
    }
    
    // Render a card safely
    renderCard(type, data, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return false;
        }
        
        const template = this.templates[type];
        if (!template) {
            console.error(`Template for type ${type} not found`);
            return false;
        }
        
        try {
            // Clean up existing listeners for this container
            this.cleanupContainerListeners(containerId);
            
            const html = template(data);
            container.innerHTML = html;
            
            // Initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            return true;
        } catch (error) {
            console.error(`Error rendering ${type} card:`, error);
            return false;
        }
    }
    
    // Render multiple cards
    renderCards(type, dataArray, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return false;
        }
        
        const template = this.templates[type];
        if (!template) {
            console.error(`Template for type ${type} not found`);
            return false;
        }
        
        try {
            // Clean up existing listeners for this container
            this.cleanupContainerListeners(containerId);
            
            const html = dataArray.map(data => template(data)).join('');
            container.innerHTML = html;
            
            // Initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            return true;
        } catch (error) {
            console.error(`Error rendering ${type} cards:`, error);
            return false;
        }
    }
    
    // Create a card element safely
    createCardElement(type, data) {
        const template = this.templates[type];
        if (!template) {
            console.error(`Template for type ${type} not found`);
            return null;
        }
        
        try {
            const html = template(data);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            return tempDiv.firstElementChild;
        } catch (error) {
            console.error(`Error creating ${type} card element:`, error);
            return null;
        }
    }
    
    // Update card state
    updateCardState(cardElement, isSelected, isIncluded = false) {
        if (!cardElement) return;
        
        cardElement.classList.toggle('selected', isSelected);
        cardElement.classList.toggle('included-in-package', isIncluded);
        
        // Update ARIA attributes
        cardElement.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    }
    
    /**
     * Clean up event listeners for a specific container
     * @param {string} containerId - The container ID
     */
    cleanupContainerListeners(containerId) {
        const cleanupFn = this.cleanupFunctions.get(containerId);
        if (cleanupFn) {
            cleanupFn();
            this.cleanupFunctions.delete(containerId);
        }
    }
    
    /**
     * Add event delegation to a container
     * @param {string} containerId - The container ID
     * @param {string} selector - CSS selector for target elements
     * @param {string} eventType - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    addContainerDelegation(containerId, selector, eventType, handler, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Clean up existing delegation
        this.cleanupContainerListeners(containerId);
        
        // Add new delegation
        const cleanupFn = eventManager.addDelegatedListener(
            container, 
            selector, 
            eventType, 
            handler, 
            options, 
            `container_${containerId}`
        );
        
        this.cleanupFunctions.set(containerId, cleanupFn);
    }
    
    /**
     * Clean up all event listeners
     */
    destroy() {
        this.cleanupFunctions.forEach(cleanupFn => cleanupFn());
        this.cleanupFunctions.clear();
    }
}
