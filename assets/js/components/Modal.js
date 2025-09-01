// ===== MODAL COMPONENT =====
// Reusable modal dialog component with backdrop and animations

import { BaseComponent } from './BaseComponent.js';
import { ValidationUtils } from '../utils/Validation.js';

export class Modal extends BaseComponent {
    constructor(config = {}) {
        super({
            tagName: 'div',
            className: 'modal',
            ...config
        });
    }
    
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            title: '',
            content: '',
            size: 'medium', // small, medium, large, fullscreen
            closable: true,
            backdrop: true,
            backdropClosable: true,
            escapeClosable: true,
            animation: true,
            focusTrap: true,
            restoreFocus: true,
            onOpen: null,
            onClose: null,
            onConfirm: null,
            onCancel: null,
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            showFooter: true,
            showHeader: true,
            customClass: '',
            zIndex: 1000
        };
    }
    
    getInitialState() {
        return {
            isOpen: false,
            isAnimating: false,
            previousFocus: null
        };
    }
    
    beforeInit() {
        this.setupModalTemplate();
        this.setupEventHandlers();
    }
    
    setupModalTemplate() {
        this.config.template = (state) => this.renderModal(state);
    }
    
    setupEventHandlers() {
        this.config.events = {
            'keydown': this.handleKeyDown.bind(this),
            'click': this.handleBackdropClick.bind(this)
        };
    }
    
    afterInit() {
        this.updateModalClasses();
        this.setupAccessibility();
    }
    
    renderModal(state) {
        const { isOpen } = state;
        const {
            title,
            content,
            size,
            closable,
            backdrop,
            showHeader,
            showFooter,
            confirmText,
            cancelText,
            customClass
        } = this.config;
        
        if (!isOpen) return '';
        
        return `
            ${backdrop ? '<div class="modal-backdrop"></div>' : ''}
            <div class="modal-container modal-size-${size} ${customClass}">
                <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    ${showHeader ? this.renderHeader(title, closable) : ''}
                    
                    <div class="modal-body">
                        ${this.renderContent(content)}
                    </div>
                    
                    ${showFooter ? this.renderFooter(confirmText, cancelText) : ''}
                </div>
            </div>
        `;
    }
    
    renderHeader(title, closable) {
        return `
            <div class="modal-header">
                ${title ? `<h2 id="modal-title" class="modal-title">${ValidationUtils.sanitizeString(title)}</h2>` : ''}
                ${closable ? `
                    <button class="modal-close" aria-label="Close modal">
                        <i data-lucide="x"></i>
                    </button>
                ` : ''}
            </div>
        `;
    }
    
    renderContent(content) {
        if (typeof content === 'string') {
            return `<div class="modal-content">${ValidationUtils.sanitizeHTML(content)}</div>`;
        } else if (content instanceof BaseComponent) {
            return `<div class="modal-content" id="modal-content-${content.id}"></div>`;
        } else if (content instanceof HTMLElement) {
            return `<div class="modal-content"></div>`;
        }
        return '<div class="modal-content"></div>';
    }
    
    renderFooter(confirmText, cancelText) {
        return `
            <div class="modal-footer">
                <button class="btn btn-secondary modal-cancel">
                    ${cancelText}
                </button>
                <button class="btn btn-primary modal-confirm">
                    ${confirmText}
                </button>
            </div>
        `;
    }
    
    updateModalClasses() {
        if (this.element) {
            this.element.className = `modal ${this.config.className}`.trim();
            this.element.style.zIndex = this.config.zIndex;
        }
    }
    
    setupAccessibility() {
        if (this.element) {
            this.element.setAttribute('role', 'dialog');
            this.element.setAttribute('aria-modal', 'true');
        }
    }
    
    handleKeyDown(event) {
        if (event.key === 'Escape' && this.config.escapeClosable) {
            this.close();
        }
    }
    
    handleBackdropClick(event) {
        if (this.config.backdropClosable && event.target.classList.contains('modal-backdrop')) {
            this.close();
        }
    }
    
    open() {
        if (this.state.isOpen) return;
        
        try {
            this.beforeOpen();
            
            // Store previous focus
            if (this.config.restoreFocus) {
                this.state.previousFocus = document.activeElement;
            }
            
            // Show modal
            this.update({ isOpen: true, isAnimating: true });
            
            // Add to body if not already there
            if (!this.isMounted) {
                this.mount(document.body);
            }
            
            // Focus trap
            if (this.config.focusTrap) {
                this.setupFocusTrap();
            }
            
            // Trigger animation
            if (this.config.animation) {
                this.animateIn();
            }
            
            this.afterOpen();
            
            if (this.config.onOpen) {
                this.config.onOpen(this);
            }
            
            this.emit('modalOpen', { modal: this });
            
        } catch (error) {
            console.error('Error opening modal:', error);
        }
    }
    
    close() {
        if (!this.state.isOpen) return;
        
        try {
            this.beforeClose();
            
            // Trigger animation
            if (this.config.animation) {
                this.animateOut(() => {
                    this.finishClose();
                });
            } else {
                this.finishClose();
            }
            
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    }
    
    finishClose() {
        // Hide modal
        this.update({ isOpen: false, isAnimating: false });
        
        // Restore focus
        if (this.config.restoreFocus && this.state.previousFocus) {
            this.state.previousFocus.focus();
        }
        
        // Remove focus trap
        if (this.config.focusTrap) {
            this.removeFocusTrap();
        }
        
        this.afterClose();
        
        if (this.config.onClose) {
            this.config.onClose(this);
        }
        
        this.emit('modalClose', { modal: this });
    }
    
    animateIn() {
        const container = this.element?.querySelector('.modal-container');
        if (container) {
            container.classList.add('modal-enter');
            setTimeout(() => {
                container.classList.remove('modal-enter');
                this.update({ isAnimating: false });
            }, 300);
        }
    }
    
    animateOut(callback) {
        const container = this.element?.querySelector('.modal-container');
        if (container) {
            container.classList.add('modal-leave');
            setTimeout(() => {
                container.classList.remove('modal-leave');
                if (callback) callback();
            }, 300);
        } else {
            if (callback) callback();
        }
    }
    
    setupFocusTrap() {
        const focusableElements = this.element?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
            this.firstFocusable = focusableElements[0];
            this.lastFocusable = focusableElements[focusableElements.length - 1];
            
            // Focus first element
            this.firstFocusable.focus();
            
            // Setup trap
            this.element.addEventListener('keydown', this.handleFocusTrap.bind(this));
        }
    }
    
    removeFocusTrap() {
        this.element.removeEventListener('keydown', this.handleFocusTrap.bind(this));
        this.firstFocusable = null;
        this.lastFocusable = null;
    }
    
    handleFocusTrap(event) {
        if (event.key === 'Tab') {
            if (event.shiftKey) {
                if (document.activeElement === this.firstFocusable) {
                    event.preventDefault();
                    this.lastFocusable.focus();
                }
            } else {
                if (document.activeElement === this.lastFocusable) {
                    event.preventDefault();
                    this.firstFocusable.focus();
                }
            }
        }
    }
    
    beforeOpen() {
        // Override in subclasses
    }
    
    afterOpen() {
        // Override in subclasses
    }
    
    beforeClose() {
        // Override in subclasses
    }
    
    afterClose() {
        // Override in subclasses
    }
    
    setTitle(title) {
        this.config.title = title;
        this.update({}, true);
    }
    
    setContent(content) {
        this.config.content = content;
        this.update({}, true);
        
        // If content is a component, mount it
        if (content instanceof BaseComponent) {
            const contentContainer = this.element?.querySelector(`#modal-content-${content.id}`);
            if (contentContainer) {
                content.mount(contentContainer);
            }
        }
    }
    
    setSize(size) {
        this.config.size = size;
        this.updateModalClasses();
    }
    
    setClosable(closable) {
        this.config.closable = closable;
        this.update({}, true);
    }
    
    setBackdrop(backdrop) {
        this.config.backdrop = backdrop;
        this.update({}, true);
    }
    
    setConfirmText(text) {
        this.config.confirmText = text;
        this.update({}, true);
    }
    
    setCancelText(text) {
        this.config.cancelText = text;
        this.update({}, true);
    }
    
    showFooter(show) {
        this.config.showFooter = show;
        this.update({}, true);
    }
    
    showHeader(show) {
        this.config.showHeader = show;
        this.update({}, true);
    }
    
    isOpen() {
        return this.state.isOpen;
    }
    
    isAnimating() {
        return this.state.isAnimating;
    }
    
    // Static methods for common modal types
    static alert(message, title = 'Alert', options = {}) {
        return new Promise((resolve) => {
            const modal = new Modal({
                title,
                content: `<p>${ValidationUtils.sanitizeString(message)}</p>`,
                size: 'small',
                showFooter: false,
                onClose: () => resolve(true),
                ...options
            });
            
            modal.open();
        });
    }
    
    static confirm(message, title = 'Confirm', options = {}) {
        return new Promise((resolve) => {
            const modal = new Modal({
                title,
                content: `<p>${ValidationUtils.sanitizeString(message)}</p>`,
                size: 'small',
                onConfirm: () => {
                    modal.close();
                    resolve(true);
                },
                onCancel: () => {
                    modal.close();
                    resolve(false);
                },
                ...options
            });
            
            modal.open();
        });
    }
    
    static prompt(message, defaultValue = '', title = 'Input', options = {}) {
        return new Promise((resolve) => {
            const inputId = `modal-input-${Date.now()}`;
            const modal = new Modal({
                title,
                content: `
                    <p>${ValidationUtils.sanitizeString(message)}</p>
                    <input type="text" id="${inputId}" value="${ValidationUtils.sanitizeString(defaultValue)}" class="form-input">
                `,
                size: 'small',
                onConfirm: () => {
                    const input = document.getElementById(inputId);
                    const value = input ? input.value : defaultValue;
                    modal.close();
                    resolve(value);
                },
                onCancel: () => {
                    modal.close();
                    resolve(null);
                },
                ...options
            });
            
            modal.open();
            
            // Focus input
            setTimeout(() => {
                const input = document.getElementById(inputId);
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 100);
        });
    }
    
    afterRender() {
        // Initialize Lucide icons if available
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Setup modal-specific event listeners
        this.setupModalListeners();
    }
    
    setupModalListeners() {
        if (!this.element) return;
        
        // Close button
        const closeBtn = this.element.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Confirm button
        const confirmBtn = this.element.querySelector('.modal-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (this.config.onConfirm) {
                    this.config.onConfirm(this);
                }
                this.emit('modalConfirm', { modal: this });
            });
        }
        
        // Cancel button
        const cancelBtn = this.element.querySelector('.modal-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (this.config.onCancel) {
                    this.config.onCancel(this);
                }
                this.emit('modalCancel', { modal: this });
                this.close();
            });
        }
    }
}
