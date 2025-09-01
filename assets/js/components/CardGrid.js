// ===== CARD GRID COMPONENT =====
// Manages collections of cards with selection and layout capabilities

import { BaseComponent } from './BaseComponent.js';
import { Card } from './Card.js';

export class CardGrid extends BaseComponent {
    constructor(config = {}) {
        super({
            tagName: 'div',
            className: 'card-grid',
            ...config
        });
    }
    
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            items: [],
            layout: 'grid', // grid, list, masonry
            columns: 3,
            selectable: false,
            multiSelect: false,
            selectedItems: new Set(),
            filterable: false,
            sortable: false,
            searchable: false,
            pagination: false,
            itemsPerPage: 12,
            currentPage: 1,
            onSelectionChange: null,
            onItemClick: null,
            onItemSelect: null,
            onItemDeselect: null,
            emptyMessage: 'No items available',
            loadingMessage: 'Loading items...',
            cardConfig: {}
        };
    }
    
    getInitialState() {
        return {
            items: this.config.items,
            filteredItems: this.config.items,
            selectedItems: new Set(this.config.selectedItems),
            currentPage: this.config.currentPage,
            loading: false,
            searchQuery: '',
            sortBy: null,
            sortDirection: 'asc',
            filterCriteria: {}
        };
    }
    
    beforeInit() {
        this.setupGridTemplate();
        this.setupEventHandlers();
    }
    
    setupGridTemplate() {
        this.config.template = (state) => this.renderGrid(state);
    }
    
    setupEventHandlers() {
        this.config.events = {
            'cardSelect': this.handleCardSelect.bind(this),
            'cardDeselect': this.handleCardDeselect.bind(this),
            'cardClick': this.handleCardClick.bind(this)
        };
    }
    
    afterInit() {
        this.updateGridClasses();
        this.renderCards();
    }
    
    renderGrid(state) {
        const { items, loading, currentPage, itemsPerPage } = state;
        const { layout, emptyMessage, loadingMessage } = this.config;
        
        if (loading) {
            return `
                <div class="grid-loading">
                    <div class="loading-spinner">
                        <i data-lucide="loader-2"></i>
                        <p>${loadingMessage}</p>
                    </div>
                </div>
            `;
        }
        
        if (!items || items.length === 0) {
            return `
                <div class="grid-empty">
                    <i data-lucide="package"></i>
                    <p>${emptyMessage}</p>
                </div>
            `;
        }
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = items.slice(startIndex, endIndex);
        
        return `
            <div class="grid-container grid-layout-${layout}">
                ${this.renderGridItems(pageItems)}
            </div>
            ${this.renderPagination()}
        `;
    }
    
    renderGridItems(items) {
        return items.map(item => `
            <div class="grid-item" data-item-id="${item.id}">
                <!-- Card will be rendered here -->
            </div>
        `).join('');
    }
    
    renderPagination() {
        if (!this.config.pagination) return '';
        
        const { items } = this.state;
        const { itemsPerPage, currentPage } = this.config;
        const totalPages = Math.ceil(items.length / itemsPerPage);
        
        if (totalPages <= 1) return '';
        
        return `
            <div class="grid-pagination">
                <button class="pagination-btn prev" 
                        ${currentPage <= 1 ? 'disabled' : ''}
                        data-page="${currentPage - 1}">
                    <i data-lucide="chevron-left"></i>
                    Previous
                </button>
                
                <div class="pagination-pages">
                    ${this.renderPageNumbers(currentPage, totalPages)}
                </div>
                
                <button class="pagination-btn next" 
                        ${currentPage >= totalPages ? 'disabled' : ''}
                        data-page="${currentPage + 1}">
                    Next
                    <i data-lucide="chevron-right"></i>
                </button>
            </div>
        `;
    }
    
    renderPageNumbers(currentPage, totalPages) {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages.map(page => {
            if (page === '...') {
                return '<span class="pagination-ellipsis">...</span>';
            }
            
            const isActive = page === currentPage;
            return `
                <button class="pagination-page ${isActive ? 'active' : ''}" 
                        data-page="${page}">
                    ${page}
                </button>
            `;
        }).join('');
    }
    
    updateGridClasses() {
        if (this.element) {
            const { layout, columns } = this.config;
            this.element.className = `card-grid grid-layout-${layout} grid-cols-${columns}`;
            this.element.style.setProperty('--grid-columns', columns);
        }
    }
    
    renderCards() {
        const { items } = this.state;
        const { cardConfig } = this.config;
        
        // Clear existing cards
        this.children.clear();
        
        if (!items || items.length === 0) return;
        
        items.forEach((item, index) => {
            const card = this.createCard(item, cardConfig);
            this.addChild(`card_${item.id}`, card);
            
            // Mount card to grid item
            const gridItem = this.element?.querySelector(`[data-item-id="${item.id}"]`);
            if (gridItem) {
                card.mount(gridItem);
            }
        });
    }
    
    createCard(item, cardConfig) {
        const config = {
            ...cardConfig,
            ...item,
            selectable: this.config.selectable,
            selected: this.state.selectedItems.has(item.id),
            onClick: this.handleItemClick.bind(this),
            onSelect: this.handleItemSelect.bind(this),
            onDeselect: this.handleItemDeselect.bind(this)
        };
        
        return new Card(config);
    }
    
    handleCardSelect(event) {
        const card = event.target;
        const itemId = card.getAttribute('data-item-id');
        
        if (itemId) {
            this.selectItem(itemId);
        }
    }
    
    handleCardDeselect(event) {
        const card = event.target;
        const itemId = card.getAttribute('data-item-id');
        
        if (itemId) {
            this.deselectItem(itemId);
        }
    }
    
    handleCardClick(event) {
        const card = event.target;
        const itemId = card.getAttribute('data-item-id');
        
        if (itemId && this.config.onItemClick) {
            this.config.onItemClick(itemId, event);
        }
    }
    
    handleItemClick(event, state, card) {
        if (this.config.onItemClick) {
            this.config.onItemClick(card.id, event);
        }
    }
    
    handleItemSelect(state, card) {
        this.selectItem(card.id);
    }
    
    handleItemDeselect(state, card) {
        this.deselectItem(card.id);
    }
    
    selectItem(itemId) {
        if (!this.config.selectable) return;
        
        const newSelected = new Set(this.state.selectedItems);
        
        if (!this.config.multiSelect) {
            newSelected.clear();
        }
        
        newSelected.add(itemId);
        
        this.update({ selectedItems: newSelected });
        this.updateCardSelection(itemId, true);
        
        if (this.config.onSelectionChange) {
            this.config.onSelectionChange(Array.from(newSelected));
        }
        
        if (this.config.onItemSelect) {
            this.config.onItemSelect(itemId);
        }
    }
    
    deselectItem(itemId) {
        if (!this.config.selectable) return;
        
        const newSelected = new Set(this.state.selectedItems);
        newSelected.delete(itemId);
        
        this.update({ selectedItems: newSelected });
        this.updateCardSelection(itemId, false);
        
        if (this.config.onSelectionChange) {
            this.config.onSelectionChange(Array.from(newSelected));
        }
        
        if (this.config.onItemDeselect) {
            this.config.onItemDeselect(itemId);
        }
    }
    
    updateCardSelection(itemId, selected) {
        const card = this.getChild(`card_${itemId}`);
        if (card) {
            card.setSelected(selected);
        }
    }
    
    setItems(items) {
        this.update({ items, filteredItems: items });
        this.renderCards();
    }
    
    addItem(item) {
        const newItems = [...this.state.items, item];
        this.setItems(newItems);
    }
    
    removeItem(itemId) {
        const newItems = this.state.items.filter(item => item.id !== itemId);
        this.setItems(newItems);
        
        // Remove from selection
        const newSelected = new Set(this.state.selectedItems);
        newSelected.delete(itemId);
        this.update({ selectedItems: newSelected });
    }
    
    updateItem(itemId, updates) {
        const newItems = this.state.items.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
        );
        this.setItems(newItems);
        
        // Update card if it exists
        const card = this.getChild(`card_${itemId}`);
        if (card) {
            Object.entries(updates).forEach(([key, value]) => {
                const setter = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
                if (typeof card[setter] === 'function') {
                    card[setter](value);
                }
            });
        }
    }
    
    setSelection(selectedIds) {
        const newSelected = new Set(selectedIds);
        this.update({ selectedItems: newSelected });
        
        // Update all cards
        this.state.items.forEach(item => {
            this.updateCardSelection(item.id, newSelected.has(item.id));
        });
    }
    
    getSelection() {
        return Array.from(this.state.selectedItems);
    }
    
    clearSelection() {
        this.setSelection([]);
    }
    
    filterItems(criteria) {
        let filtered = this.state.items;
        
        Object.entries(criteria).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                filtered = filtered.filter(item => {
                    if (typeof value === 'string') {
                        return item[key]?.toLowerCase().includes(value.toLowerCase());
                    }
                    return item[key] === value;
                });
            }
        });
        
        this.update({ filteredItems: filtered });
        this.renderCards();
    }
    
    searchItems(query) {
        this.update({ searchQuery: query });
        
        if (!query) {
            this.update({ filteredItems: this.state.items });
        } else {
            const filtered = this.state.items.filter(item => {
                const searchableFields = ['title', 'subtitle', 'description', 'name'];
                return searchableFields.some(field => 
                    item[field]?.toLowerCase().includes(query.toLowerCase())
                );
            });
            this.update({ filteredItems: filtered });
        }
        
        this.renderCards();
    }
    
    sortItems(field, direction = 'asc') {
        const sorted = [...this.state.filteredItems].sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];
            
            // Handle numeric values
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
            
            // Handle string values
            aVal = String(aVal || '').toLowerCase();
            bVal = String(bVal || '').toLowerCase();
            
            if (direction === 'asc') {
                return aVal.localeCompare(bVal);
            } else {
                return bVal.localeCompare(aVal);
            }
        });
        
        this.update({ 
            filteredItems: sorted,
            sortBy: field,
            sortDirection: direction
        });
        this.renderCards();
    }
    
    setPage(page) {
        this.update({ currentPage: page });
        this.renderCards();
    }
    
    setLayout(layout) {
        this.config.layout = layout;
        this.updateGridClasses();
        this.renderCards();
    }
    
    setColumns(columns) {
        this.config.columns = columns;
        this.updateGridClasses();
    }
    
    setLoading(loading) {
        this.update({ loading });
    }
    
    getItemById(itemId) {
        return this.state.items.find(item => item.id === itemId);
    }
    
    getSelectedItems() {
        return this.state.items.filter(item => 
            this.state.selectedItems.has(item.id)
        );
    }
    
    getFilteredItems() {
        return this.state.filteredItems;
    }
    
    getStats() {
        return {
            ...super.getStats(),
            totalItems: this.state.items.length,
            filteredItems: this.state.filteredItems.length,
            selectedItems: this.state.selectedItems.size,
            currentPage: this.state.currentPage,
            totalPages: Math.ceil(this.state.filteredItems.length / this.config.itemsPerPage)
        };
    }
    
    afterRender() {
        // Initialize Lucide icons if available
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Setup pagination event listeners
        this.setupPaginationListeners();
    }
    
    setupPaginationListeners() {
        if (!this.config.pagination) return;
        
        const paginationBtns = this.element?.querySelectorAll('.pagination-btn, .pagination-page');
        paginationBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(btn.dataset.page);
                if (page && !btn.disabled) {
                    this.setPage(page);
                }
            });
        });
    }
}
