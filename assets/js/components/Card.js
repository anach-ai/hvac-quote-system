// ===== CARD COMPONENT =====
// Reusable card component for displaying content

import { BaseComponent } from './BaseComponent.js';
import { ValidationUtils } from '../utils/Validation.js';

export class Card extends BaseComponent {
    constructor(config = {}) {
        super({
            tagName: 'div',
            className: 'card',
            ...config
        });
    }
    
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            type: 'default',
            selectable: false,
            selected: false,
            disabled: false,
            badge: null,
            icon: null,
            title: '',
            subtitle: '',
            description: '',
            price: null,
            originalPrice: null,
            features: [],
            actions: [],
            image: null,
            status: 'default', // default, selected, disabled, featured
            onClick: null,
            onSelect: null,
            onDeselect: null
        };
    }
    
    getInitialState() {
        return {
            selected: this.config.selected,
            disabled: this.config.disabled,
            hovered: false,
            focused: false
        };
    }
    
    beforeInit() {
        this.setupCardTemplate();
        this.setupEventHandlers();
    }
    
    setupCardTemplate() {
        this.config.template = (state) => this.renderCard(state);
    }
    
    setupEventHandlers() {
        this.config.events = {
            click: this.handleClick.bind(this),
            mouseenter: this.handleMouseEnter.bind(this),
            mouseleave: this.handleMouseLeave.bind(this),
            keydown: this.handleKeyDown.bind(this),
            focus: this.handleFocus.bind(this),
            blur: this.handleBlur.bind(this)
        };
    }
    
    afterInit() {
        this.updateCardClasses();
        this.setupAccessibility();
    }
    
    renderCard(state) {
        const {
            type,
            badge,
            icon,
            title,
            subtitle,
            description,
            price,
            originalPrice,
            features,
            actions,
            image,
            status
        } = this.config;
        
        const { selected, disabled, hovered, focused } = state;
        
        return `
            <div class="card-inner ${this.getCardClasses(state)}" 
                 role="button" 
                 tabindex="${disabled ? '-1' : '0'}"
                 aria-pressed="${selected ? 'true' : 'false'}"
                 aria-disabled="${disabled ? 'true' : 'false'}">
                
                ${this.renderBadge(badge)}
                ${this.renderImage(image)}
                
                <div class="card-content">
                    ${this.renderHeader(icon, title, subtitle)}
                    ${this.renderDescription(description)}
                    ${this.renderFeatures(features)}
                    ${this.renderPricing(price, originalPrice)}
                    ${this.renderActions(actions)}
                </div>
                
                ${this.renderStatusIndicator(status)}
            </div>
        `;
    }
    
    getCardClasses(state) {
        const { selected, disabled, hovered, focused } = state;
        const { type, status } = this.config;
        
        const classes = [
            `card-${type}`,
            `card-status-${status}`,
            selected ? 'selected' : '',
            disabled ? 'disabled' : '',
            hovered ? 'hovered' : '',
            focused ? 'focused' : ''
        ];
        
        return classes.filter(Boolean).join(' ');
    }
    
    renderBadge(badge) {
        if (!badge) return '';
        
        return `
            <div class="card-badge">
                <span class="badge-text">${ValidationUtils.sanitizeString(badge.text)}</span>
            </div>
        `;
    }
    
    renderImage(image) {
        if (!image) return '';
        
        return `
            <div class="card-image">
                <img src="${ValidationUtils.sanitizeString(image.src)}" 
                     alt="${ValidationUtils.sanitizeString(image.alt || '')}"
                     loading="lazy">
            </div>
        `;
    }
    
    renderHeader(icon, title, subtitle) {
        if (!title && !subtitle) return '';
        
        return `
            <div class="card-header">
                ${icon ? `<i data-lucide="${icon}" class="card-icon"></i>` : ''}
                <div class="card-title-section">
                    ${title ? `<h3 class="card-title">${ValidationUtils.sanitizeString(title)}</h3>` : ''}
                    ${subtitle ? `<p class="card-subtitle">${ValidationUtils.sanitizeString(subtitle)}</p>` : ''}
                </div>
            </div>
        `;
    }
    
    renderDescription(description) {
        if (!description) return '';
        
        return `
            <div class="card-description">
                <p>${ValidationUtils.sanitizeString(description)}</p>
            </div>
        `;
    }
    
    renderFeatures(features) {
        if (!features || features.length === 0) return '';
        
        return `
            <div class="card-features">
                <ul class="feature-list">
                    ${features.map(feature => `
                        <li class="feature-item">
                            <i data-lucide="check" class="feature-icon"></i>
                            <span>${ValidationUtils.sanitizeString(feature)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    renderPricing(price, originalPrice) {
        if (!price && !originalPrice) return '';
        
        return `
            <div class="card-pricing">
                ${originalPrice ? `
                    <span class="original-price">$${originalPrice}</span>
                ` : ''}
                ${price ? `
                    <span class="price">$${price}</span>
                ` : ''}
            </div>
        `;
    }
    
    renderActions(actions) {
        if (!actions || actions.length === 0) return '';
        
        return `
            <div class="card-actions">
                ${actions.map(action => `
                    <button class="action-btn ${action.className || ''}" 
                            data-action="${action.name}"
                            ${action.disabled ? 'disabled' : ''}>
                        ${action.icon ? `<i data-lucide="${action.icon}"></i>` : ''}
                        <span>${ValidationUtils.sanitizeString(action.text)}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    renderStatusIndicator(status) {
        if (status === 'default') return '';
        
        const statusIcons = {
            selected: 'check-circle',
            disabled: 'x-circle',
            featured: 'star'
        };
        
        const icon = statusIcons[status];
        if (!icon) return '';
        
        return `
            <div class="status-indicator status-${status}">
                <i data-lucide="${icon}"></i>
            </div>
        `;
    }
    
    setupAccessibility() {
        if (this.element) {
            this.element.setAttribute('role', 'button');
            this.element.setAttribute('tabindex', this.config.disabled ? '-1' : '0');
        }
    }
    
    updateCardClasses() {
        if (this.element) {
            this.element.className = `card ${this.config.className}`.trim();
        }
    }
    
    handleClick(event) {
        if (this.state.disabled) return;
        
        event.preventDefault();
        event.stopPropagation();
        
        if (this.config.selectable) {
            this.toggleSelection();
        }
        
        if (this.config.onClick) {
            this.config.onClick(event, this.state, this);
        }
        
        this.emit('cardClick', { event, state: this.state });
    }
    
    handleMouseEnter(event) {
        this.update({ hovered: true }, false);
        this.emit('cardHover', { event, state: this.state });
    }
    
    handleMouseLeave(event) {
        this.update({ hovered: false }, false);
        this.emit('cardLeave', { event, state: this.state });
    }
    
    handleKeyDown(event) {
        if (this.state.disabled) return;
        
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleClick(event);
        }
    }
    
    handleFocus(event) {
        this.update({ focused: true }, false);
        this.emit('cardFocus', { event, state: this.state });
    }
    
    handleBlur(event) {
        this.update({ focused: false }, false);
        this.emit('cardBlur', { event, state: this.state });
    }
    
    toggleSelection() {
        const newSelected = !this.state.selected;
        this.setSelected(newSelected);
    }
    
    setSelected(selected) {
        const wasSelected = this.state.selected;
        this.update({ selected }, true);
        
        if (selected !== wasSelected) {
            if (selected) {
                this.addClass('selected');
                this.setAttribute('aria-pressed', 'true');
                
                if (this.config.onSelect) {
                    this.config.onSelect(this.state, this);
                }
                this.emit('cardSelect', { state: this.state });
            } else {
                this.removeClass('selected');
                this.setAttribute('aria-pressed', 'false');
                
                if (this.config.onDeselect) {
                    this.config.onDeselect(this.state, this);
                }
                this.emit('cardDeselect', { state: this.state });
            }
        }
    }
    
    setDisabled(disabled) {
        this.update({ disabled }, true);
        
        if (disabled) {
            this.addClass('disabled');
            this.setAttribute('aria-disabled', 'true');
            this.setAttribute('tabindex', '-1');
        } else {
            this.removeClass('disabled');
            this.setAttribute('aria-disabled', 'false');
            this.setAttribute('tabindex', '0');
        }
    }
    
    setStatus(status) {
        this.config.status = status;
        this.update({}, true);
    }
    
    setPrice(price, originalPrice = null) {
        this.config.price = price;
        this.config.originalPrice = originalPrice;
        this.update({}, true);
    }
    
    setTitle(title, subtitle = null) {
        this.config.title = title;
        this.config.subtitle = subtitle;
        this.update({}, true);
    }
    
    setDescription(description) {
        this.config.description = description;
        this.update({}, true);
    }
    
    setFeatures(features) {
        this.config.features = features;
        this.update({}, true);
    }
    
    setActions(actions) {
        this.config.actions = actions;
        this.update({}, true);
    }
    
    setBadge(badge) {
        this.config.badge = badge;
        this.update({}, true);
    }
    
    setIcon(icon) {
        this.config.icon = icon;
        this.update({}, true);
    }
    
    setImage(image) {
        this.config.image = image;
        this.update({}, true);
    }
    
    isSelected() {
        return this.state.selected;
    }
    
    isDisabled() {
        return this.state.disabled;
    }
    
    getData() {
        return {
            id: this.id,
            type: this.config.type,
            title: this.config.title,
            subtitle: this.config.subtitle,
            description: this.config.description,
            price: this.config.price,
            originalPrice: this.config.originalPrice,
            features: this.config.features,
            status: this.config.status,
            selected: this.state.selected,
            disabled: this.state.disabled
        };
    }
    
    afterRender() {
        // Initialize Lucide icons if available
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}
