// ===== QUOTE SYSTEM JAVASCRIPT =====

// Security utility functions
const SecurityUtils = {
    // Safely create text content
    createTextElement: (tagName, className, textContent) => {
        const element = document.createElement(tagName
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    },
    
    // Safely create element with attributes
    createElement: (tagName, className, attributes = {}) => {
        const element = document.createElement(tagName
        if (className) element.className = className;
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value
        }
        return element;
    },
    
    // Safely append children
    appendChildren: (parent, ...children) => {
        children.forEach(child => {
            if (child) parent.appendChild(child
        }
        return parent;
    },
    
    // Sanitize user input
    sanitizeInput: (input) => {
        if (typeof input !== 'string') return '';
        return input.replace(/[<>\"'&]/g, ''
    }
};

// Virtual Renderer for Performance Optimization
class VirtualRenderer {
    constructor() {
        this.renderQueue = [];
        this.isRendering = false;
        this.processingDelay = 16; // 60fps target
        this.totalRenders = 0;
        this.completedRenders = 0;
        this.progressElement = null;
        this.setupProgressIndicator(
    }
    
    setupProgressIndicator() {
        // Create progress indicator if it doesn't exist
        if (!document.querySelector('.virtual-render-progress')) {
            this.progressElement = document.createElement('div'
            this.progressElement.className = 'virtual-render-progress';
            
            // Create elements safely without innerHTML
            const progressText = document.createElement('div'
            progressText.className = 'progress-text';
            
            const loaderIcon = document.createElement('i'
            loaderIcon.setAttribute('data-lucide', 'loader-2'
            
            const span = document.createElement('span'
            span.textContent = 'Rendering...';
            
            const progressBar = document.createElement('div'
            progressBar.className = 'progress-bar';
            
            const progressFill = document.createElement('div'
            progressFill.className = 'progress-fill';
            
            // Assemble DOM safely
            progressText.appendChild(loaderIcon
            progressText.appendChild(span
            progressBar.appendChild(progressFill
            this.progressElement.appendChild(progressText
            this.progressElement.appendChild(progressBar
            
            document.body.appendChild(this.progressElement
        } else {
            this.progressElement = document.querySelector('.virtual-render-progress'
        }
    }
    
    showProgress() {
        if (this.progressElement) {
            this.progressElement.classList.add('show'
        }
    }
    
    hideProgress() {
        if (this.progressElement) {
            this.progressElement.classList.remove('show'
        }
    }
    
    updateProgress() {
        if (this.progressElement && this.totalRenders > 0) {
            const percentage = (this.completedRenders / this.totalRenders) * 100;
            const progressFill = this.progressElement.querySelector('.progress-fill'
            if (progressFill) {
                progressFill.style.width = `${percentage}%`;
            }
        }
    }
    
    queueRender(renderFunction, priority = 'normal') {
        this.renderQueue.push({ fn: renderFunction, priority }
        this.totalRenders++;
        this.processQueue(
    }
    
    async processQueue() {
        if (this.isRendering) return;
        this.isRendering = true;
        this.showProgress(
        
        // Sort by priority
        this.renderQueue.sort((a, b) => {
            const priorities = { high: 3, normal: 2, low: 1 };
            return priorities[b.priority] - priorities[a.priority];
        }
        
        while (this.renderQueue.length > 0) {
            const { fn } = this.renderQueue.shift(
            
            try {
                await new Promise(resolve => {
                    requestAnimationFrame(() => {
                        fn(
                        this.completedRenders++;
                        this.updateProgress(
                        resolve(
                    }
                }
                
                // Small delay to prevent UI blocking
                await new Promise(resolve => setTimeout(resolve, this.processingDelay)
            } catch (error) {
                this.completedRenders++;
                this.updateProgress(
            }
        }
        
        this.isRendering = false;
        this.hideProgress(
        
        // Reset counters after a short delay
        setTimeout(() => {
            this.totalRenders = 0;
            this.completedRenders = 0;
        }, 1000
    }
    
    clearQueue() {
        this.renderQueue = [];
        this.totalRenders = 0;
        this.completedRenders = 0;
        this.hideProgress(
    }
    
    getQueueLength() {
        return this.renderQueue.length;
    }
    
    isProcessing() {
        return this.isRendering;
    }
}

class QuoteSystem {
    constructor() {
        
        
        // Initialize Virtual Renderer
        this.virtualRenderer = new VirtualRenderer(
        
        this.selectedPackage = null;
        this.selectedAdditionalFeatures = new Set(
        this.selectedAddonServices = new Set(
        this.totalPrice = 0;
        
        // Country data - Complete list of all countries in the world
        this.countries = [
            { code: '+93', flag: 'af', name: 'Afghanistan' },
            { code: '+355', flag: 'al', name: 'Albania' },
            { code: '+213', flag: 'dz', name: 'Algeria' },
            { code: '+376', flag: 'ad', name: 'Andorra' },
            { code: '+244', flag: 'ao', name: 'Angola' },
            { code: '+1-268', flag: 'ag', name: 'Antigua and Barbuda' },
            { code: '+54', flag: 'ar', name: 'Argentina' },
            { code: '+374', flag: 'am', name: 'Armenia' },
            { code: '+61', flag: 'au', name: 'Australia' },
            { code: '+43', flag: 'at', name: 'Austria' },
            { code: '+994', flag: 'az', name: 'Azerbaijan' },
            { code: '+1-242', flag: 'bs', name: 'Bahamas' },
            { code: '+973', flag: 'bh', name: 'Bahrain' },
            { code: '+880', flag: 'bd', name: 'Bangladesh' },
            { code: '+1-246', flag: 'bb', name: 'Barbados' },
            { code: '+375', flag: 'by', name: 'Belarus' },
            { code: '+32', flag: 'be', name: 'Belgium' },
            { code: '+501', flag: 'bz', name: 'Belize' },
            { code: '+229', flag: 'bj', name: 'Benin' },
            { code: '+975', flag: 'bt', name: 'Bhutan' },
            { code: '+591', flag: 'bo', name: 'Bolivia' },
            { code: '+387', flag: 'ba', name: 'Bosnia and Herzegovina' },
            { code: '+267', flag: 'bw', name: 'Botswana' },
            { code: '+55', flag: 'br', name: 'Brazil' },
            { code: '+673', flag: 'bn', name: 'Brunei' },
            { code: '+359', flag: 'bg', name: 'Bulgaria' },
            { code: '+226', flag: 'bf', name: 'Burkina Faso' },
            { code: '+257', flag: 'bi', name: 'Burundi' },
            { code: '+855', flag: 'kh', name: 'Cambodia' },
            { code: '+237', flag: 'cm', name: 'Cameroon' },
            { code: '+1', flag: 'ca', name: 'Canada' },
            { code: '+238', flag: 'cv', name: 'Cape Verde' },
            { code: '+236', flag: 'cf', name: 'Central African Republic' },
            { code: '+235', flag: 'td', name: 'Chad' },
            { code: '+56', flag: 'cl', name: 'Chile' },
            { code: '+86', flag: 'cn', name: 'China' },
            { code: '+57', flag: 'co', name: 'Colombia' },
            { code: '+269', flag: 'km', name: 'Comoros' },
            { code: '+242', flag: 'cg', name: 'Republic of the Congo' },
            { code: '+243', flag: 'cd', name: 'Democratic Republic of the Congo' },
            { code: '+506', flag: 'cr', name: 'Costa Rica' },
            { code: '+385', flag: 'hr', name: 'Croatia' },
            { code: '+53', flag: 'cu', name: 'Cuba' },
            { code: '+357', flag: 'cy', name: 'Cyprus' },
            { code: '+420', flag: 'cz', name: 'Czech Republic' },
            { code: '+45', flag: 'dk', name: 'Denmark' },
            { code: '+253', flag: 'dj', name: 'Djibouti' },
            { code: '+1-809', flag: 'do', name: 'Dominican Republic' },
            { code: '+670', flag: 'tl', name: 'East Timor' },
            { code: '+593', flag: 'ec', name: 'Ecuador' },
            { code: '+20', flag: 'eg', name: 'Egypt' },
            { code: '+503', flag: 'sv', name: 'El Salvador' },
            { code: '+240', flag: 'gq', name: 'Equatorial Guinea' },
            { code: '+291', flag: 'er', name: 'Eritrea' },
            { code: '+372', flag: 'ee', name: 'Estonia' },
            { code: '+268', flag: 'sz', name: 'Eswatini' },
            { code: '+251', flag: 'et', name: 'Ethiopia' },
            { code: '+679', flag: 'fj', name: 'Fiji' },
            { code: '+358', flag: 'fi', name: 'Finland' },
            { code: '+33', flag: 'fr', name: 'France' },
            { code: '+241', flag: 'ga', name: 'Gabon' },
            { code: '+220', flag: 'gm', name: 'Gambia' },
            { code: '+995', flag: 'ge', name: 'Georgia' },
            { code: '+49', flag: 'de', name: 'Germany' },
            { code: '+233', flag: 'gh', name: 'Ghana' },
            { code: '+30', flag: 'gr', name: 'Greece' },
            { code: '+1-473', flag: 'gd', name: 'Grenada' },
            { code: '+502', flag: 'gt', name: 'Guatemala' },
            { code: '+224', flag: 'gn', name: 'Guinea' },
            { code: '+245', flag: 'gw', name: 'Guinea-Bissau' },
            { code: '+592', flag: 'gy', name: 'Guyana' },
            { code: '+509', flag: 'ht', name: 'Haiti' },
            { code: '+504', flag: 'hn', name: 'Honduras' },
            { code: '+852', flag: 'hk', name: 'Hong Kong' },
            { code: '+36', flag: 'hu', name: 'Hungary' },
            { code: '+354', flag: 'is', name: 'Iceland' },
            { code: '+91', flag: 'id', name: 'India' },
            { code: '+62', flag: 'id', name: 'Indonesia' },
            { code: '+98', flag: 'ir', name: 'Iran' },
            { code: '+964', flag: 'iq', name: 'Iraq' },
            { code: '+353', flag: 'ie', name: 'Ireland' },
            { code: '+972', flag: 'il', name: 'Israel' },
            { code: '+39', flag: 'it', name: 'Italy' },
            { code: '+1-876', flag: 'jm', name: 'Jamaica' },
            { code: '+81', flag: 'jp', name: 'Japan' },
            { code: '+962', flag: 'jo', name: 'Jordan' },
            { code: '+7', flag: 'kz', name: 'Kazakhstan' },
            { code: '+254', flag: 'ke', name: 'Kenya' },
            { code: '+686', flag: 'ki', name: 'Kiribati' },
            { code: '+850', flag: 'kp', name: 'North Korea' },
            { code: '+82', flag: 'kr', name: 'South Korea' },
            { code: '+965', flag: 'kw', name: 'Kuwait' },
            { code: '+996', flag: 'kg', name: 'Kyrgyzstan' },
            { code: '+856', flag: 'la', name: 'Laos' },
            { code: '+371', flag: 'lv', name: 'Latvia' },
            { code: '+961', flag: 'lb', name: 'Lebanon' },
            { code: '+266', flag: 'ls', name: 'Lesotho' },
            { code: '+231', flag: 'lr', name: 'Liberia' },
            { code: '+218', flag: 'ly', name: 'Libya' },
            { code: '+423', flag: 'li', name: 'Liechtenstein' },
            { code: '+370', flag: 'lt', name: 'Lithuania' },
            { code: '+352', flag: 'lu', name: 'Luxembourg' },
            { code: '+853', flag: 'mo', name: 'Macau' },
            { code: '+261', flag: 'mg', name: 'Madagascar' },
            { code: '+265', flag: 'mw', name: 'Malawi' },
            { code: '+60', flag: 'my', name: 'Malaysia' },
            { code: '+960', flag: 'mv', name: 'Maldives' },
            { code: '+223', flag: 'ml', name: 'Mali' },
            { code: '+356', flag: 'mt', name: 'Malta' },
            { code: '+692', flag: 'mh', name: 'Marshall Islands' },
            { code: '+222', flag: 'mr', name: 'Mauritania' },
            { code: '+230', flag: 'mu', name: 'Mauritius' },
            { code: '+52', flag: 'mx', name: 'Mexico' },
            { code: '+691', flag: 'fm', name: 'Micronesia' },
            { code: '+373', flag: 'md', name: 'Moldova' },
            { code: '+377', flag: 'mc', name: 'Monaco' },
            { code: '+976', flag: 'mn', name: 'Mongolia' },
            { code: '+382', flag: 'me', name: 'Montenegro' },
            { code: '+212', flag: 'ma', name: 'Morocco' },
            { code: '+258', flag: 'mz', name: 'Mozambique' },
            { code: '+95', flag: 'mm', name: 'Myanmar' },
            { code: '+264', flag: 'na', name: 'Namibia' },
            { code: '+674', flag: 'nr', name: 'Nauru' },
            { code: '+977', flag: 'np', name: 'Nepal' },
            { code: '+31', flag: 'nl', name: 'Netherlands' },
            { code: '+64', flag: 'nz', name: 'New Zealand' },
            { code: '+505', flag: 'ni', name: 'Nicaragua' },
            { code: '+227', flag: 'ne', name: 'Niger' },
            { code: '+234', flag: 'ng', name: 'Nigeria' },
            { code: '+47', flag: 'no', name: 'Norway' },
            { code: '+968', flag: 'om', name: 'Oman' },
            { code: '+92', flag: 'pk', name: 'Pakistan' },
            { code: '+680', flag: 'pw', name: 'Palau' },
            { code: '+970', flag: 'ps', name: 'Palestine' },
            { code: '+507', flag: 'pa', name: 'Panama' },
            { code: '+675', flag: 'pg', name: 'Papua New Guinea' },
            { code: '+595', flag: 'py', name: 'Paraguay' },
            { code: '+51', flag: 'pe', name: 'Peru' },
            { code: '+63', flag: 'ph', name: 'Philippines' },
            { code: '+48', flag: 'pl', name: 'Poland' },
            { code: '+351', flag: 'pt', name: 'Portugal' },
            { code: '+974', flag: 'qa', name: 'Qatar' },
            { code: '+40', flag: 'ro', name: 'Romania' },
            { code: '+7', flag: 'ru', name: 'Russia' },
            { code: '+250', flag: 'rw', name: 'Rwanda' },
            { code: '+966', flag: 'sa', name: 'Saudi Arabia' },
            { code: '+221', flag: 'sn', name: 'Senegal' },
            { code: '+381', flag: 'rs', name: 'Serbia' },
            { code: '+248', flag: 'sc', name: 'Seychelles' },
            { code: '+232', flag: 'sl', name: 'Sierra Leone' },
            { code: '+65', flag: 'sg', name: 'Singapore' },
            { code: '+421', flag: 'sk', name: 'Slovakia' },
            { code: '+386', flag: 'si', name: 'Slovenia' },
            { code: '+677', flag: 'sb', name: 'Solomon Islands' },
            { code: '+252', flag: 'so', name: 'Somalia' },
            { code: '+27', flag: 'za', name: 'South Africa' },
            { code: '+34', flag: 'es', name: 'Spain' },
            { code: '+94', flag: 'lk', name: 'Sri Lanka' },
            { code: '+249', flag: 'sd', name: 'Sudan' },
            { code: '+597', flag: 'sr', name: 'Suriname' },
            { code: '+46', flag: 'se', name: 'Sweden' },
            { code: '+41', flag: 'ch', name: 'Switzerland' },
            { code: '+963', flag: 'sy', name: 'Syria' },
            { code: '+886', flag: 'tw', name: 'Taiwan' },
            { code: '+992', flag: 'tj', name: 'Tajikistan' },
            { code: '+255', flag: 'tz', name: 'Tanzania' },
            { code: '+66', flag: 'th', name: 'Thailand' },
            { code: '+228', flag: 'tg', name: 'Togo' },
            { code: '+676', flag: 'to', name: 'Tonga' },
            { code: '+1-868', flag: 'tt', name: 'Trinidad and Tobago' },
            { code: '+216', flag: 'tn', name: 'Tunisia' },
            { code: '+90', flag: 'tr', name: 'Turkey' },
            { code: '+993', flag: 'tm', name: 'Turkmenistan' },
            { code: '+256', flag: 'ug', name: 'Uganda' },
            { code: '+380', flag: 'ua', name: 'Ukraine' },
            { code: '+971', flag: 'ae', name: 'United Arab Emirates' },
            { code: '+44', flag: 'gb', name: 'United Kingdom' },
            { code: '+1', flag: 'us', name: 'United States' },
            { code: '+598', flag: 'uy', name: 'Uruguay' },
            { code: '+998', flag: 'uz', name: 'Uzbekistan' },
            { code: '+678', flag: 'vu', name: 'Vanuatu' },
            { code: '+58', flag: 've', name: 'Venezuela' },
            { code: '+84', flag: 'vn', name: 'Vietnam' },
            { code: '+967', flag: 'ye', name: 'Yemen' },
            { code: '+260', flag: 'zm', name: 'Zambia' },
            { code: '+263', flag: 'zw', name: 'Zimbabwe' }
        ];
        

        

        
        
        this.init(
    }
    
    // Data persistence methods
    saveToLocalStorage() {
        const data = {
            selectedPackage: this.selectedPackage,
            selectedAdditionalFeatures: Array.from(this.selectedAdditionalFeatures),
            selectedAddonServices: Array.from(this.selectedAddonServices),
            totalPrice: this.totalPrice,
            timestamp: Date.now()
        };
        
        localStorage.setItem('hvacQuoteData', JSON.stringify(data)
    }
    
    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('hvacQuoteData'
            if (savedData) {
                const data = JSON.parse(savedData
                
                // Check if data is not too old (24 hours)
                const isDataFresh = (Date.now() - data.timestamp) < (24 * 60 * 60 * 1000
                
                if (isDataFresh) {
                    this.selectedPackage = data.selectedPackage;
                    this.selectedAdditionalFeatures = new Set(data.selectedAdditionalFeatures || []
                    this.selectedAddonServices = new Set(data.selectedAddonServices || []
                    this.totalPrice = data.totalPrice || 0;
                    
                    
                    return true;
                } else {
                    // Clear old data
                    localStorage.removeItem('hvacQuoteData'
                }
            }
        } catch (error) {
            localStorage.removeItem('hvacQuoteData'
        }
        return false;
    }
    
    clearLocalStorage() {
        localStorage.removeItem('hvacQuoteData'
    }
    

    

    

    
    showNotification(message, type = 'info') {
        // Create notification element safely without innerHTML
        const notification = document.createElement('div'
        notification.className = `notification notification-${type}`;
        
        const notificationContent = document.createElement('div'
        notificationContent.className = 'notification-content';
        
        const icon = document.createElement('i'
        const iconType = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
        icon.setAttribute('data-lucide', iconType
        
        const notificationText = document.createElement('div'
        notificationText.className = 'notification-text';
        // Handle multi-line messages safely
        const formattedMessage = message.replace(/\n/g, ' '
        notificationText.textContent = formattedMessage;
        
        // Assemble DOM safely
        notificationContent.appendChild(icon
        notificationContent.appendChild(notificationText
        notification.appendChild(notificationContent
        
        // Add to page
        document.body.appendChild(notification
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100
        
        // Remove after 5 seconds for error messages (longer for detailed errors)
        const duration = type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            notification.classList.remove('show'
            setTimeout(() => notification.remove(), 300
        }, duration
        
        // Initialize icons
        lucide.createIcons(
    }
    
    showLoadingState() {
        // Create loading overlay safely without innerHTML
        const loadingOverlay = document.createElement('div'
        loadingOverlay.className = 'loading-overlay';
        
        const loadingSpinner = document.createElement('div'
        loadingSpinner.className = 'loading-spinner';
        
        const icon = document.createElement('i'
        icon.setAttribute('data-lucide', 'loader-2'
        
        const paragraph = document.createElement('p'
        paragraph.textContent = 'Loading quote system...';
        
        // Assemble DOM safely
        loadingSpinner.appendChild(icon
        loadingSpinner.appendChild(paragraph
        loadingOverlay.appendChild(loadingSpinner
        
        document.body.appendChild(loadingOverlay
        
        // Initialize icons
        lucide.createIcons(
    }
    
    hideLoadingState() {
        const loadingOverlay = document.querySelector('.loading-overlay'
        if (loadingOverlay) {
            loadingOverlay.remove(
        }
    }
    
    showSkeletonLoading(containerId, type = 'card') {
        const container = document.getElementById(containerId
        if (!container) return;
        
        const skeletonTemplates = {
            card: `
                <div class="skeleton-card">
                    <div class="skeleton-header"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line short"></div>
                    </div>
                </div>
            `,
            grid: `
                <div class="skeleton-grid">
                    ${Array(6).fill('<div class="skeleton-card"></div>').join('')}
                </div>
            `,
            feature: `
                <div class="skeleton-card">
                    <div class="skeleton-header"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line medium"></div>
                        <div class="skeleton-line short"></div>
                    </div>
                </div>
            `
        };
        
        const skeleton = skeletonTemplates[type] || skeletonTemplates.card;
        container.innerHTML = skeleton;
    }
    
    clearSkeletonLoading(containerId) {
        const container = document.getElementById(containerId
        if (container) {
            const skeletonElements = container.querySelectorAll('.skeleton-card, .skeleton-grid'
            skeletonElements.forEach(element => element.remove()
        }
    }
    
    createFallbackData() {
        this.packages = [
            {
                id: 'hvac-appliance-website',
                name: 'HVAC & Appliance Repair Website',
                price: 1200,
                originalPrice: 1800,
                timeline: '18-24 days',
                description: 'Complete professional website solution for HVAC and appliance repair businesses',
                includedComponents: [
                    'Professional HVAC & Appliance Homepage',
                    'Comprehensive Service Pages',
                    'Emergency Service Management',
                    'Online Booking & Scheduling',
                    'Customer Reviews & Testimonials',
                    'Service Area Management',
                    'Advanced Local SEO',
                    'Social Media Integration',
                    'Analytics & Performance Tracking',
                    'Priority Support',
                    'Advanced HVAC Brand Support',
                    'Advanced Appliance Brand Support',
                    'Maintenance Programs',
                    'Installation Services',
                    'Commercial HVAC Support',
                    'Commercial Appliance Support',
                    'Mobile-Optimized Design',
                    'Contact Form & Phone Integration',
                    'Service Request System',
                    'Business Hours & Location',
                    'Service Request Forms'
                ],
                popular: true
            }
        ];
        
        this.features = { core: [], content: [], marketing: [], social: [], advanced: [], hvac: [], appliance: [] };
        this.addons = [];
        this.components = { pages: [], features: [], technical: [] };
        this.emergencyServices = [];
        this.serviceAreas = [];
        this.hvacFeatures = [];
        this.applianceFeatures = [];
        this.contactFeatures = [];
        
        // Use Virtual Renderer for progressive rendering
        this.virtualRenderer.queueRender(() => this.renderPackages(), 'high'
        this.virtualRenderer.queueRender(() => this.renderAdditionalFeatures(), 'normal'
        this.virtualRenderer.queueRender(() => this.renderAddonServices(), 'normal'
    }
    
    async init() {
        // Try to load saved data first
        const hasSavedData = this.loadFromLocalStorage(
        
        await this.loadData(
        this.setupEventListeners(
        
        // Auto-select the package if not already selected
        if (!this.selectedPackage && this.packages && this.packages.length > 0) {
            this.selectedPackage = this.packages[0].id;
            this.saveToLocalStorage(
        }
        
        // Set default selections if no saved data
        if (!hasSavedData) {
            this.saveToLocalStorage(
        }
        
        // If we had saved data, restore the UI state
        if (hasSavedData) {
            this.restoreUIState(
            this.showNotification('Your previous selections have been restored', 'info'
        }
        
        // Ensure all features are rendered with current selections
        this.virtualRenderer.queueRender(() => this.renderAdditionalFeatures(), 'normal'
        this.virtualRenderer.queueRender(() => this.renderAddonServices(), 'normal'
        
        // Multiple updates to ensure correct display
        this.updateSummary(
        
        // Force update after rendering
        setTimeout(() => {
            this.updateSummary(
            // Ensure base price is always shown
            const summaryTotalElement = document.getElementById('summaryTotal'
            if (summaryTotalElement) {
                const currentPrice = this.calculateTotalPrice(
                summaryTotalElement.textContent = `$${currentPrice.toLocaleString()}`;
            }
        }, 200
        
        // Additional safety check
        setTimeout(() => {
            this.updateSummary(
            const summaryTotalElement = document.getElementById('summaryTotal'
            if (summaryTotalElement) {
                const currentPrice = this.calculateTotalPrice(
                summaryTotalElement.textContent = `$${currentPrice.toLocaleString()}`;
            }
        }, 500
        
        // Final check after everything is loaded
        setTimeout(() => {
            this.updateSummary(
            this.updateGenerateButton(
        }, 1000
        
        // Continuous monitoring to ensure price persistence
        setInterval(() => {
            const summaryTotalElement = document.getElementById('summaryTotal'
            if (summaryTotalElement) {
                const currentPrice = this.calculateTotalPrice(
                const displayedPrice = summaryTotalElement.textContent.replace(/[$,]/g, ''
                const expectedPrice = currentPrice.toString(
                
                if (displayedPrice !== expectedPrice) {
                    
                    summaryTotalElement.textContent = `$${currentPrice.toLocaleString()}`;
                    this.saveToLocalStorage(
                }
            }
        }, 2000 // Check every 2 seconds
        
        // Set up mutation observer to watch for changes to the summary element
        const summaryTotalElement = document.getElementById('summaryTotal'
        if (summaryTotalElement && window.MutationObserver) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        const currentPrice = this.calculateTotalPrice(
                        const displayedPrice = summaryTotalElement.textContent.replace(/[$,]/g, ''
                        const expectedPrice = currentPrice.toString(
                        
                        if (displayedPrice !== expectedPrice) {
                            
                            summaryTotalElement.textContent = `$${currentPrice.toLocaleString()}`;
                            this.saveToLocalStorage(
                        }
                    }
                }
            }
            
            observer.observe(summaryTotalElement, {
                childList: true,
                characterData: true,
                subtree: true
            }
        }
    }
    
    restoreUIState() {
        // Restore package selection
        if (this.selectedPackage) {
            const packageCard = document.querySelector(`[data-package-id="${this.selectedPackage}"]`
            if (packageCard) {
                packageCard.classList.add('selected'
            }
        }
        
        // Restore additional feature selections
        if (this.selectedAdditionalFeatures && this.selectedAdditionalFeatures.size > 0) {
            this.selectedAdditionalFeatures.forEach(featureId => {
            const featureCard = document.querySelector(`[data-feature-id="${featureId}"]`
            if (featureCard) {
                featureCard.classList.add('selected'
            }
        }
        }
        
        // Restore addon service selections
        if (this.selectedAddonServices && this.selectedAddonServices.size > 0) {
            this.selectedAddonServices.forEach(serviceId => {
                const serviceCard = document.querySelector(`[data-service-id="${serviceId}"]`
                if (serviceCard) {
                    serviceCard.classList.add('selected'
                }
            }
        }
        
        // Update summary after restoring UI state
        this.updateSummary(
        this.updateGenerateButton(
    }
    
    async loadData() {
        try {
            
            
            // Show loading state
            this.showLoadingState(
            
            // Load all data in parallel
            const [packages, additionalFeatures, addonServices] = await Promise.all([
                fetch('/api/quote/packages').then(res => {
                    if (!res.ok) throw new Error(`Failed to load packages: ${res.status}`
                    return res.json(
                }),
                fetch('/api/quote/additional-features').then(res => {
                    if (!res.ok) throw new Error(`Failed to load additional features: ${res.status}`
                    return res.json(
                }),
                fetch('/api/quote/addon-services').then(res => {
                    if (!res.ok) throw new Error(`Failed to load addon services: ${res.status}`
                    return res.json(
                })
            ]
            
                    
            
            this.packages = packages;
            this.additionalFeatures = additionalFeatures;
            this.addonServices = addonServices;
            
            
            
            // Use Virtual Renderer for progressive rendering
            this.virtualRenderer.queueRender(() => this.renderPackages(), 'high'
            this.virtualRenderer.queueRender(() => this.renderAdditionalFeatures(), 'normal'
            this.virtualRenderer.queueRender(() => this.renderAddonServices(), 'normal'
            
            // Hide loading state
            this.hideLoadingState(
            
            // Show success notification
            this.showNotification('Quote system loaded successfully!', 'success'
            
        } catch (error) {
            // Hide loading state
            this.hideLoadingState(
            
            // Show error notification
            this.showNotification(`Failed to load data: ${error.message}`, 'error'
            
            // Fallback: Create some basic packages if API fails
            
            this.createFallbackData(
        }
    }
    
    setupEventListeners() {
        // Emergency service selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.emergency-card')) {
                const card = e.target.closest('.emergency-card'
                this.selectEmergencyService(card
            }
        }
        
        // Service area selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.area-card')) {
                const card = e.target.closest('.area-card'
                this.selectServiceArea(card
            }
        }
        
        // HVAC features selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('#hvacFeaturesGrid .feature-card')) {
                const card = e.target.closest('.feature-card'
                this.toggleHvacFeature(card
            }
        }
        
        // Appliance features selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('#applianceFeaturesGrid .feature-card')) {
                const card = e.target.closest('.feature-card'
                this.toggleApplianceFeature(card
            }
        }
        
        // Contact features selection - handled by individual click listeners in renderContactFeatures()
        
        // Main features selection (for features outside of HVAC/Appliance grids)
        document.addEventListener('click', (e) => {
            if (e.target.closest('#featureGrid .feature-card')) {
                const card = e.target.closest('.feature-card'
                const isIncluded = card.classList.contains('included-in-package'
                if (!isIncluded) {
                    this.toggleFeature(card.dataset.featureId, card
                }
            }
        }
        
        // Addons selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.addon-card')) {
                const card = e.target.closest('.addon-card'
                this.toggleAddon(card.dataset.addonId, card
            }
        }
        
        // Components selection - handled by individual click listeners in renderComponents()
        
        // Service area dropdown change
        const serviceAreaSelect = document.getElementById('customerServiceArea'
        if (serviceAreaSelect) {
            serviceAreaSelect.addEventListener('change', (e) => {
                this.selectedServiceArea = e.target.value;
                this.updateSummary(
            }
        }
        
        // Form field validation listeners
        const formFields = ['customerName', 'customerEmail', 'customerPhone', 'customerCompany', 'customerLocation', 'customerMessage'];
        formFields.forEach(fieldId => {
            const field = document.getElementById(fieldId
            if (field) {
                field.addEventListener('input', () => {
                    this.updateGenerateButton(
                }
                
                field.addEventListener('blur', () => {
                    this.updateGenerateButton(
                }
            }
        }
        
        // Initialize searchable country selector
        this.initializeCountrySelector(
    }
    
    initializeCountrySelector() {
        const trigger = document.getElementById('countrySelectTrigger'
        const dropdown = document.getElementById('countrySelectDropdown'
        const searchInput = document.getElementById('countrySearch'
        const countryList = document.getElementById('countryList'
        const selectedFlag = document.getElementById('selectedFlag'
        const selectedCountryCode = document.getElementById('selectedCountryCode'
        const chevronIcon = document.getElementById('chevronIcon'
        const hiddenSelect = document.getElementById('countryCode'
        
        // Country data - Complete list of all countries in the world
        const countries = [
            { code: '+93', flag: 'af', name: 'Afghanistan' },
            { code: '+355', flag: 'al', name: 'Albania' },
            { code: '+213', flag: 'dz', name: 'Algeria' },
            { code: '+376', flag: 'ad', name: 'Andorra' },
            { code: '+244', flag: 'ao', name: 'Angola' },
            { code: '+1-268', flag: 'ag', name: 'Antigua and Barbuda' },
            { code: '+54', flag: 'ar', name: 'Argentina' },
            { code: '+374', flag: 'am', name: 'Armenia' },
            { code: '+61', flag: 'au', name: 'Australia' },
            { code: '+43', flag: 'at', name: 'Austria' },
            { code: '+994', flag: 'az', name: 'Azerbaijan' },
            { code: '+1-242', flag: 'bs', name: 'Bahamas' },
            { code: '+973', flag: 'bh', name: 'Bahrain' },
            { code: '+880', flag: 'bd', name: 'Bangladesh' },
            { code: '+1-246', flag: 'bb', name: 'Barbados' },
            { code: '+375', flag: 'by', name: 'Belarus' },
            { code: '+32', flag: 'be', name: 'Belgium' },
            { code: '+501', flag: 'bz', name: 'Belize' },
            { code: '+229', flag: 'bj', name: 'Benin' },
            { code: '+975', flag: 'bt', name: 'Bhutan' },
            { code: '+591', flag: 'bo', name: 'Bolivia' },
            { code: '+387', flag: 'ba', name: 'Bosnia and Herzegovina' },
            { code: '+267', flag: 'bw', name: 'Botswana' },
            { code: '+55', flag: 'br', name: 'Brazil' },
            { code: '+673', flag: 'bn', name: 'Brunei' },
            { code: '+359', flag: 'bg', name: 'Bulgaria' },
            { code: '+226', flag: 'bf', name: 'Burkina Faso' },
            { code: '+257', flag: 'bi', name: 'Burundi' },
            { code: '+855', flag: 'kh', name: 'Cambodia' },
            { code: '+237', flag: 'cm', name: 'Cameroon' },
            { code: '+1', flag: 'ca', name: 'Canada' },
            { code: '+238', flag: 'cv', name: 'Cape Verde' },
            { code: '+236', flag: 'cf', name: 'Central African Republic' },
            { code: '+235', flag: 'td', name: 'Chad' },
            { code: '+56', flag: 'cl', name: 'Chile' },
            { code: '+86', flag: 'cn', name: 'China' },
            { code: '+57', flag: 'co', name: 'Colombia' },
            { code: '+269', flag: 'km', name: 'Comoros' },
            { code: '+242', flag: 'cg', name: 'Republic of the Congo' },
            { code: '+243', flag: 'cd', name: 'Democratic Republic of the Congo' },
            { code: '+506', flag: 'cr', name: 'Costa Rica' },
            { code: '+385', flag: 'hr', name: 'Croatia' },
            { code: '+53', flag: 'cu', name: 'Cuba' },
            { code: '+357', flag: 'cy', name: 'Cyprus' },
            { code: '+420', flag: 'cz', name: 'Czech Republic' },
            { code: '+45', flag: 'dk', name: 'Denmark' },
            { code: '+253', flag: 'dj', name: 'Djibouti' },
            { code: '+1-809', flag: 'do', name: 'Dominican Republic' },
            { code: '+670', flag: 'tl', name: 'East Timor' },
            { code: '+593', flag: 'ec', name: 'Ecuador' },
            { code: '+20', flag: 'eg', name: 'Egypt' },
            { code: '+503', flag: 'sv', name: 'El Salvador' },
            { code: '+240', flag: 'gq', name: 'Equatorial Guinea' },
            { code: '+291', flag: 'er', name: 'Eritrea' },
            { code: '+372', flag: 'ee', name: 'Estonia' },
            { code: '+268', flag: 'sz', name: 'Eswatini' },
            { code: '+251', flag: 'et', name: 'Ethiopia' },
            { code: '+679', flag: 'fj', name: 'Fiji' },
            { code: '+358', flag: 'fi', name: 'Finland' },
            { code: '+33', flag: 'fr', name: 'France' },
            { code: '+241', flag: 'ga', name: 'Gabon' },
            { code: '+220', flag: 'gm', name: 'Gambia' },
            { code: '+995', flag: 'ge', name: 'Georgia' },
            { code: '+49', flag: 'de', name: 'Germany' },
            { code: '+233', flag: 'gh', name: 'Ghana' },
            { code: '+30', flag: 'gr', name: 'Greece' },
            { code: '+1-473', flag: 'gd', name: 'Grenada' },
            { code: '+502', flag: 'gt', name: 'Guatemala' },
            { code: '+224', flag: 'gn', name: 'Guinea' },
            { code: '+245', flag: 'gw', name: 'Guinea-Bissau' },
            { code: '+592', flag: 'gy', name: 'Guyana' },
            { code: '+509', flag: 'ht', name: 'Haiti' },
            { code: '+504', flag: 'hn', name: 'Honduras' },
            { code: '+852', flag: 'hk', name: 'Hong Kong' },
            { code: '+36', flag: 'hu', name: 'Hungary' },
            { code: '+354', flag: 'is', name: 'Iceland' },
            { code: '+91', flag: 'in', name: 'India' },
            { code: '+62', flag: 'id', name: 'Indonesia' },
            { code: '+98', flag: 'ir', name: 'Iran' },
            { code: '+964', flag: 'iq', name: 'Iraq' },
            { code: '+353', flag: 'ie', name: 'Ireland' },
            { code: '+972', flag: 'il', name: 'Israel' },
            { code: '+39', flag: 'it', name: 'Italy' },
            { code: '+1-876', flag: 'jm', name: 'Jamaica' },
            { code: '+81', flag: 'jp', name: 'Japan' },
            { code: '+962', flag: 'jo', name: 'Jordan' },
            { code: '+7', flag: 'kz', name: 'Kazakhstan' },
            { code: '+254', flag: 'ke', name: 'Kenya' },
            { code: '+686', flag: 'ki', name: 'Kiribati' },
            { code: '+850', flag: 'kp', name: 'North Korea' },
            { code: '+82', flag: 'kr', name: 'South Korea' },
            { code: '+965', flag: 'kw', name: 'Kuwait' },
            { code: '+996', flag: 'kg', name: 'Kyrgyzstan' },
            { code: '+856', flag: 'la', name: 'Laos' },
            { code: '+371', flag: 'lv', name: 'Latvia' },
            { code: '+961', flag: 'lb', name: 'Lebanon' },
            { code: '+266', flag: 'ls', name: 'Lesotho' },
            { code: '+231', flag: 'lr', name: 'Liberia' },
            { code: '+218', flag: 'ly', name: 'Libya' },
            { code: '+423', flag: 'li', name: 'Liechtenstein' },
            { code: '+370', flag: 'lt', name: 'Lithuania' },
            { code: '+352', flag: 'lu', name: 'Luxembourg' },
            { code: '+853', flag: 'mo', name: 'Macau' },
            { code: '+261', flag: 'mg', name: 'Madagascar' },
            { code: '+265', flag: 'mw', name: 'Malawi' },
            { code: '+60', flag: 'my', name: 'Malaysia' },
            { code: '+960', flag: 'mv', name: 'Maldives' },
            { code: '+223', flag: 'ml', name: 'Mali' },
            { code: '+356', flag: 'mt', name: 'Malta' },
            { code: '+692', flag: 'mh', name: 'Marshall Islands' },
            { code: '+222', flag: 'mr', name: 'Mauritania' },
            { code: '+230', flag: 'mu', name: 'Mauritius' },
            { code: '+52', flag: 'mx', name: 'Mexico' },
            { code: '+691', flag: 'fm', name: 'Micronesia' },
            { code: '+373', flag: 'md', name: 'Moldova' },
            { code: '+377', flag: 'mc', name: 'Monaco' },
            { code: '+976', flag: 'mn', name: 'Mongolia' },
            { code: '+382', flag: 'me', name: 'Montenegro' },
            { code: '+212', flag: 'ma', name: 'Morocco' },
            { code: '+258', flag: 'mz', name: 'Mozambique' },
            { code: '+95', flag: 'mm', name: 'Myanmar' },
            { code: '+264', flag: 'na', name: 'Namibia' },
            { code: '+674', flag: 'nr', name: 'Nauru' },
            { code: '+977', flag: 'np', name: 'Nepal' },
            { code: '+31', flag: 'nl', name: 'Netherlands' },
            { code: '+64', flag: 'nz', name: 'New Zealand' },
            { code: '+505', flag: 'ni', name: 'Nicaragua' },
            { code: '+227', flag: 'ne', name: 'Niger' },
            { code: '+234', flag: 'ng', name: 'Nigeria' },
            { code: '+47', flag: 'no', name: 'Norway' },
            { code: '+968', flag: 'om', name: 'Oman' },
            { code: '+92', flag: 'pk', name: 'Pakistan' },
            { code: '+680', flag: 'pw', name: 'Palau' },
            { code: '+970', flag: 'ps', name: 'Palestine' },
            { code: '+507', flag: 'pa', name: 'Panama' },
            { code: '+675', flag: 'pg', name: 'Papua New Guinea' },
            { code: '+595', flag: 'py', name: 'Paraguay' },
            { code: '+51', flag: 'pe', name: 'Peru' },
            { code: '+63', flag: 'ph', name: 'Philippines' },
            { code: '+48', flag: 'pl', name: 'Poland' },
            { code: '+351', flag: 'pt', name: 'Portugal' },
            { code: '+974', flag: 'qa', name: 'Qatar' },
            { code: '+40', flag: 'ro', name: 'Romania' },
            { code: '+7', flag: 'ru', name: 'Russia' },
            { code: '+250', flag: 'rw', name: 'Rwanda' },
            { code: '+966', flag: 'sa', name: 'Saudi Arabia' },
            { code: '+221', flag: 'sn', name: 'Senegal' },
            { code: '+381', flag: 'rs', name: 'Serbia' },
            { code: '+248', flag: 'sc', name: 'Seychelles' },
            { code: '+232', flag: 'sl', name: 'Sierra Leone' },
            { code: '+65', flag: 'sg', name: 'Singapore' },
            { code: '+421', flag: 'sk', name: 'Slovakia' },
            { code: '+386', flag: 'si', name: 'Slovenia' },
            { code: '+677', flag: 'sb', name: 'Solomon Islands' },
            { code: '+252', flag: 'so', name: 'Somalia' },
            { code: '+27', flag: 'za', name: 'South Africa' },
            { code: '+34', flag: 'es', name: 'Spain' },
            { code: '+94', flag: 'lk', name: 'Sri Lanka' },
            { code: '+249', flag: 'sd', name: 'Sudan' },
            { code: '+597', flag: 'sr', name: 'Suriname' },
            { code: '+46', flag: 'se', name: 'Sweden' },
            { code: '+41', flag: 'ch', name: 'Switzerland' },
            { code: '+963', flag: 'sy', name: 'Syria' },
            { code: '+886', flag: 'tw', name: 'Taiwan' },
            { code: '+992', flag: 'tj', name: 'Tajikistan' },
            { code: '+255', flag: 'tz', name: 'Tanzania' },
            { code: '+66', flag: 'th', name: 'Thailand' },
            { code: '+228', flag: 'tg', name: 'Togo' },
            { code: '+676', flag: 'to', name: 'Tonga' },
            { code: '+1-868', flag: 'tt', name: 'Trinidad and Tobago' },
            { code: '+216', flag: 'tn', name: 'Tunisia' },
            { code: '+90', flag: 'tr', name: 'Turkey' },
            { code: '+993', flag: 'tm', name: 'Turkmenistan' },
            { code: '+256', flag: 'ug', name: 'Uganda' },
            { code: '+380', flag: 'ua', name: 'Ukraine' },
            { code: '+971', flag: 'ae', name: 'United Arab Emirates' },
            { code: '+44', flag: 'gb', name: 'United Kingdom' },
            { code: '+1', flag: 'us', name: 'United States' },
            { code: '+598', flag: 'uy', name: 'Uruguay' },
            { code: '+998', flag: 'uz', name: 'Uzbekistan' },
            { code: '+678', flag: 'vu', name: 'Vanuatu' },
            { code: '+58', flag: 've', name: 'Venezuela' },
            { code: '+84', flag: 'vn', name: 'Vietnam' },
            { code: '+967', flag: 'ye', name: 'Yemen' },
            { code: '+260', flag: 'zm', name: 'Zambia' },
            { code: '+263', flag: 'zw', name: 'Zimbabwe' }
        ];
        
        // Render country list
        function renderCountries(countriesToRender = window.quoteSystem.countries) {
            countryList.innerHTML = countriesToRender.map(country => `
                <div class="country-item" data-code="${country.code}" data-flag="${country.flag}">
                    <img src="https://flagcdn.com/w20/${country.flag}.png" alt="${country.name}" loading="lazy">
                    <span class="country-code">${country.code}</span>
                </div>
            `).join(''
        }
        
        // Initialize with all countries
        renderCountries(
        
        // Toggle dropdown
        trigger.addEventListener('click', () => {
            const isOpen = !dropdown.hidden;
            dropdown.hidden = isOpen;
            trigger.classList.toggle('active', !isOpen
            
            if (!isOpen) {
                searchInput.focus(
            }
        }
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase(
            const filteredCountries = window.quoteSystem.countries.filter(country => 
                country.name.toLowerCase().includes(searchTerm) ||
                country.code.includes(searchTerm) ||
                country.flag.toLowerCase().includes(searchTerm)

            renderCountries(filteredCountries
        }
        
        // Select country
        countryList.addEventListener('click', (e) => {
            const countryItem = e.target.closest('.country-item'
            if (!countryItem) return;
            
            const code = countryItem.dataset.code;
            const flag = countryItem.dataset.flag;
            const name = window.quoteSystem.countries.find(c => c.code === code)?.name || '';
            
            // Update display
            selectedFlag.src = `https://flagcdn.com/w20/${flag}.png`;
            selectedFlag.alt = name;
            selectedCountryCode.textContent = code;
            
            // Update hidden select
            hiddenSelect.value = code;
            hiddenSelect.dispatchEvent(new Event('change')
            
            // Close dropdown
            dropdown.hidden = true;
            trigger.classList.remove('active'
            searchInput.value = '';
            renderCountries(
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.hidden = true;
                trigger.classList.remove('active'
            }
        }
        
        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdown.hidden = true;
                trigger.classList.remove('active'
            }
        }
    }
    
    renderPackages() {
        
        const packageFeaturesGrid = document.getElementById('packageFeaturesGrid'
        
        if (!packageFeaturesGrid) {
            return;
        }
        
        
        
        if (!this.packages || this.packages.length === 0) {
            return;
        }

        const pkg = this.packages[0]; // Get the single package
        const includedComponents = pkg.includedFeatures || pkg.includedComponents || pkg.features || [];

        const featuresHTML = includedComponents.map(component => `
            <div class="component-item">
                <i data-lucide="check"></i>
                <span>${component}</span>
                    </div>
        `).join(''
        
        
        packageFeaturesGrid.innerHTML = featuresHTML;
        
        // Auto-select the package
        this.selectedPackage = pkg.id;
        this.saveToLocalStorage(
        
        // Initialize Lucide icons
        lucide.createIcons(
        
        
    }
    
    renderEmergencyServices() {
        const emergencyGrid = document.getElementById('emergencyGrid'
        if (!emergencyGrid) {
            return;
        }
        
        emergencyGrid.innerHTML = this.emergencyServices.map(service => {
            // Check if this emergency service is included in the package
            const isIncluded = this.isComponentIncluded(service.name
            const isSelected = this.selectedEmergency === service.id;
            
            return `
                <div class="emergency-card ${service.popular ? 'featured' : ''} ${isIncluded ? 'included-in-package' : ''} ${isSelected ? 'selected' : ''}" data-emergency-id="${service.id}">
                    <div class="emergency-header">
                        <i data-lucide="clock"></i>
                        <h3>${service.name}</h3>
                        ${service.popular ? '<span class="badge">Most Popular</span>' : ''}
                    </div>
                    <div class="emergency-details">
                        <p>${service.responseTime} response time</p>
                        ${service.features.map(feature => `<p>${feature}</p>`).join('')}
                    </div>
                    <div class="emergency-price">${isIncluded ? 'Included' : `$${service.price}`}</div>
                    ${isIncluded ? '<div class="included-badge">Included</div>' : 
                      isSelected ? '<div class="selected-badge">Selected</div>' : ''}
                </div>
            `;
        }).join(''
        
        // Add click listeners for emergency services
        const emergencyCards = emergencyGrid.querySelectorAll('.emergency-card'
        emergencyCards.forEach(card => {
            const emergencyId = card.dataset.emergencyId;
            
            // Add click listener to the card itself
            card.addEventListener('click', (e) => {
                e.preventDefault(
                e.stopPropagation(
                
                // Don't allow toggling if emergency service is included in package
                const service = this.emergencyServices.find(s => s.id === emergencyId
                if (service && this.isComponentIncluded(service.name)) {
                    this.showNotification('This emergency service is already included in your package!', 'info'
                    return;
                }
                
                // Add visual feedback
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150
                
                this.selectEmergencyService(card
            }
            
            // Also add click listeners to all child elements to ensure the entire card is clickable
            card.querySelectorAll('*').forEach(child => {
                child.addEventListener('click', (e) => {
                    e.preventDefault(
                    e.stopPropagation(
                    
                    // Don't allow toggling if emergency service is included in package
                    const service = this.emergencyServices.find(s => s.id === emergencyId
                    if (service && this.isComponentIncluded(service.name)) {
                        this.showNotification('This emergency service is already included in your package!', 'info'
                        return;
                    }
                    
                    this.selectEmergencyService(card
                }
            }
        }
        
        // Initialize Lucide icons
        lucide.createIcons(
    }
    
    renderServiceAreas() {
        const serviceAreaGrid = document.getElementById('serviceAreaGrid'
        if (!serviceAreaGrid) return;
        
        // Get selected package components to check if service areas are included
        const selectedPackageComponents = this.selectedPackage ? 
            this.packages.find(p => p.id === this.selectedPackage)?.includedComponents || [] : [];
        
        // Check if service area management is included in the package
        const hasServiceAreaManagement = selectedPackageComponents.some(pkgComponent => 
            pkgComponent.toLowerCase().includes('service area') ||
            pkgComponent.toLowerCase().includes('coverage map')

        
        serviceAreaGrid.innerHTML = this.serviceAreas.map(area => {
            // Check if this service area is included in the package
            const isIncluded = this.isComponentIncluded(area.name
            const isSelected = this.selectedServiceArea === area.id;
            
            return `
                <div class="area-card ${isIncluded ? 'included-in-package' : ''} ${isSelected ? 'selected' : ''}" data-area-id="${area.id}">
                    <div class="area-header">
                        <h3>${area.name}</h3>
                        <span class="area-radius">${area.radius}</span>
                    </div>
                    <div class="area-details">
                        <p>${area.responseTime} emergency response</p>
                        ${area.features.map(feature => `<p>${feature}</p>`).join('')}
                    </div>
                    <div class="area-price">${isIncluded ? 'Included' : `+$${area.price}`}</div>
                    ${isIncluded ? '<div class="included-badge">Included</div>' : 
                      isSelected ? '<div class="selected-badge">Selected</div>' : ''}
                </div>
            `;
        }).join(''
        
        // Add click listeners for service areas
        serviceAreaGrid.querySelectorAll('.area-card').forEach(card => {
            const areaId = card.dataset.areaId;
            
            // Ensure all service areas are selectable for upgrading
            if (areaId === 'extended-zone' || areaId === 'premium-zone') {
                card.style.cursor = 'pointer';
                card.classList.remove('included-in-package'
            }
            
            // Add click listener to the card itself
            card.addEventListener('click', (e) => {
                e.preventDefault(
                e.stopPropagation(
                
                // Don't allow toggling if service area is included in package
                const area = this.serviceAreas.find(a => a.id === areaId
                if (area && this.isComponentIncluded(area.name)) {
                    this.showNotification('This service area is already included in your package!', 'info'
                    return;
                }
                
                this.selectServiceArea(card
            }
            
            // Also add click listeners to all child elements to ensure the entire card is clickable
            card.querySelectorAll('*').forEach(child => {
                child.addEventListener('click', (e) => {
                    e.preventDefault(
                    e.stopPropagation(
                    
                    // Don't allow toggling if service area is included in package
                    const area = this.serviceAreas.find(a => a.id === areaId
                    if (area && this.isComponentIncluded(area.name)) {
                        this.showNotification('This service area is already included in your package!', 'info'
                        return;
                    }
                    
                    this.selectServiceArea(card
                }
            }
        }
    }
    
    renderHvacFeatures() {
        const hvacGrid = document.getElementById('hvacFeaturesGrid'
        if (!hvacGrid) {
            return;
        }
        
        // Get HVAC features from dedicated API endpoint
        const hvacFeatures = this.hvacFeatures || [];
        
        hvacGrid.innerHTML = hvacFeatures.map(feature => {
            const isSelected = this.selectedHvacFeatures.has(feature.id
            const isIncluded = this.isComponentIncluded(feature.name
            const displayPrice = isIncluded ? 0 : feature.price;
            
            return `
                <div class="feature-card hvac-feature-card ${isSelected ? 'selected' : ''} ${isIncluded ? 'included-in-package' : ''}" data-feature-id="${feature.id}">
                    <div class="feature-header">
                        <h4>${feature.name}</h4>
                        <span class="feature-price">$${displayPrice}</span>
                    </div>
                    <p>${feature.description}</p>
                    ${feature.brands ? `
                        <div class="feature-brands">
                            ${feature.brands.map(brand => `<span class="brand-tag">${brand}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${isIncluded ? '<div class="included-badge">Included</div>' : 
                      isSelected ? '<div class="selected-badge">Selected</div>' : ''}
                </div>
            `;
        }).join(''
        
        // Add click listeners for HVAC features
        hvacGrid.querySelectorAll('.hvac-feature-card').forEach(card => {
            const featureId = card.dataset.featureId;
            
            // Add click listener to the card itself
            card.addEventListener('click', (e) => {
                e.preventDefault(
                e.stopPropagation(
                
                // Don't allow toggling if feature is included in package
                const feature = this.hvacFeatures?.find(f => f.id === featureId
                if (feature && this.isComponentIncluded(feature.name)) {
                    this.showNotification('This feature is already included in your package!', 'info'
                    return;
                }
                
                this.toggleHvacFeature(card
            }
            
            // Also add click listeners to all child elements to ensure the entire card is clickable
            card.querySelectorAll('*').forEach(child => {
                child.addEventListener('click', (e) => {
                    e.preventDefault(
                    e.stopPropagation(
                    
                    // Don't allow toggling if feature is included in package
                    const feature = this.hvacFeatures?.find(f => f.id === featureId
                    if (feature && this.isComponentIncluded(feature.name)) {
                        this.showNotification('This feature is already included in your package!', 'info'
                        return;
                    }
                    
                    this.toggleHvacFeature(card
                }
            }
        }
        
        // Initialize Lucide icons
        lucide.createIcons(
    }
    
    renderApplianceFeatures() {
        const applianceGrid = document.getElementById('applianceFeaturesGrid'
        if (!applianceGrid) {
            return;
        }
        
        // Get Appliance features from dedicated API endpoint
        const applianceFeatures = this.applianceFeatures || [];
        
        applianceGrid.innerHTML = applianceFeatures.map(feature => {
            const isSelected = this.selectedApplianceFeatures.has(feature.id
            const isIncluded = this.isComponentIncluded(feature.name
            const displayPrice = isIncluded ? 0 : feature.price;
            
            return `
                <div class="feature-card appliance-feature-card ${isSelected ? 'selected' : ''} ${isIncluded ? 'included-in-package' : ''}" data-feature-id="${feature.id}">
                    <div class="feature-header">
                        <h4>${feature.name}</h4>
                        <span class="feature-price">$${displayPrice}</span>
                    </div>
                    <p>${feature.description}</p>
                    ${feature.brands ? `
                        <div class="feature-brands">
                            ${feature.brands.map(brand => `<span class="brand-tag">${brand}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${isIncluded ? '<div class="included-badge">Included</div>' : 
                      isSelected ? '<div class="selected-badge">Selected</div>' : ''}
                </div>
            `;
        }).join(''
        
        // Add click listeners for appliance features
        applianceGrid.querySelectorAll('.appliance-feature-card').forEach(card => {
            const featureId = card.dataset.featureId;
            
            // Add click listener to the card itself
            card.addEventListener('click', (e) => {
                e.preventDefault(
                e.stopPropagation(
                
                // Don't allow toggling if feature is included in package
                const feature = this.applianceFeatures?.find(f => f.id === featureId
                if (feature && this.isComponentIncluded(feature.name)) {
                    this.showNotification('This feature is already included in your package!', 'info'
                    return;
                }
                
                this.toggleApplianceFeature(card
            }
            
            // Also add click listeners to all child elements to ensure the entire card is clickable
            card.querySelectorAll('*').forEach(child => {
                child.addEventListener('click', (e) => {
                    e.preventDefault(
                    e.stopPropagation(
                    
                    // Don't allow toggling if feature is included in package
                    const feature = this.applianceFeatures?.find(f => f.id === featureId
                    if (feature && this.isComponentIncluded(feature.name)) {
                        this.showNotification('This feature is already included in your package!', 'info'
                        return;
                    }
                    
                    this.toggleApplianceFeature(card
                }
            }
        }
        
        // Initialize Lucide icons
        lucide.createIcons(
    }
    
    renderContactFeatures() {
        const contactGrid = document.querySelector('.contact-features-grid'
        if (!contactGrid) {
            return;
        }

        
        if (!this.contactFeatures || this.contactFeatures.length === 0) {
            contactGrid.innerHTML = '<p>No contact features available</p>';
            return;
        }
        
        contactGrid.innerHTML = this.contactFeatures.map(feature => {
            const isSelected = this.selectedContactFeatures.has(feature.id
            const isIncluded = this.isComponentIncluded(feature.name
            const displayPrice = isIncluded ? 0 : feature.price;
            return `
                <div class="contact-feature-card ${isSelected ? 'selected' : ''} ${isIncluded ? 'included-in-package' : ''}" data-feature-id="${feature.id}">
                <div class="contact-feature-header">
                    <i data-lucide="phone"></i>
                    <h4>${feature.name}</h4>
                </div>
                <p>${feature.description}</p>
                <div class="contact-feature-price">$${displayPrice}</div>
                    ${isIncluded ? '<div class="included-badge">Included</div>' : 
                      isSelected ? '<div class="selected-badge">Selected</div>' : ''}
            </div>
            `;
        }).join(''
        
        // Add click listeners
        const contactCards = contactGrid.querySelectorAll('.contact-feature-card'
        contactCards.forEach(card => {
            const featureId = card.dataset.featureId;
            const isIncluded = card.classList.contains('included-in-package'
            // Add click listener to the entire card
            card.addEventListener('click', (e) => {
                e.preventDefault(
                e.stopPropagation(
                
                // Don't allow toggling if feature is included in package
                if (isIncluded) {
                    this.showNotification('This feature is already included in your package!', 'info'
                    return;
                }
                
                this.toggleContactFeature(card
            }
            
            // Also add click listeners to child elements to ensure clicks work
            card.querySelectorAll('*').forEach(child => {
                child.addEventListener('click', (e) => {
                    e.stopPropagation( // Prevent bubbling
                    // Don't allow toggling if feature is included in package
                    if (isIncluded) {
                        this.showNotification('This feature is already included in your package!', 'info'
                        return;
                    }
                    
                    this.toggleContactFeature(card
                }
            }
        }
        
        // Initialize Lucide icons
        lucide.createIcons(
    }
    
    renderAdditionalFeatures() {
        const additionalFeaturesGrid = document.getElementById('additionalFeaturesGrid'
        if (!additionalFeaturesGrid) {
            return;
        }
        
        if (!this.additionalFeatures || this.additionalFeatures.length === 0) {
            additionalFeaturesGrid.innerHTML = '<p class="no-features">No additional features available</p>';
            return;
        }
        
        const featuresHTML = this.additionalFeatures.map(feature => {
            const isSelected = this.selectedAdditionalFeatures.has(feature.id
            const isIncluded = this.isComponentIncluded(feature.name
            const displayPrice = isIncluded ? 0 : feature.price;
            
            return `
                <div class="feature-card ${isSelected ? 'selected' : ''} ${isIncluded ? 'included-in-package' : ''}" data-feature-id="${feature.id}">
                                    <div class="feature-header">
                        <i data-lucide="${feature.icon || 'settings'}" aria-hidden="true"></i>
                                        <h4>${feature.name}</h4>
                                    </div>
                                    <p>${feature.description}</p>
                                    <div class="feature-timeline">
                                        <i data-lucide="clock" aria-hidden="true"></i>
                                        <span>${feature.timeline || '5-7 days'}</span>
                                </div>
                                    <div class="feature-footer">
                        <span class="feature-price">$${displayPrice}</span>
                    ${isIncluded ? '<div class="included-badge">Included</div>' : 
                      isSelected ? '<div class="selected-badge">Selected</div>' : ''}
                    </div>
                </div>
            `;
        }).join(''
        
        additionalFeaturesGrid.innerHTML = featuresHTML;
        
        // Add click listeners
        additionalFeaturesGrid.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', () => this.toggleAdditionalFeature(card)
        }
        
        // Update Lucide icons
        lucide.createIcons(
    }
    
    renderFeatureCategory(gridId, features, categoryName) {
        const featureGrid = document.getElementById(gridId
        if (!featureGrid) {
            return;
        }
        
        if (!features || features.length === 0) {
            } available`
            featureGrid.innerHTML = `<div class="no-features"><i data-lucide="info"></i><p>No ${categoryName.toLowerCase()} available</p></div>`;
            return;
        }
        
        featureGrid.innerHTML = features.map(feature => {
            const isSelected = this.selectedAdditionalFeatures.has(feature.id
            const isIncluded = this.isComponentIncluded(feature.name
            const displayPrice = isIncluded ? 0 : feature.price;
            return `
                <div class="feature-card ${isSelected ? 'selected' : ''} ${isIncluded ? 'included-in-package' : ''}" data-feature-id="${feature.id}">
                                    <div class="feature-header">
                                        <h4>${feature.name}</h4>
                    </div>
                                    <p>${feature.description}</p>
                                    <div class="feature-footer">
                        <span class="feature-price">$${displayPrice}</span>
                    ${isIncluded ? '<div class="included-badge">Included</div>' : 
                      isSelected ? '<div class="selected-badge">Selected</div>' : ''}
                                    </div>
                </div>
            `;
        }).join(''
        
        // Add click listeners for features
        featureGrid.querySelectorAll('.feature-card').forEach(card => {
            const featureId = card.dataset.featureId;
            
            // Add click listener to the card itself
            card.addEventListener('click', (e) => {
                e.preventDefault(
                e.stopPropagation(
                
                // Don't allow toggling if feature is included in package
                const feature = features.find(f => f.id === featureId
                if (feature && this.isComponentIncluded(feature.name)) {
                    this.showNotification('This feature is already included in your package!', 'info'
                    return;
                }
                
                this.toggleFeature(card
            }
            
            // Also add click listeners to all child elements to ensure the entire card is clickable
            card.querySelectorAll('*').forEach(child => {
                child.addEventListener('click', (e) => {
                    e.preventDefault(
                    e.stopPropagation(
                    // Don't allow toggling if feature is included in package
                    const feature = features.find(f => f.id === featureId
                    if (feature && this.isComponentIncluded(feature.name)) {
                        this.showNotification('This feature is already included in your package!', 'info'
                        return;
                    }
                    
                    this.toggleFeature(card
                }
            }
        }
    }
    
    getCategoryDisplayName(category) {
        const categoryNames = {
            'core': 'Core Features',
            'content': 'Content & Pages',
            'marketing': 'Marketing & SEO',
            'social': 'Social Media',
            'advanced': 'Advanced Features',
            'other': 'Additional Features'
        };
        return categoryNames[category] || category;
    }
    
    getCategoryIcon(category) {
        const categoryIcons = {
            'core': 'settings',
            'content': 'file-text',
            'marketing': 'trending-up',
            'social': 'share-2',
            'advanced': 'zap',
            'other': 'plus'
        };
        return categoryIcons[category] || 'plus';
    }
    
    isFeatureIncluded(feature, selectedPackageFeatures) {
        // Check if feature has includedIn property (new format)
        if (feature.includedIn && this.selectedPackage) {
            return feature.includedIn.includes(this.selectedPackage
        }
        
        // Fallback to old format
        return selectedPackageFeatures.some(pkgFeature => 
            pkgFeature.toLowerCase().includes(feature.name.toLowerCase()) ||
            feature.name.toLowerCase().includes(pkgFeature.toLowerCase())

    }
    
    renderAddonServices() {
        const addonServicesGrid = document.getElementById('addonServicesGrid'
        if (!addonServicesGrid) {
            return;
        }
        
        if (!this.addonServices || this.addonServices.length === 0) {
            addonServicesGrid.innerHTML = '<p class="no-services">No addon services available</p>';
            return;
        }
        
        addonServicesGrid.innerHTML = this.addonServices.map(service => {
            const isSelected = this.selectedAddonServices.has(service.id
            return `
                <div class="addon-card ${isSelected ? 'selected' : ''}" data-service-id="${service.id}">
                <div class="addon-header">
                        <i data-lucide="${service.icon || 'settings'}" aria-hidden="true"></i>
                        <h4>${service.name}</h4>
                </div>
                    <p>${service.description}</p>
                    <div class="addon-timeline">
                        <i data-lucide="clock" aria-hidden="true"></i>
                        <span>${service.timeline || '5-7 days'}</span>
            </div>
                    <div class="addon-footer">
                        <span class="addon-price">$${service.price}</span>
                        ${isSelected ? '<div class="selected-badge">Selected</div>' : ''}
            </div>
            </div>
            `;
        }).join(''
        
        // Add click listeners
        const addonCards = addonServicesGrid.querySelectorAll('.addon-card'
        addonCards.forEach(card => {
            const serviceId = card.dataset.serviceId;
            // Add click listener to the entire card
            card.addEventListener('click', (e) => {
                this.toggleAddonService(serviceId, card
            }
            
            // Also add click listeners to child elements to ensure clicks work
            card.querySelectorAll('*').forEach(child => {
                child.addEventListener('click', (e) => {
                    e.stopPropagation( // Prevent bubbling
                    this.toggleAddonService(serviceId, card
                }
            }
        }
        
        // Update Lucide icons
        lucide.createIcons(
    }
    
    renderComponents() {

        // Update tab counts
        this.updateComponentTabCounts(
        
        // Render pages
        const pagesGrid = document.getElementById('pagesGrid'
        if (pagesGrid) {
            if (!this.components.pages || this.components.pages.length === 0) {
                pagesGrid.innerHTML = '<div class="no-components"><i data-lucide="file-text"></i><p>No pages components available</p></div>';
            } else {
                pagesGrid.innerHTML = this.components.pages.map(component => {
                    const isSelected = this.selectedComponents.has(component.id
                    const isIncluded = this.isComponentIncluded(component.name
                    const displayPrice = isIncluded ? 0 : component.price;
                    return `
                        <div class="component-card ${isSelected ? 'selected' : ''} ${isIncluded ? 'included-in-package' : ''}" data-component-id="${component.id}">
                            <div class="component-header">
                                <div class="component-icon">
                                    <i data-lucide="file-text" aria-hidden="true"></i>
                                </div>
                                <div class="component-info">
                    <h4>${component.name}</h4>
                    <p>${component.description}</p>
                </div>
                            </div>
                            <div class="component-footer">
                                <span class="component-price">$${displayPrice}</span>
                                ${isIncluded ? '<div class="included-badge"><i data-lucide="check"></i>Included</div>' : 
                                  isSelected ? '<div class="selected-badge"><i data-lucide="check"></i>Selected</div>' : 
                                  '<div class="not-selected-badge"><i data-lucide="plus"></i>Add Component</div>'}
                            </div>
                        </div>
                    `;
                }).join(''
            
            // Add click listeners for pages
                const pageCards = pagesGrid.querySelectorAll('.component-card'
                pageCards.forEach(card => {
                    const componentId = card.dataset.componentId;
                    // Add click listener to the card itself
                    card.addEventListener('click', (e) => {
                        e.preventDefault(
                        e.stopPropagation(
                        
                        // Don't allow toggling if component is included in package
                        const component = this.findComponentById(componentId
                        if (component && this.isComponentIncluded(component.name)) {
                            this.showNotification('This component is already included in your package!', 'info'
                            return;
                        }
                        
                        this.toggleComponent(componentId, card
                    }
                    
                    // Also add click listeners to all child elements to ensure the entire card is clickable
                    card.querySelectorAll('*').forEach(child => {
                        child.addEventListener('click', (e) => {
                            e.preventDefault(
                            e.stopPropagation(
                            // Don't allow toggling if component is included in package
                            const component = this.findComponentById(componentId
                            if (component && this.isComponentIncluded(component.name)) {
                                this.showNotification('This component is already included in your package!', 'info'
                                return;
                            }
                            
                            this.toggleComponent(componentId, card
                        }
                    }
                }
            }
        }
        
        // Render features
        const featuresGrid = document.getElementById('featuresGrid'
        if (featuresGrid) {
            if (!this.components.features || this.components.features.length === 0) {
                featuresGrid.innerHTML = '<div class="no-components"><i data-lucide="settings"></i><p>No features components available</p></div>';
            } else {
                featuresGrid.innerHTML = this.components.features.map(component => {
                    const isSelected = this.selectedComponents.has(component.id
                    const isIncluded = this.isComponentIncluded(component.name
                    const displayPrice = isIncluded ? 0 : component.price;
                    return `
                        <div class="component-card ${isSelected ? 'selected' : ''} ${isIncluded ? 'included-in-package' : ''}" data-component-id="${component.id}">
                            <div class="component-header">
                                <div class="component-icon">
                                    <i data-lucide="settings" aria-hidden="true"></i>
                                </div>
                                <div class="component-info">
                    <h4>${component.name}</h4>
                    <p>${component.description}</p>
                </div>
                                <div class="component-price">$${displayPrice}</div>
                            </div>
                            <div class="component-footer">
                                ${isIncluded ? '<div class="included-badge"><i data-lucide="check"></i>Included</div>' : 
                                  isSelected ? '<div class="selected-badge"><i data-lucide="check"></i>Selected</div>' : 
                                  '<div class="not-selected-badge"><i data-lucide="plus"></i>Add Component</div>'}
                            </div>
                        </div>
                    `;
                }).join(''
            
            // Add click listeners for features
                const featureCards = featuresGrid.querySelectorAll('.component-card'
                featureCards.forEach(card => {
                    const componentId = card.dataset.componentId;
                    // Add click listener to the card itself
                    card.addEventListener('click', (e) => {
                        e.preventDefault(
                        e.stopPropagation(
                        
                        // Don't allow toggling if component is included in package
                        const component = this.findComponentById(componentId
                        if (component && this.isComponentIncluded(component.name)) {
                            this.showNotification('This component is already included in your package!', 'info'
                            return;
                        }
                        
                        this.toggleComponent(componentId, card
                    }
                    
                    // Also add click listeners to all child elements to ensure the entire card is clickable
                    card.querySelectorAll('*').forEach(child => {
                        child.addEventListener('click', (e) => {
                            e.preventDefault(
                            e.stopPropagation(
                            // Don't allow toggling if component is included in package
                            const component = this.findComponentById(componentId
                            if (component && this.isComponentIncluded(component.name)) {
                                this.showNotification('This component is already included in your package!', 'info'
                                return;
                            }
                            
                            this.toggleComponent(componentId, card
                        }
                    }
                }
            }
        }
        
        // Render technical
        const technicalGrid = document.getElementById('technicalGrid'
        if (technicalGrid) {
            if (!this.components.technical || this.components.technical.length === 0) {
                technicalGrid.innerHTML = '<div class="no-components"><i data-lucide="server"></i><p>No technical components available</p></div>';
            } else {
                technicalGrid.innerHTML = this.components.technical.map(component => {
                    const isSelected = this.selectedComponents.has(component.id
                    const isIncluded = this.isComponentIncluded(component.name
                    const displayPrice = isIncluded ? 0 : component.price;
                    return `
                        <div class="component-card ${isSelected ? 'selected' : ''} ${isIncluded ? 'included-in-package' : ''}" data-component-id="${component.id}">
                            <div class="component-header">
                                <div class="component-icon">
                                    <i data-lucide="server" aria-hidden="true"></i>
                                </div>
                                <div class="component-info">
                    <h4>${component.name}</h4>
                    <p>${component.description}</p>
                </div>
                                <div class="component-price">$${displayPrice}</div>
                            </div>
                            <div class="component-footer">
                                ${isIncluded ? '<div class="included-badge"><i data-lucide="check"></i>Included</div>' : 
                                  isSelected ? '<div class="selected-badge"><i data-lucide="check"></i>Selected</div>' : 
                                  '<div class="not-selected-badge"><i data-lucide="plus"></i>Add Component</div>'}
                            </div>
                        </div>
                    `;
                }).join(''
            
            // Add click listeners for technical
                const technicalCards = technicalGrid.querySelectorAll('.component-card'
                technicalCards.forEach(card => {
                    const componentId = card.dataset.componentId;
                    // Add click listener to the card itself
                    card.addEventListener('click', (e) => {
                        e.preventDefault(
                        e.stopPropagation(
                        
                        // Don't allow toggling if component is included in package
                        const component = this.findComponentById(componentId
                        if (component && this.isComponentIncluded(component.name)) {
                            this.showNotification('This component is already included in your package!', 'info'
                            return;
                        }
                        
                        this.toggleComponent(componentId, card
                    }
                    
                    // Also add click listeners to all child elements to ensure the entire card is clickable
                    card.querySelectorAll('*').forEach(child => {
                        child.addEventListener('click', (e) => {
                            e.preventDefault(
                            e.stopPropagation(
                            // Don't allow toggling if component is included in package
                            const component = this.findComponentById(componentId
                            if (component && this.isComponentIncluded(component.name)) {
                                this.showNotification('This component is already included in your package!', 'info'
                                return;
                            }
                            
                            this.toggleComponent(componentId, card
                        }
                    }
                }
            }
        }
        
        // Initialize Lucide icons
        lucide.createIcons(
    }
    
    updateComponentTabCounts() {
        const pagesCount = this.components?.pages?.length || 0;
        const featuresCount = this.components?.features?.length || 0;
        const technicalCount = this.components?.technical?.length || 0;
        
        const pagesCountEl = document.getElementById('pages-count'
        const featuresCountEl = document.getElementById('features-count'
        const technicalCountEl = document.getElementById('technical-count'
        
        if (pagesCountEl) pagesCountEl.textContent = pagesCount;
        if (featuresCountEl) featuresCountEl.textContent = featuresCount;
        if (technicalCountEl) technicalCountEl.textContent = technicalCount;
    }
    
    selectPackage(packageId) {
        // For single package system, package is already selected
        this.selectedPackage = packageId;
        
        // Auto-select Standard Emergency Service when package is selected
        const standardEmergency = this.emergencyServices.find(s => s.id === 'standard-emergency'
        if (standardEmergency && this.isComponentIncluded(standardEmergency.name)) {
            this.selectedEmergency = 'standard-emergency';
            }
        
        // Auto-select Primary Service Zone when package is selected
        const primaryZone = this.serviceAreas.find(s => s.id === 'primary-zone'
        if (primaryZone && this.isComponentIncluded(primaryZone.name)) {
            this.selectedServiceArea = 'primary-zone';
            }
        
        this.saveToLocalStorage( // Save to localStorage
        
        // Update all sections based on package selection
        this.virtualRenderer.queueRender(() => this.renderEmergencyServices(), 'normal'
        this.virtualRenderer.queueRender(() => this.renderServiceAreas(), 'normal'
        this.virtualRenderer.queueRender(() => this.renderFeatures(), 'normal'
        this.virtualRenderer.queueRender(() => this.renderHvacFeatures(), 'normal'
        this.virtualRenderer.queueRender(() => this.renderApplianceFeatures(), 'normal'
        this.updateSummary(
        this.updateGenerateButton(
        

        
        // Show success notification
        const packageName = this.packages.find(p => p.id === packageId)?.name || 'Package';
        this.showNotification(`${packageName} is ready! Add extra features to customize your website.`, 'success'
    }
    
    selectEmergencyService(card) {
        const emergencyId = card.dataset.emergencyId;
        // Toggle selection - if already selected, deselect it
        if (this.selectedEmergency === emergencyId) {
            this.selectedEmergency = null;
            } else {
        this.selectedEmergency = emergencyId;
            }
        
        // Re-render to update the UI
        this.virtualRenderer.queueRender(() => this.renderEmergencyServices(), 'normal'
        this.saveToLocalStorage( // Save to localStorage
        this.updateSummary(
        this.updateGenerateButton(
        
        // Show user feedback
        const service = this.emergencyServices.find(s => s.id === emergencyId
        if (service) {
            const action = this.selectedEmergency === emergencyId ? 'added' : 'removed';
            this.showNotification(`${service.name} ${action} to your quote`, 'success'
        }
    }
    
    selectServiceArea(card) {
        const areaId = card.dataset.areaId;
        
        // Toggle selection - if already selected, deselect it
        if (this.selectedServiceArea === areaId) {
            this.selectedServiceArea = null;
            } else {
        this.selectedServiceArea = areaId;
            }
        
        // Re-render to update the UI
        this.virtualRenderer.queueRender(() => this.renderServiceAreas(), 'normal'
        this.saveToLocalStorage( // Save to localStorage
        this.updateSummary(
        this.updateGenerateButton(
        
        // Show user feedback
        const area = this.serviceAreas.find(a => a.id === areaId
        if (area) {
            const action = this.selectedServiceArea === areaId ? 'added' : 'removed';
            this.showNotification(`${area.name} ${action} to your quote`, 'success'
        }
    }
    
    toggleFeature(featureId, card = null) {
        // If no card provided, try to find it
        if (!card) {
            card = document.querySelector(`[data-feature-id="${featureId}"]`
        }
        if (!card) return;
        
        // Don't allow toggling if feature is included in package
        if (card.classList.contains('included-in-package')) {
            return;
        }

        
        if (this.selectedAdditionalFeatures.has(featureId)) {
            this.selectedAdditionalFeatures.delete(featureId
            } else {
            this.selectedAdditionalFeatures.add(featureId
            }
        
        // Update visual state immediately
        this.updateFeatureVisualState(card, featureId
        
        // Re-render to update the UI
        this.virtualRenderer.queueRender(() => this.renderFeatures(), 'normal'
        this.saveToLocalStorage( // Save to localStorage
        this.updateSummary(
        this.updateGenerateButton(
        
        // Show user feedback
        const feature = this.findFeatureById(featureId
        if (feature) {
            const action = this.selectedAdditionalFeatures.has(featureId) ? 'added' : 'removed';
            this.showNotification(`${feature.name} ${action} to your quote`, 'success'
        }
    }
    
    toggleHvacFeature(card) {
        const featureId = card.dataset.featureId;
        if (!featureId) return;
        
        // Get the current feature
        const feature = this.hvacFeatures?.find(f => f.id === featureId
        if (!feature) return;

        
        // Handle mutually exclusive logic for HVAC Brand Support
        if (featureId === 'hvac-brand-support' || featureId === 'commercial-hvac-support') {
            if (this.selectedHvacFeatures.has(featureId)) {
                // If already selected, deselect it
                this.selectedHvacFeatures.delete(featureId
                } else {
                // If selecting one, deselect the other
                if (featureId === 'hvac-brand-support') {
                    this.selectedHvacFeatures.delete('commercial-hvac-support'
                } else {
                    this.selectedHvacFeatures.delete('hvac-brand-support'
                }
                
                // Add selection to clicked card
                this.selectedHvacFeatures.add(featureId
                }
        } else {
            // Regular multi-selection behavior for other features
        if (this.selectedHvacFeatures.has(featureId)) {
            // If already selected, deselect it
            this.selectedHvacFeatures.delete(featureId
                } else {
            // Add selection to clicked card
            this.selectedHvacFeatures.add(featureId
                }
        }
        
        // Update visual state immediately
        this.updateHvacFeatureVisualState(card, featureId, feature
        
        // Re-render to update the UI
        this.virtualRenderer.queueRender(() => this.renderHvacFeatures(), 'normal'
        this.saveToLocalStorage( // Save to localStorage
        this.updateSummary(
        this.updateGenerateButton(
        
        // Show user feedback
        const action = this.selectedHvacFeatures.has(featureId) ? 'added' : 'removed';
        this.showNotification(`${feature.name} ${action} to your quote`, 'success'
    }
    
    updateHvacFeatureVisualState(card, featureId, feature) {
        const isSelected = this.selectedHvacFeatures.has(featureId
        const isDefault = featureId === 'hvac-brand-support';
        const isDefaultSelected = isDefault && isSelected;
        
        // Update card classes
        if (isSelected) {
            card.classList.add('selected'
            card.classList.remove('not-selected'
        } else {
            card.classList.remove('selected'
            card.classList.add('not-selected'
        }
        
        // Update badges
        const existingBadges = card.querySelectorAll('.included-badge, .selected-badge, .default-badge, .not-selected-badge'
        existingBadges.forEach(badge => badge.remove()
        
        if (isDefaultSelected) {
            card.insertAdjacentHTML('beforeend', '<div class="included-badge">Included</div>'
        } else if (isSelected && !isDefault) {
            card.insertAdjacentHTML('beforeend', '<div class="selected-badge">Selected</div>'
        } else if (isDefault && !isSelected) {
            card.insertAdjacentHTML('beforeend', '<div class="default-badge">Default</div>'
        } else if (!isDefault && !isSelected) {
            card.insertAdjacentHTML('beforeend', '<div class="not-selected-badge">Not Selected</div>'
        }
    }
    
    toggleApplianceFeature(card) {
        const featureId = card.dataset.featureId;
        if (!featureId) return;
        
        // Get the current feature
        const feature = this.applianceFeatures?.find(f => f.id === featureId
        if (!feature) return;

        
        // Handle mutually exclusive logic for Appliance Brand Support
        if (featureId === 'appliance-brand-support' || featureId === 'commercial-appliance-support') {
            if (this.selectedApplianceFeatures.has(featureId)) {
                // If already selected, deselect it
                this.selectedApplianceFeatures.delete(featureId
                } else {
                // If selecting one, deselect the other
                if (featureId === 'appliance-brand-support') {
                    this.selectedApplianceFeatures.delete('commercial-appliance-support'
                } else {
                    this.selectedApplianceFeatures.delete('appliance-brand-support'
                }
                
                // Add selection to clicked card
                this.selectedApplianceFeatures.add(featureId
                }
        } else {
            // Regular multi-selection behavior for other features
        if (this.selectedApplianceFeatures.has(featureId)) {
            // If already selected, deselect it
            this.selectedApplianceFeatures.delete(featureId
                } else {
            // Add selection to clicked card
            this.selectedApplianceFeatures.add(featureId
                }
        }
        
        // Update visual state immediately
        this.updateApplianceFeatureVisualState(card, featureId, feature
        
        // Re-render to update the UI
        this.virtualRenderer.queueRender(() => this.renderApplianceFeatures(), 'normal'
        this.saveToLocalStorage( // Save to localStorage
        this.updateSummary(
        this.updateGenerateButton(
        
        // Show user feedback
        const action = this.selectedApplianceFeatures.has(featureId) ? 'added' : 'removed';
        this.showNotification(`${feature.name} ${action} to your quote`, 'success'
    }
    
    updateApplianceFeatureVisualState(card, featureId, feature) {
        const isSelected = this.selectedApplianceFeatures.has(featureId
        const isDefault = featureId === 'appliance-brand-support';
        const isDefaultSelected = isDefault && isSelected;
        
        // Update card classes
        if (isSelected) {
            card.classList.add('selected'
            card.classList.remove('not-selected'
        } else {
            card.classList.remove('selected'
            card.classList.add('not-selected'
        }
        
        // Update badges
        const existingBadges = card.querySelectorAll('.included-badge, .selected-badge, .default-badge, .not-selected-badge'
        existingBadges.forEach(badge => badge.remove()
        
        if (isDefaultSelected) {
            card.insertAdjacentHTML('beforeend', '<div class="included-badge">Included</div>'
        } else if (isSelected && !isDefault) {
            card.insertAdjacentHTML('beforeend', '<div class="selected-badge">Selected</div>'
        } else if (isDefault && !isSelected) {
            card.insertAdjacentHTML('beforeend', '<div class="default-badge">Default</div>'
        } else if (!isDefault && !isSelected) {
            card.insertAdjacentHTML('beforeend', '<div class="not-selected-badge">Not Selected</div>'
        }
    }
    
    toggleContactFeature(card) {
        const featureId = card.dataset.featureId;
        if (!featureId) {
            return;
        }

        
        if (this.selectedContactFeatures.has(featureId)) {
            this.selectedContactFeatures.delete(featureId
            card.classList.remove('selected'
            } else {
            this.selectedContactFeatures.add(featureId
            card.classList.add('selected'
            }

        
        // Re-render to update the UI
        this.virtualRenderer.queueRender(() => this.renderContactFeatures(), 'normal'
        this.saveToLocalStorage( // Save to localStorage
        this.updateSummary(
        this.updateGenerateButton(
    }
    
    toggleAddon(addonId, card = null) {
        // If no card provided, try to find it
        if (!card) {
            card = document.querySelector(`[data-addon-id="${addonId}"]`
        }
        if (!card) {
            return;
        }

        
        if (this.selectedAddons.has(addonId)) {
            this.selectedAddons.delete(addonId
            card.classList.remove('selected'
            } else {
            this.selectedAddons.add(addonId
            card.classList.add('selected'
            }

        
        // Re-render to update the UI
        this.virtualRenderer.queueRender(() => this.renderAddons(), 'normal'
        this.saveToLocalStorage( // Save to localStorage
        this.updateSummary(
        this.updateGenerateButton(
    }
    
    toggleComponent(componentId, card = null) {
        // If no card provided, try to find it
        if (!card) {
            card = document.querySelector(`[data-component-id="${componentId}"]`
        }
        if (!card) {
            return;
        }
        
        // Check if component is included in package
        const component = this.findComponentById(componentId
        if (component && this.isComponentIncluded(component.name)) {
            this.showNotification('This component is already included in your package!', 'info'
            return;
        }

        
        if (this.selectedComponents.has(componentId)) {
            this.selectedComponents.delete(componentId
            } else {
            this.selectedComponents.add(componentId
            }

        
        // Update the card's visual state immediately
        if (this.selectedComponents.has(componentId)) {
            card.classList.add('selected'
            card.classList.remove('not-selected'
        } else {
            card.classList.remove('selected'
            card.classList.add('not-selected'
        }
        
        // Update the badge text
        const badge = card.querySelector('.selected-badge, .not-selected-badge'
        if (badge) {
            if (this.selectedComponents.has(componentId)) {
                badge.textContent = 'Selected';
                badge.className = 'selected-badge';
            } else {
                badge.textContent = 'Not Selected';
                badge.className = 'not-selected-badge';
            }
        }
        
        // Re-render to update the UI
        this.virtualRenderer.queueRender(() => this.renderComponents(), 'normal'
        this.saveToLocalStorage( // Save to localStorage
        this.updateSummary(
        this.updateGenerateButton(
        
        // Show feedback to user
        if (component) {
            const action = this.selectedComponents.has(componentId) ? 'added' : 'removed';
            this.showNotification(`${component.name} ${action} to your quote`, 'success'
        }
    }
    
    findFeatureById(featureId) {
        // Search through all feature categories
        if (this.features && typeof this.features === 'object') {
            for (const categoryFeatures of Object.values(this.features)) {
                const feature = categoryFeatures.find(f => f.id === featureId
                if (feature) {
                    return feature;
                }
            }
        }
        return null;
    }
    
    updateFeatureVisualState(card, featureId) {
        const isSelected = this.selectedAdditionalFeatures.has(featureId
        const isIncluded = card.classList.contains('included-in-package'
        
        // Update card classes
        if (isSelected) {
            card.classList.add('selected'
            card.classList.remove('not-selected'
        } else {
            card.classList.remove('selected'
            card.classList.add('not-selected'
        }
        
        // Update badges
        const existingBadges = card.querySelectorAll('.included-badge, .selected-badge, .not-selected-badge'
        existingBadges.forEach(badge => badge.remove()
        
        if (isIncluded) {
            card.insertAdjacentHTML('beforeend', '<div class="included-badge">Included</div>'
        } else if (isSelected) {
            card.insertAdjacentHTML('beforeend', '<div class="selected-badge">Selected</div>'
        } else {
            card.insertAdjacentHTML('beforeend', '<div class="not-selected-badge">Not Selected</div>'
        }
    }
    
    findComponentById(componentId) {
        // Search through all component categories
        for (const category of Object.values(this.components)) {
            const component = category.find(c => c.id === componentId
            if (component) {
                return component;
            }
        }
        return null;
    }
    
    isComponentIncluded(componentName) {
        if (!this.selectedPackage) return false;
        
        const selectedPackage = this.packages.find(p => p.id === this.selectedPackage
        if (!selectedPackage) return false;
        
        // Check for includedFeatures first (new structure), then fallback to includedComponents
        const includedFeatures = selectedPackage.includedFeatures || selectedPackage.includedComponents || [];
        
        // Check if the component name exactly matches any included feature
        const isIncluded = includedFeatures.includes(componentName
        return isIncluded;
    }
    
    getPackageIncludedFeatures() {
        if (!this.selectedPackage) return [];
        
        const selectedPackage = this.packages.find(p => p.id === this.selectedPackage
        if (!selectedPackage) return [];
        
        // Map package feature names to feature IDs
        const featureMap = {
            'Responsive Homepage': 'responsive-homepage',
            'About Us Page': 'about-page',
            'Services Page': 'services-page',
            'Contact Form': 'contact-form',
            'Mobile Optimization': 'mobile-optimization',
            'Basic SEO Setup': 'basic-seo',
            'Blog System': 'blog-system',
            'Testimonials': 'testimonials',
            'Service Areas': 'service-areas',
            'Advanced SEO': 'advanced-seo',
            'Analytics Integration': 'analytics',
            'Social Media Integration': 'social-media',
            'Custom Design': 'custom-design',
            'Advanced Animations': 'advanced-animations',
            'Priority Support': 'priority-support',
            'Performance Optimization': 'performance-optimization',
            'Security Features': 'security-features',
            'Backup System': 'backup-system'
        };
        
        return selectedPackage.features.map(featureName => featureMap[featureName]).filter(Boolean
    }
    
    calculateTotalPrice() {
        let totalPrice = 0;
        
        // Base package price (always $1200)
        if (this.selectedPackage) {
            totalPrice = 1200; // Base price for all packages
        } else if (this.packages && this.packages.length > 0) {
            // If no package is selected but packages are available, set default price
            totalPrice = 1200;
        }
        
        // Additional features price
        this.selectedAdditionalFeatures.forEach(featureId => {
            const feature = this.additionalFeatures.find(f => f.id === featureId
            if (feature) {
                totalPrice += feature.price;
            }
        }
        
        // Addon services price
        this.selectedAddonServices.forEach(serviceId => {
            const service = this.addonServices.find(s => s.id === serviceId
            if (service) {
                totalPrice += service.price;
            }
        }
        
        return totalPrice;
    }
    
    updateSummary() {
        let totalPrice = 0;
        let totalFeatures = 0;
        
        // Base package price (always $1200)
        if (this.selectedPackage && this.packages && Array.isArray(this.packages)) {
            totalPrice = 1200; // Base price for all packages
            const selectedPackage = this.packages.find(p => p.id === this.selectedPackage
            if (selectedPackage) {
                const includedFeatures = selectedPackage.includedFeatures || [];
                totalFeatures += includedFeatures.length;
            }
        } else if (this.packages && Array.isArray(this.packages) && this.packages.length > 0) {
            // If no package is selected but packages are available, set default price
            totalPrice = 1200;
            const defaultPackage = this.packages[0];
            if (defaultPackage && defaultPackage.includedFeatures) {
                totalFeatures += defaultPackage.includedFeatures.length;
            }
            } else {
            // Fallback: set default values
            totalPrice = 1200;
            totalFeatures = 12; // Default included features count
            }
            
        // Additional features price
        if (this.selectedAdditionalFeatures && this.additionalFeatures && Array.isArray(this.additionalFeatures)) {
            this.selectedAdditionalFeatures.forEach(featureId => {
                const feature = this.additionalFeatures.find(f => f.id === featureId
            if (feature) {
                totalPrice += feature.price;
                totalFeatures++;
            }
        }
        }
        
        // Addon services price
        if (this.selectedAddonServices && this.addonServices && Array.isArray(this.addonServices)) {
            this.selectedAddonServices.forEach(serviceId => {
                const service = this.addonServices.find(s => s.id === serviceId
                if (service) {
                    totalPrice += service.price;
                }
            }
        }
        
        this.totalPrice = totalPrice;
        
        // Save the current state immediately after calculating
        this.saveToLocalStorage(
        
        // Update UI - only update elements that exist
        const summaryTotalElement = document.getElementById('summaryTotal'
        if (summaryTotalElement) {
            summaryTotalElement.textContent = `$${totalPrice.toLocaleString()}`;
        }
        
        // Update fixed quote summary (mobile)
        const fixedSummaryTotalElement = document.getElementById('fixedSummaryTotal'
        if (fixedSummaryTotalElement) {
            fixedSummaryTotalElement.textContent = `$${totalPrice.toLocaleString()}`;
        }
        
        const totalFeaturesElement = document.getElementById('totalFeatures'
        if (totalFeaturesElement) {
            totalFeaturesElement.textContent = totalFeatures;
        }
        
        const includedFeaturesElement = document.getElementById('includedFeatures'
        if (includedFeaturesElement) {
            if (this.packages && Array.isArray(this.packages) && this.selectedPackage) {
                const selectedPackage = this.packages.find(p => p.id === this.selectedPackage
                if (selectedPackage && selectedPackage.includedFeatures) {
                    includedFeaturesElement.textContent = selectedPackage.includedFeatures.length;
                } else {
                    includedFeaturesElement.textContent = '12'; // Default for base package
                }
            } else {
                includedFeaturesElement.textContent = '12'; // Default for base package
            }
        }
        
        const selectedFeaturesElement = document.getElementById('selectedFeatures'
        if (selectedFeaturesElement) {
            selectedFeaturesElement.textContent = this.selectedAdditionalFeatures.size;
        }
        
        const selectedAddonsElement = document.getElementById('selectedAddons'
        if (selectedAddonsElement) {
            selectedAddonsElement.textContent = this.selectedAddonServices.size;
        }
        
        // Update timeline estimate
        this.updateTimelineEstimate(
        
        // Update selected items list
        this.updateSelectedItems(
        
        // Force save after UI update
        setTimeout(() => this.saveToLocalStorage(), 50
    }
    
    updateTimelineEstimate() {
        const timelineElement = document.getElementById('timelineEstimate'
        if (!timelineElement) return;
        
        let baseMinDays = 15;
        let baseMaxDays = 20;
        
        // Get base package timeline
        if (this.selectedPackage && this.packages && Array.isArray(this.packages)) {
            const selectedPackage = this.packages.find(p => p.id === this.selectedPackage
            if (selectedPackage) {
                // Base package is 15-20 days
                baseMinDays = 15;
                baseMaxDays = 20;
            }
        }
        
        let totalMinDays = baseMinDays;
        let totalMaxDays = baseMaxDays;
        
        // Calculate additional days for features
        if (this.selectedAdditionalFeatures && this.additionalFeatures && Array.isArray(this.additionalFeatures)) {
            this.selectedAdditionalFeatures.forEach(featureId => {
                const feature = this.additionalFeatures.find(f => f.id === featureId
                if (feature && feature.timeline) {
                    const timelineMatch = feature.timeline.match(/(\d+)-(\d+)/
                if (timelineMatch) {
                        const minDays = parseInt(timelineMatch[1]
                        const maxDays = parseInt(timelineMatch[2]
                        totalMinDays += minDays;
                        totalMaxDays += maxDays;
                    }
                }
            }
        }
        
        // Calculate additional days for addon services
        if (this.selectedAddonServices && this.addonServices && Array.isArray(this.addonServices)) {
            this.selectedAddonServices.forEach(serviceId => {
                const service = this.addonServices.find(s => s.id === serviceId
                if (service && service.timeline) {
                    const timelineMatch = service.timeline.match(/(\d+)-(\d+)/
                    if (timelineMatch) {
                        const minDays = parseInt(timelineMatch[1]
                        const maxDays = parseInt(timelineMatch[2]
                        totalMinDays += minDays;
                        totalMaxDays += maxDays;
                    }
                }
            }
        }
        
        // Add 20% buffer for project management and coordination
        const bufferMin = Math.ceil(totalMinDays * 0.2
        const bufferMax = Math.ceil(totalMaxDays * 0.2
        
        const finalMinDays = totalMinDays + bufferMin;
        const finalMaxDays = totalMaxDays + bufferMax;
        
        timelineElement.textContent = `${finalMinDays}-${finalMaxDays} days`;
        
        // Update fixed timeline (mobile)
        const fixedTimelineElement = document.getElementById('fixedTimelineEstimate'
        if (fixedTimelineElement) {
            fixedTimelineElement.textContent = `${finalMinDays}-${finalMaxDays} days`;
        }
    }
    
    updateSelectedItems() {
        const selectedItemsContainer = document.getElementById('selectedItems'
        if (!selectedItemsContainer) return;
        
        const items = [];
        
        // Package
        if (this.selectedPackage && this.packages && Array.isArray(this.packages)) {
            const selectedPackage = this.packages.find(p => p.id === this.selectedPackage
            if (selectedPackage) {
                items.push({ 
                    name: selectedPackage.name, 
                    price: selectedPackage.price, 
                    timeline: '18-24 days',
                    type: 'package', 
                    id: selectedPackage.id 
                }
            }
        }
        
        // Additional features
        if (this.selectedAdditionalFeatures && this.additionalFeatures && Array.isArray(this.additionalFeatures)) {
            this.selectedAdditionalFeatures.forEach(featureId => {
                const feature = this.additionalFeatures.find(f => f.id === featureId
                if (feature) {
                    items.push({ 
                        name: feature.name, 
                        price: feature.price, 
                        timeline: feature.timeline || '5-7 days',
                        type: 'feature', 
                        id: feature.id 
                    }
                }
            }
        }
        
        // Addon services
        if (this.selectedAddonServices && this.addonServices && Array.isArray(this.addonServices)) {
            this.selectedAddonServices.forEach(serviceId => {
                const service = this.addonServices.find(s => s.id === serviceId
                if (service) {
                    items.push({ 
                        name: service.name, 
                        price: service.price, 
                        timeline: service.timeline || '5-7 days',
                        type: 'addon', 
                        id: service.id 
                    }
                }
            }
        }
        
        // Store items for removal functionality
        this.currentSelectedItems = items;
        
        selectedItemsContainer.innerHTML = items.map((item, index) => `
            <div class="selected-item" data-item-index="${index}">
                <div class="selected-item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-timeline">${item.timeline}</span>
                </div>
                <div class="selected-item-actions">
                    <span class="item-price">$${item.price}</span>
                    ${item.type !== 'package' ? `
                        <button class="delete-item-btn" onclick="quoteSystem.removeSelectedItem(${index})" aria-label="Remove ${item.name}">
                            <i data-lucide="x" aria-hidden="true"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join(''
        
        // Initialize Lucide icons for delete buttons
        lucide.createIcons(
        
        // Update fixed selected items (mobile)
        this.updateFixedSelectedItems(items
    }
    
    updateFixedSelectedItems(items) {
        const fixedSelectedItemsContainer = document.getElementById('fixedSelectedItems'
        if (!fixedSelectedItemsContainer) return;
        
        fixedSelectedItemsContainer.innerHTML = items.map((item, index) => `
            <div class="selected-item" data-item-index="${index}">
                <div class="item-name">${item.name}</div>
                <div class="item-price">$${item.price}</div>
                ${item.type !== 'package' ? `
                    <button class="remove-item" onclick="quoteSystem.removeSelectedItem(${index})" aria-label="Remove ${item.name}">
                        <i data-lucide="x" aria-hidden="true"></i>
                    </button>
                ` : ''}
            </div>
        `).join(''
        
        // Initialize Lucide icons for delete buttons
        lucide.createIcons(
    }
    
    removeSelectedItem(index) {
        if (!this.currentSelectedItems || !this.currentSelectedItems[index]) return;
        
        const item = this.currentSelectedItems[index];
        
        // Prevent deletion of base package
        if (item.type === 'package') {
            return;
        }
        
        switch (item.type) {
            case 'feature':
                this.selectedAdditionalFeatures.delete(item.id
                // Deselect the feature card
                this.deselectFeature(item.id
                break;
            case 'addon':
                this.selectedAddonServices.delete(item.id
                // Deselect the addon card
                this.deselectAddon(item.id
                break;
        }
        
        // Update UI
        this.updateSummary(
        this.updateSelectedItems(
        this.updateGenerateButton(
        this.saveToLocalStorage(
        
        }
    
    deselectFeature(featureId) {
        // Remove selected class from feature card
        const featureCard = document.querySelector(`[data-feature-id="${featureId}"]`
        if (featureCard) {
            featureCard.classList.remove('selected'
            
            // Update the select button if it exists
            const selectBtn = featureCard.querySelector('.select-feature-btn'
            if (selectBtn) {
                selectBtn.classList.remove('selected'
                selectBtn.textContent = 'Select';
            }
            
            // Remove selected badge if it exists
            const selectedBadge = featureCard.querySelector('.selected-badge'
            if (selectedBadge) {
                selectedBadge.remove(
            }
            
            // Remove any other selection indicators
            const notSelectedBadge = featureCard.querySelector('.not-selected-badge'
            if (notSelectedBadge) {
                notSelectedBadge.remove(
            }
            
            // Add default badge if it doesn't exist
            const defaultBadge = featureCard.querySelector('.default-badge'
            if (!defaultBadge) {
                const badgeContainer = featureCard.querySelector('.badge-container'
                if (badgeContainer) {
                    const newDefaultBadge = document.createElement('div'
                    newDefaultBadge.className = 'default-badge';
                    newDefaultBadge.textContent = 'Not Selected';
                    badgeContainer.appendChild(newDefaultBadge
                }
            }
        }
    }
    
    deselectAddon(addonId) {
        // Remove selected class from addon card
        const addonCard = document.querySelector(`[data-service-id="${addonId}"]`
        if (addonCard) {
            addonCard.classList.remove('selected'
            
            // Remove selected badge if it exists
            const selectedBadge = addonCard.querySelector('.selected-badge'
            if (selectedBadge) {
                selectedBadge.remove(
            }
            
            } else {
            }
    }
    
    updateGenerateButton() {
        const generateBtn = document.getElementById('generateQuoteBtn'
        if (generateBtn) {
            const hasSelection = this.selectedPackage || this.selectedAdditionalFeatures.size > 0 || 
                               this.selectedAddonServices.size > 0;
            
            // Enable button if there are selections (form validation happens in modal)
            const shouldEnable = hasSelection;
            
            if (shouldEnable) {
                generateBtn.disabled = false;
                generateBtn.classList.remove('disabled'
                generateBtn.classList.add('enabled'
                generateBtn.title = 'Generate your quote';
            } else {
                generateBtn.disabled = true;
                generateBtn.classList.add('disabled'
                generateBtn.classList.remove('enabled'
                generateBtn.title = 'Please select at least one package or additional feature to continue';
            }
            
            }
    }
    
    validatePersonalInfo() {
        // Required fields validation (silent - no error display)
        let isValid = true;
        
        // Validate email (required)
        const emailField = document.getElementById('customerEmail'
        if (!emailField || !emailField.value.trim()) {
            isValid = false;
            } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                isValid = false;
            }
        }
        
        // Validate name (required)
        const nameField = document.getElementById('customerName'
        if (!nameField || !nameField.value.trim()) {
            isValid = false;
        } else if (nameField.value.trim().length < 2) {
            isValid = false;
        }
        
        // Validate phone (required)
        const phoneField = document.getElementById('customerPhone'
        if (!phoneField || !phoneField.value.trim()) {
            isValid = false;
        } else if (!isValidPhone(phoneField.value.trim())) {
            isValid = false;
        }
        
        // Validate location (required)
        const locationField = document.getElementById('customerLocation'
        if (!locationField || !locationField.value.trim()) {
            isValid = false;
        } else if (locationField.value.trim().length < 2) {
            isValid = false;
        }
        
        return isValid;
    }
    
    validateAndShowErrors() {
        // Show validation errors for form submission - check in order and stop at first error
        let isValid = true;
        const errors = [];
        
        // Check if we're in modal mode
        const modal = document.getElementById('customerInfoModal'
        const isModalMode = modal && !modal.hasAttribute('hidden') && modal.classList.contains('show'
        
        : 'no modal'
        : 'no modal'
        // Use modal fields if modal is open, otherwise use main form fields
        const fieldPrefix = isModalMode ? 'modal' : '';
        // Clear all previous errors first
        this.clearAllFieldErrors(fieldPrefix
        
        // Validate in order: Name -> Email -> Phone -> Location
        // Stop at first error found
        
        // 1. Validate name (required) - FIRST PRIORITY
        const nameField = document.getElementById(fieldPrefix + 'CustomerName'
        : 'no field'
        if (!nameField || !nameField.value.trim()) {
            isValid = false;
            const errorMsg = 'Full name is required';
            this.showFieldError(fieldPrefix + 'customerName', errorMsg
            errors.push('Full name is required'
            this.validationErrors = errors;
            return isValid;
        } else if (nameField.value.trim().length < 2) {
            isValid = false;
            const errorMsg = 'Please enter your full name (at least 2 characters)';
            this.showFieldError(fieldPrefix + 'customerName', errorMsg
            errors.push('Please enter your full name (at least 2 characters)'
            this.validationErrors = errors;
            return isValid;
        } else {
            this.showFieldValid(fieldPrefix + 'customerName'
        }
        
        // 2. Validate email (required) - SECOND PRIORITY
        const emailField = document.getElementById(fieldPrefix + 'CustomerEmail'
        if (!emailField || !emailField.value.trim()) {
            isValid = false;
            const errorMsg = 'Email address is required';
            this.showFieldError(fieldPrefix + 'customerEmail', errorMsg
            errors.push('Email address is required'
            this.validationErrors = errors;
            return isValid;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                isValid = false;
                const errorMsg = 'Please enter a valid email address (e.g., john@example.com)';
                this.showFieldError(fieldPrefix + 'customerEmail', errorMsg
                errors.push('Please enter a valid email address'
                this.validationErrors = errors;
                return isValid;
            } else {
                this.showFieldValid(fieldPrefix + 'customerEmail'
            }
        }
        
        // 3. Validate phone (required) - THIRD PRIORITY
        const phoneField = document.getElementById(fieldPrefix + 'CustomerPhone'
        if (!phoneField || !phoneField.value.trim()) {
            isValid = false;
            const errorMsg = 'Phone number is required';
            this.showFieldError(fieldPrefix + 'customerPhone', errorMsg
            errors.push('Phone number is required'
            this.validationErrors = errors;
            return isValid;
        } else if (!isValidPhone(phoneField.value.trim())) {
            isValid = false;
            const errorMsg = 'Please enter a valid phone number (e.g., 5551234567)';
            this.showFieldError(fieldPrefix + 'customerPhone', errorMsg
            errors.push('Please enter a valid phone number'
            this.validationErrors = errors;
            return isValid;
        } else {
            this.showFieldValid(fieldPrefix + 'customerPhone'
        }
        
        // 4. Validate location (required) - FOURTH PRIORITY
        const locationField = document.getElementById(fieldPrefix + 'CustomerLocation'
        if (!locationField || !locationField.value.trim()) {
            isValid = false;
            const errorMsg = 'Service location is required';
            this.showFieldError(fieldPrefix + 'customerLocation', errorMsg
            errors.push('Service location is required'
            this.validationErrors = errors;
            return isValid;
        } else if (locationField.value.trim().length < 2) {
            isValid = false;
            const errorMsg = 'Please enter your service location (e.g., New York, NY)';
            this.showFieldError(fieldPrefix + 'customerLocation', errorMsg
            errors.push('Please enter your service location'
            this.validationErrors = errors;
            return isValid;
        } else {
            this.showFieldValid(fieldPrefix + 'customerLocation'
        }
        
        // All validations passed
        this.validationErrors = [];
        return isValid;
    }
    
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId
        const errorElement = document.getElementById(`${fieldId}-error`
        
        if (field && errorElement) {
            field.classList.add('error'
            field.classList.remove('valid'
            errorElement.textContent = message;
            errorElement.hidden = false;
        }
    }
    
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId
        const errorElement = document.getElementById(`${fieldId}-error`
        
        if (field && errorElement) {
            field.classList.remove('error'
            errorElement.hidden = true;
        }
    }
    
    clearAllFieldErrors(fieldPrefix) {
        const fields = ['CustomerName', 'CustomerEmail', 'CustomerPhone', 'CustomerLocation'];
        fields.forEach(fieldName => {
            this.clearFieldError(fieldPrefix + fieldName
        }
    }
    
    showFieldValid(fieldId) {
        const field = document.getElementById(fieldId
        const errorElement = document.getElementById(`${fieldId}-error`
        
        if (field && errorElement) {
            field.classList.remove('error'
            field.classList.add('valid'
            errorElement.hidden = true;
        }
    }
    
    scrollToTop() {
        // Only scroll if user hasn't started scrolling yet
        if (window.scrollY === 0 || !window.userHasScrolled) {
            // Force scroll to top immediately
            window.scrollTo(0, 0
            
            // Then smooth scroll to ensure it's at the top
            setTimeout(() => {
                if (!window.userHasScrolled) {
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    }
                }
            }, 100
            
            // Additional force scroll after a delay
            setTimeout(() => {
                if (!window.userHasScrolled) {
                    window.scrollTo(0, 0
                }
            }, 500
        }
    }
}

// ===== GLOBAL FUNCTIONS =====

function clearAllSelections() {
    // Clear package selection
    document.querySelectorAll('.package-card').forEach(card => {
        card.classList.remove('selected'
    }
    
    // Clear additional feature selections
    document.querySelectorAll('.feature-card').forEach(card => {
        card.classList.remove('selected'
    }
    
    // Clear addon service selections
    document.querySelectorAll('.addon-card').forEach(card => {
        card.classList.remove('selected'
    }
    
    // Clear all customer information form fields
    const formFields = [
        'customerName',
        'customerEmail', 
        'customerPhone',
        'customerCompany',
        'customerLocation',
        'customerMessage'
    ];
    
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId
        if (field) {
            field.value = '';
        }
    }
    
    // Reset service area dropdown to default
    const serviceAreaSelect = document.getElementById('customerServiceArea'
    if (serviceAreaSelect) {
        serviceAreaSelect.value = '15';
    }
    
    // Reset quote system state
    if (window.quoteSystem) {
        // Keep the package selected (it's auto-selected)
        // window.quoteSystem.selectedPackage = null;
        
        // Clear all feature selections
        window.quoteSystem.selectedAdditionalFeatures.clear(
        window.quoteSystem.selectedAddonServices.clear(
        window.quoteSystem.currentStep = 1;
        
        // Clear localStorage
        window.quoteSystem.clearLocalStorage(
        

        
        // Re-render the sections
        window.quoteSystem.virtualRenderer.queueRender(() => window.quoteSystem.renderAdditionalFeatures(), 'normal'
        window.quoteSystem.virtualRenderer.queueRender(() => window.quoteSystem.renderAddonServices(), 'normal'
        window.quoteSystem.updateSummary(
        window.quoteSystem.updateGenerateButton(
        
        // Show notification
        window.quoteSystem.showNotification('All selections have been cleared', 'info'
    }
}

function generateQuote() {
    if (!window.quoteSystem) {
        alert('Quote system not available'
        return;
    }
    
    // Show customer info modal instead of direct validation
    showCustomerInfoModal(
}

function showCustomerInfoModal() {
    const modal = document.getElementById('customerInfoModal'
    if (modal) {
        modal.removeAttribute('hidden'
        modal.classList.add('show'
        document.body.style.overflow = 'hidden';
        
        // Focus on first input for accessibility
        const firstInput = modal.querySelector('input'
        if (firstInput) {
            firstInput.focus(
        }
        
        // Initialize country selector for modal
        initializeModalCountrySelector(
        } else {
        }
}

function closeCustomerInfoModal() {
    const modal = document.getElementById('customerInfoModal'
    
    if (modal) {
        modal.classList.remove('show'
        document.body.style.overflow = 'auto';
    }
}

function submitCustomerInfo() {
    if (!window.quoteSystem) {
        alert('Quote system not available'
        return;
    }
    
    // Get the submit button and form loader
    const submitBtn = document.getElementById('submitCustomerInfoBtn'
    const formLoader = document.getElementById('formLoader'
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    
    // Set loading state for submit button
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading'
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Validating...';
        
        // Reinitialize icons
        if (window.lucide) {
            lucide.createIcons(
        }
    }
    
    // Collect customer information from modal
    const customerInfo = {
        name: document.getElementById('modalCustomerName')?.value?.trim() || '',
        email: document.getElementById('modalCustomerEmail')?.value?.trim() || '',
        company: document.getElementById('modalCustomerCompany')?.value?.trim() || '',
        location: document.getElementById('modalCustomerLocation')?.value?.trim() || '',
        serviceArea: document.getElementById('modalCustomerServiceArea')?.value || '15',
        message: document.getElementById('modalCustomerMessage')?.value?.trim() || ''
    };
    
    // Get phone number with country code
    const countryCode = document.getElementById('modalCountryCode')?.value || '+1';
    const phoneNumber = document.getElementById('modalCustomerPhone')?.value?.trim() || '';
    const fullPhoneNumber = phoneNumber ? `${countryCode}${phoneNumber}` : '';
    
    // Add phone number to customer info
    customerInfo.phone = fullPhoneNumber;
    
    // Comprehensive form validation with error display
    const validationErrors = [];
    
    // Show validation errors for form submission
    if (!window.quoteSystem.validateAndShowErrors()) {
        // Hide form loader overlay
        if (formLoader) {
            formLoader.classList.remove('show'
            setTimeout(() => {
                formLoader.setAttribute('hidden', ''
            }, 300
        }
        
        // Reset button state
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading'
            submitBtn.innerHTML = originalText;
            
            // Reinitialize icons
            if (window.lucide) {
                lucide.createIcons(
            }
        }
        
        // Show single validation error (first error found)
        const errorMessage = window.quoteSystem.validationErrors && window.quoteSystem.validationErrors.length > 0 
            ? window.quoteSystem.validationErrors[0]
            : 'Please fix the validation errors in the form';
        window.quoteSystem.showNotification(errorMessage, 'error'
        return;
    }
    
    // Close the modal first
    closeCustomerInfoModal(
    
    // Show form loader overlay after validation passes
    if (formLoader) {
        formLoader.removeAttribute('hidden'
        // Small delay to ensure modal is closed before showing loader
        setTimeout(() => {
            formLoader.classList.add('show'
        }, 100
    }
    
    // Update button text to show processing
    if (submitBtn) {
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Processing...';
        
        // Reinitialize icons
        if (window.lucide) {
            lucide.createIcons(
        }
    }
    
    // Generate quote data
    const quoteData = {
        selectedPackage: window.quoteSystem.selectedPackage,
        selectedAdditionalFeatures: Array.from(window.quoteSystem.selectedAdditionalFeatures),
        selectedAddonServices: Array.from(window.quoteSystem.selectedAddonServices),
        totalPrice: window.quoteSystem.totalPrice,
        customerInfo: customerInfo,
        generatedAt: new Date().toLocaleString()
    };
    
    // Store quote data in localStorage for the success page
    localStorage.setItem('quoteData', JSON.stringify(quoteData)
    
    // Simulate processing time for better UX
    setTimeout(() => {
        // Hide loader before redirect
        if (formLoader) {
            formLoader.classList.remove('show'
        }
        
        // Redirect to success page
        window.location.href = '/success.html';
        
        // Note: Button state will be reset when page redirects
        // No need to reset here as we're leaving the page
    }, 1500 // 1.5 second delay for better UX
}

function initializeModalCountrySelector() {
    // Initialize country selector for the modal
    const trigger = document.getElementById('modalCountrySelectTrigger'
    const dropdown = document.getElementById('modalCountrySelectDropdown'
    const searchInput = document.getElementById('modalCountrySearch'
    const countryList = document.getElementById('modalCountryList'
    const hiddenSelect = document.getElementById('modalCountryCode'
    
    if (!trigger || !dropdown || !searchInput || !countryList || !hiddenSelect) {
        return;
    }
    
    // Use the same countries array as the main selector
    const countries = window.quoteSystem ? window.quoteSystem.countries || [] : [];
    
    // Render countries
    function renderCountries(filteredCountries = countries) {
        countryList.innerHTML = filteredCountries.map(country => `
            <div class="country-item" data-code="${country.code}">
                <img src="https://flagcdn.com/w20/${country.flag}.png" alt="${country.name}" class="country-flag">
                <span class="country-code">${country.code}</span>
            </div>
        `).join(''
    }
    
    // Initial render
    renderCountries(
    
    // Event listeners
    trigger.addEventListener('click', () => {
        const isHidden = dropdown.hidden;
        dropdown.hidden = !isHidden;
        if (!isHidden) {
            searchInput.focus(
        }
    }
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase(
        const filteredCountries = countries.filter(country => 
            country.name.toLowerCase().includes(searchTerm) ||
            country.code.toLowerCase().includes(searchTerm) ||
            country.flag.toLowerCase().includes(searchTerm)

        renderCountries(filteredCountries
    }
    
    countryList.addEventListener('click', (e) => {
        const countryItem = e.target.closest('.country-item'
        if (countryItem) {
            const code = countryItem.dataset.code;
            const country = countries.find(c => c.code === code
            
            if (country) {
                document.getElementById('modalSelectedFlag').src = `https://flagcdn.com/w20/${country.flag}.png`;
                document.getElementById('modalSelectedCountryCode').textContent = country.code;
                hiddenSelect.value = country.code;
                dropdown.hidden = true;
            }
        }
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.hidden = true;
        }
    }
}



function displayThankYouPopup(quoteData) {
    // Get selected package and features
    const selectedPackage = window.quoteSystem.packages.find(p => p.id === quoteData.selectedPackage
    const selectedFeatures = quoteData.selectedAdditionalFeatures.map(featureId => {
        return window.quoteSystem.additionalFeatures.find(f => f.id === featureId
    }).filter(Boolean
    
    const selectedAddons = quoteData.selectedAddonServices.map(addonId => {
        return window.quoteSystem.addonServices.find(a => a.id === addonId
    }).filter(Boolean
    
    // Generate thank you popup content
    const popupContent = `
        <div class="thank-you-popup">
            <div class="thank-you-header">
                <div class="thank-you-icon">
                    <i data-lucide="check-circle"></i>
                </div>
                <h2>Thank You!</h2>
                <p>Your quote has been generated successfully</p>
            </div>
            
            <div class="quote-details">
                <div class="quote-summary">
                    <h3>Quote Summary</h3>
                    <div class="summary-item">
                        <span>Package:</span>
                        <span>${selectedPackage ? selectedPackage.name : 'Basic Package'}</span>
                    </div>
                    <div class="summary-item">
                        <span>Base Price:</span>
                        <span>$${1200}</span>
                    </div>
                    ${selectedFeatures.length > 0 ? `
                        <div class="summary-item">
                            <span>Additional Features:</span>
                            <span>${selectedFeatures.length} selected</span>
                        </div>
                    ` : ''}
                    ${selectedAddons.length > 0 ? `
                        <div class="summary-item">
                            <span>Add-on Services:</span>
                            <span>${selectedAddons.length} selected</span>
                        </div>
                    ` : ''}
                    <div class="summary-item total">
                        <span>Total Price:</span>
                        <span>$${quoteData.totalPrice.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="selected-items">
                    ${selectedFeatures.length > 0 ? `
                        <div class="items-section">
                            <h4>Selected Features:</h4>
                            <ul>
                                ${selectedFeatures.map(feature => `
                                    <li>${feature.name} - $${feature.price}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${selectedAddons.length > 0 ? `
                        <div class="items-section">
                            <h4>Selected Add-ons:</h4>
                            <ul>
                                ${selectedAddons.map(addon => `
                                    <li>${addon.name} - $${addon.price}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-secondary" onclick="downloadQuote()">
                    <i data-lucide="download"></i>
                    Download Quote
                </button>
                <button class="btn btn-primary" onclick="proceedToPayment()">
                    <i data-lucide="credit-card"></i>
                    Proceed to Payment
                </button>
                <button class="btn btn-outline" onclick="closeThankYouPopup()">
                    <i data-lucide="x"></i>
                    Close
                </button>
            </div>
        </div>
    `;
    
    // Create and show popup
    showThankYouPopup(popupContent
}

function showThankYouPopup(content) {
    // Remove existing popup if any
    const existingPopup = document.querySelector('.thank-you-overlay'
    if (existingPopup) {
        existingPopup.remove(
    }
    
    // Create overlay
    const overlay = document.createElement('div'
    overlay.className = 'thank-you-overlay';
    overlay.innerHTML = `
        <div class="thank-you-modal">
            ${content}
        </div>
    `;
    
    // Add to page
    document.body.appendChild(overlay
    
    // Show with animation
    setTimeout(() => {
        overlay.classList.add('show'
    }, 10
    
    // Initialize icons
    lucide.createIcons(
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeThankYouPopup() {
    const overlay = document.querySelector('.thank-you-overlay'
    if (overlay) {
        overlay.classList.remove('show'
        setTimeout(() => {
            overlay.remove(
            document.body.style.overflow = 'auto';
        }, 300
    }
}

function proceedToPayment() {
    alert('Payment processing would be implemented here. Redirecting to payment gateway...'
    // Here you would integrate with a payment processor like Stripe, PayPal, etc.
}

// Scroll to top function
function scrollToTop() {
    // Only scroll if user hasn't started scrolling yet
    if (window.scrollY === 0 || !window.userHasScrolled) {
        // Force scroll to top immediately
        window.scrollTo(0, 0
        
        // Then smooth scroll to ensure it's at the top
        setTimeout(() => {
            if (!window.userHasScrolled) {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                }
            }
        }, 100
        
        // Additional force scroll after a delay
        setTimeout(() => {
            if (!window.userHasScrolled) {
                window.scrollTo(0, 0
            }
        }, 500
    }
}

function downloadQuote() {
    // Get current quote data
    const quoteData = {
        selectedPackage: window.quoteSystem.selectedPackage,
        selectedAdditionalFeatures: Array.from(window.quoteSystem.selectedAdditionalFeatures),
        selectedAddonServices: Array.from(window.quoteSystem.selectedAddonServices),
        totalPrice: window.quoteSystem.totalPrice,
        customerInfo: {
            name: document.getElementById('customerName').value.trim(),
            email: document.getElementById('customerEmail').value.trim(),
            phone: document.getElementById('customerPhone').value.trim(),
            company: document.getElementById('customerCompany').value.trim(),
            location: document.getElementById('customerLocation').value.trim(),
            serviceArea: document.getElementById('customerServiceArea').value || '15',
            message: document.getElementById('customerMessage').value.trim()
        },
        generatedAt: new Date().toLocaleString()
    };
    
    // Generate PDF
    generatePDF(quoteData
}

function generatePDF(quoteData) {
    // Check if jsPDF is available
    if (typeof window.jsPDF === 'undefined') {
        alert('PDF generation library not loaded. Please refresh the page and try again.'
        return;
    }
    
    const { jsPDF } = window.jsPDF;
    const doc = new jsPDF(
    
    // Set document properties
    doc.setProperties({
        title: 'HVAC Website Development Quote',
        subject: 'Professional Quote for Website Development',
        author: 'Anass El - Full-Stack Web Developer',
        creator: 'HVAC Quote System'
    }
    
    // Add header
    addHeader(doc
    
    // Add customer information
    addCustomerInfo(doc, quoteData.customerInfo
    
    // Add quote summary
    addQuoteSummary(doc, quoteData
    
    // Add selected items details
    addSelectedItems(doc, quoteData
    
    // Add terms and conditions
    addTermsAndConditions(doc
    
    // Add footer
    addFooter(doc
    
    // Generate filename
    const customerName = quoteData.customerInfo.name || 'Customer';
    const date = new Date().toISOString().split('T')[0];
    const filename = `HVAC_Website_Quote_${customerName.replace(/\s+/g, '_')}_${date}.pdf`;
    
    // Save the PDF
    doc.save(filename
    
    // Show success message
    window.quoteSystem.showNotification('Quote downloaded successfully!', 'success'
}

function addHeader(doc) {
    // Title
    doc.setFontSize(24
    doc.setFont('helvetica', 'bold'
    doc.setTextColor(59, 130, 246 // Blue color
    doc.text('Professional HVAC & Appliance Repair', 20, 30
    doc.text('Website Development Quote', 20, 40
    
    // Subtitle
    doc.setFontSize(12
    doc.setFont('helvetica', 'normal'
    doc.setTextColor(107, 114, 128 // Gray color
    doc.text('Custom website development for your service business', 20, 50
    
    // Developer info
    doc.setFontSize(14
    doc.setFont('helvetica', 'bold'
    doc.setTextColor(34, 197, 94 // Green color
    doc.text('Anass El - Full-Stack Web Developer', 20, 70
    
    // Date
    doc.setFontSize(10
    doc.setFont('helvetica', 'normal'
    doc.setTextColor(107, 114, 128
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}`, 20, 80
    
    // Add decorative line
    doc.setDrawColor(59, 130, 246
    doc.setLineWidth(0.5
    doc.line(20, 85, 190, 85
}

function addCustomerInfo(doc, customerInfo) {
    doc.addPage(
    
    // Section title
    doc.setFontSize(16
    doc.setFont('helvetica', 'bold'
    doc.setTextColor(17, 24, 39 // Dark gray
    doc.text('Customer Information', 20, 30
    
    // Customer details
    doc.setFontSize(11
    doc.setFont('helvetica', 'normal'
    doc.setTextColor(55, 65, 81
    
    let yPosition = 50;
    const lineHeight = 8;
    
    if (customerInfo.name) {
        doc.text(`Name: ${customerInfo.name}`, 20, yPosition
        yPosition += lineHeight;
    }
    
    if (customerInfo.email) {
        doc.text(`Email: ${customerInfo.email}`, 20, yPosition
        yPosition += lineHeight;
    }
    
    if (customerInfo.phone) {
        doc.text(`Phone: ${customerInfo.phone}`, 20, yPosition
        yPosition += lineHeight;
    }
    
    if (customerInfo.company) {
        doc.text(`Company: ${customerInfo.company}`, 20, yPosition
        yPosition += lineHeight;
    }
    
    if (customerInfo.location) {
        doc.text(`Location: ${customerInfo.location}`, 20, yPosition
        yPosition += lineHeight;
    }
    
    if (customerInfo.serviceArea) {
        doc.text(`Service Area: ${customerInfo.serviceArea} miles`, 20, yPosition
        yPosition += lineHeight;
    }
    
    if (customerInfo.message) {
        yPosition += lineHeight;
        doc.text('Additional Requirements:', 20, yPosition
        yPosition += lineHeight;
        
        // Handle long messages
        const words = customerInfo.message.split(' '
        let line = '';
        for (let word of words) {
            const testLine = line + word + ' ';
            if (doc.getTextWidth(testLine) < 170) {
                line = testLine;
            } else {
                doc.text(line, 20, yPosition
                yPosition += lineHeight;
                line = word + ' ';
            }
        }
        if (line) {
            doc.text(line, 20, yPosition
        }
    }
}

function addQuoteSummary(doc, quoteData) {
    // Section title
    doc.setFontSize(16
    doc.setFont('helvetica', 'bold'
    doc.setTextColor(17, 24, 39
    doc.text('Quote Summary', 20, 30
    
    // Get selected items
    const selectedPackage = window.quoteSystem.packages.find(p => p.id === quoteData.selectedPackage
    const selectedFeatures = quoteData.selectedAdditionalFeatures.map(featureId => {
        return window.quoteSystem.additionalFeatures.find(f => f.id === featureId
    }).filter(Boolean
    
    const selectedAddons = quoteData.selectedAddonServices.map(addonId => {
        return window.quoteSystem.addonServices.find(a => a.id === addonId
    }).filter(Boolean
    
    // Summary table
    doc.setFontSize(11
    doc.setFont('helvetica', 'normal'
    doc.setTextColor(55, 65, 81
    
    let yPosition = 50;
    const lineHeight = 8;
    
    // Base package
    doc.text('Base Package:', 20, yPosition
    doc.text(selectedPackage ? selectedPackage.name : 'Basic Package', 80, yPosition
    doc.text('$1,200', 160, yPosition
    yPosition += lineHeight;
    
    // Additional features
    if (selectedFeatures.length > 0) {
        yPosition += lineHeight;
        doc.setFont('helvetica', 'bold'
        doc.text('Additional Features:', 20, yPosition
        yPosition += lineHeight;
        doc.setFont('helvetica', 'normal'
        
        let featuresTotal = 0;
        for (let feature of selectedFeatures) {
            doc.text(`• ${feature.name}`, 30, yPosition
            doc.text(`$${feature.price}`, 160, yPosition
            yPosition += lineHeight;
            featuresTotal += feature.price;
        }
        
        doc.setFont('helvetica', 'bold'
        doc.text('Features Subtotal:', 20, yPosition
        doc.text(`$${featuresTotal}`, 160, yPosition
        yPosition += lineHeight;
    }
    
    // Add-on services
    if (selectedAddons.length > 0) {
        yPosition += lineHeight;
        doc.setFont('helvetica', 'bold'
        doc.text('Add-on Services:', 20, yPosition
        yPosition += lineHeight;
        doc.setFont('helvetica', 'normal'
        
        let addonsTotal = 0;
        for (let addon of selectedAddons) {
            doc.text(`• ${addon.name}`, 30, yPosition
            doc.text(`$${addon.price}`, 160, yPosition
            yPosition += lineHeight;
            addonsTotal += addon.price;
        }
        
        doc.setFont('helvetica', 'bold'
        doc.text('Add-ons Subtotal:', 20, yPosition
        doc.text(`$${addonsTotal}`, 160, yPosition
        yPosition += lineHeight;
    }
    
    // Total
    yPosition += lineHeight;
    doc.setFontSize(14
    doc.setFont('helvetica', 'bold'
    doc.setTextColor(59, 130, 246
    doc.text('TOTAL:', 20, yPosition
    doc.text(`$${quoteData.totalPrice.toLocaleString()}`, 160, yPosition
    
    // Add decorative line
    doc.setDrawColor(59, 130, 246
    doc.setLineWidth(0.5
    doc.line(20, yPosition + 5, 190, yPosition + 5
}

function addSelectedItems(doc, quoteData) {
    doc.addPage(
    
    // Section title
    doc.setFontSize(16
    doc.setFont('helvetica', 'bold'
    doc.setTextColor(17, 24, 39
    doc.text('Selected Services & Features', 20, 30
    
    let yPosition = 50;
    const lineHeight = 8;
    
    // Base package details
    const selectedPackage = window.quoteSystem.packages.find(p => p.id === quoteData.selectedPackage
    if (selectedPackage) {
        doc.setFontSize(12
        doc.setFont('helvetica', 'bold'
        doc.setTextColor(34, 197, 94
        doc.text('Base Package:', 20, yPosition
        yPosition += lineHeight;
        
        doc.setFontSize(10
        doc.setFont('helvetica', 'normal'
        doc.setTextColor(55, 65, 81
        doc.text(selectedPackage.name, 30, yPosition
        yPosition += lineHeight;
        
        // Package description
        const words = selectedPackage.description.split(' '
        let line = '';
        for (let word of words) {
            const testLine = line + word + ' ';
            if (doc.getTextWidth(testLine) < 150) {
                line = testLine;
            } else {
                doc.text(line, 30, yPosition
                yPosition += lineHeight;
                line = word + ' ';
            }
        }
        if (line) {
            doc.text(line, 30, yPosition
            yPosition += lineHeight;
        }
    }
    
    // Additional features
    const selectedFeatures = quoteData.selectedAdditionalFeatures.map(featureId => {
        return window.quoteSystem.additionalFeatures.find(f => f.id === featureId
    }).filter(Boolean
    
    if (selectedFeatures.length > 0) {
        yPosition += lineHeight;
        doc.setFontSize(12
        doc.setFont('helvetica', 'bold'
        doc.setTextColor(59, 130, 246
        doc.text('Additional Features:', 20, yPosition
        yPosition += lineHeight;
        
        for (let feature of selectedFeatures) {
            doc.setFontSize(10
            doc.setFont('helvetica', 'bold'
            doc.setTextColor(55, 65, 81
            doc.text(`• ${feature.name} - $${feature.price}`, 30, yPosition
            yPosition += lineHeight;
            
            doc.setFont('helvetica', 'normal'
            const words = feature.description.split(' '
            let line = '';
            for (let word of words) {
                const testLine = line + word + ' ';
                if (doc.getTextWidth(testLine) < 150) {
                    line = testLine;
                } else {
                    doc.text(line, 40, yPosition
                    yPosition += lineHeight;
                    line = word + ' ';
                }
            }
            if (line) {
                doc.text(line, 40, yPosition
                yPosition += lineHeight;
            }
            yPosition += lineHeight;
        }
    }
    
    // Add-on services
    const selectedAddons = quoteData.selectedAddonServices.map(addonId => {
        return window.quoteSystem.addonServices.find(a => a.id === addonId
    }).filter(Boolean
    
    if (selectedAddons.length > 0) {
        yPosition += lineHeight;
        doc.setFontSize(12
        doc.setFont('helvetica', 'bold'
        doc.setTextColor(245, 158, 11 // Orange color
        doc.text('Add-on Services:', 20, yPosition
        yPosition += lineHeight;
        
        for (let addon of selectedAddons) {
            doc.setFontSize(10
            doc.setFont('helvetica', 'bold'
            doc.setTextColor(55, 65, 81
            doc.text(`• ${addon.name} - $${addon.price}`, 30, yPosition
            yPosition += lineHeight;
            
            doc.setFont('helvetica', 'normal'
            const words = addon.description.split(' '
            let line = '';
            for (let word of words) {
                const testLine = line + word + ' ';
                if (doc.getTextWidth(testLine) < 150) {
                    line = testLine;
                } else {
                    doc.text(line, 40, yPosition
                    yPosition += lineHeight;
                    line = word + ' ';
                }
            }
            if (line) {
                doc.text(line, 40, yPosition
                yPosition += lineHeight;
            }
            yPosition += lineHeight;
        }
    }
}

function addTermsAndConditions(doc) {
    doc.addPage(
    
    // Section title
    doc.setFontSize(16
    doc.setFont('helvetica', 'bold'
    doc.setTextColor(17, 24, 39
    doc.text('Terms & Conditions', 20, 30
    
    // Terms content
    doc.setFontSize(10
    doc.setFont('helvetica', 'normal'
    doc.setTextColor(55, 65, 81
    
    const terms = [
        '1. This quote is valid for 30 days from the date of generation.',
        '2. Payment terms: 50% upfront, 50% upon project completion.',
                    '3. Project timeline: 15-20 business days for basic package.',
        '4. Additional features may extend the timeline.',
        '5. Revisions: 2 rounds of revisions included.',
        '6. Hosting and domain costs are not included unless specified.',
        '7. SEO optimization includes basic on-page optimization.',
        '8. Mobile responsiveness covers all modern devices.',
        '9. Content creation is not included unless specified.',
        '10. Maintenance and updates are not included in this quote.'
    ];
    
    let yPosition = 50;
    const lineHeight = 6;
    
    for (let term of terms) {
        doc.text(term, 20, yPosition
        yPosition += lineHeight;
    }
}

function addFooter(doc) {
    const pageCount = doc.internal.getNumberOfPages(
    
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i
        
        // Footer line
        doc.setDrawColor(200, 200, 200
        doc.setLineWidth(0.1
        doc.line(20, 280, 190, 280
        
        // Footer text
        doc.setFontSize(8
        doc.setFont('helvetica', 'normal'
        doc.setTextColor(107, 114, 128
        doc.text('Anass El - Full-Stack Web Developer | Professional HVAC Website Development', 20, 285
        doc.text(`Page ${i} of ${pageCount}`, 170, 285
    }
}

function generateQuoteContent(quoteData) {
    const selectedPackage = window.quoteSystem.packages.find(p => p.id === quoteData.selectedPackage
    
    // Calculate timeline based on selections
            let timeline = '18-24 days';
    if (selectedPackage) {
        timeline = selectedPackage.timeline;
    }
    
    // Add days for additional features
    const additionalFeatures = quoteData.selectedAdditionalFeatures.length;
    if (additionalFeatures > 0) {
        const additionalDays = Math.ceil(additionalFeatures / 2
        const baseDays = parseInt(timeline.match(/(\d+)/)[1]
        const totalDays = baseDays + additionalDays;
        timeline = `${totalDays}-${totalDays + 2} days`;
    }
    
    // Get selected features and addon services
    const selectedFeatures = quoteData.selectedAdditionalFeatures.map(featureId => {
        return window.quoteSystem.additionalFeatures.find(f => f.id === featureId
    }).filter(Boolean
    
    const selectedAddons = quoteData.selectedAddonServices.map(addonId => {
        return window.quoteSystem.addonServices.find(a => a.id === addonId
    }).filter(Boolean
    
    return `
        <div class="quote-content">
            <!-- Quote Header -->
            <div class="quote-header">
                <div class="quote-header-main">
                    <div class="quote-logo">
                        <i data-lucide="building-2"></i>
                    </div>
                    <div class="quote-title-section">
                        <h2>Professional HVAC & Appliance Repair Website</h2>
                    <p class="quote-subtitle">Custom website development for your service business</p>
                        <div class="quote-badges">
                            <span class="badge badge-primary">Professional Design</span>
                            <span class="badge badge-success">Mobile Responsive</span>
                            <span class="badge badge-info">SEO Optimized</span>
                        </div>
                    </div>
                </div>
                <div class="quote-header-meta">
                    <div class="quote-meta-grid">
                        <div class="meta-item">
                            <i data-lucide="calendar"></i>
                            <div>
                                <strong>Generated:</strong><br>
                                ${new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                        </div>
                        <div class="meta-item">
                            <i data-lucide="clock"></i>
                            <div>
                                <strong>Valid Until:</strong><br>
                                ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric'
                        })}
                            </div>
                        </div>
                        <div class="meta-item">
                            <i data-lucide="hash"></i>
                            <div>
                                <strong>Quote #:</strong><br>
                                Q-${Date.now().toString().slice(-6)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Quote Summary Cards -->
            <div class="quote-summary-section">
                <div class="quote-summary-grid">
                    <div class="summary-card primary">
                        <div class="summary-icon">
                            <i data-lucide="dollar-sign"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Total Investment</h3>
                            <p class="summary-value">$${quoteData.totalPrice.toLocaleString()}</p>
                            <p class="summary-note">Flexible payment options available</p>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon">
                            <i data-lucide="clock"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Development Timeline</h3>
                            <p class="summary-value">${timeline}</p>
                            <p class="summary-note">From project start</p>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon">
                            <i data-lucide="package"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Package</h3>
                            <p class="summary-value">${selectedPackage ? selectedPackage.name : 'Custom Solution'}</p>
                            <p class="summary-note">Base package included</p>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon">
                            <i data-lucide="plus-circle"></i>
                        </div>
                        <div class="summary-content">
                            <h3>Additional Features</h3>
                            <p class="summary-value">${selectedFeatures.length}</p>
                            <p class="summary-note">Enhancements selected</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Package Details -->
            <div class="quote-details-section">
                <h3><i data-lucide="list"></i> Package Details</h3>
                <div class="package-details">
                    <div class="package-info">
                        <h4>${selectedPackage ? selectedPackage.name : 'Professional Website Package'}</h4>
                        <p class="package-description">${selectedPackage ? selectedPackage.description : 'Complete professional website solution for HVAC and appliance repair businesses.'}</p>
                        <div class="package-features">
                            <h5>Included Features:</h5>
                            <ul class="feature-list">
                                ${selectedPackage && selectedPackage.includedFeatures ? selectedPackage.includedFeatures.map(feature => 
                                    `<li><i data-lucide="check"></i> ${feature}</li>`
                                ).join('') : `
                                <li><i data-lucide="check"></i> Professional Homepage Design</li>
                                <li><i data-lucide="check"></i> Mobile-Responsive Layout</li>
                                <li><i data-lucide="check"></i> Contact Forms & Phone Integration</li>
                                <li><i data-lucide="check"></i> Service Pages (HVAC & Appliance)</li>
                                <li><i data-lucide="check"></i> About Us Page</li>
                                <li><i data-lucide="check"></i> Emergency Service Call Buttons</li>
                                <li><i data-lucide="check"></i> Service Area Coverage</li>
                                <li><i data-lucide="check"></i> Basic SEO Optimization</li>
                                <li><i data-lucide="check"></i> Google Analytics Integration</li>
                                <li><i data-lucide="check"></i> Customer Testimonials Section</li>
                                <li><i data-lucide="check"></i> Business Hours & Location</li>
                                <li><i data-lucide="check"></i> Brand Support Information</li>
                                `}
                        </ul>
                    </div>
                    </div>
                    </div>
            </div>
            
            <!-- Additional Features -->
            ${selectedFeatures.length > 0 ? `
            <div class="quote-details-section">
                <h3><i data-lucide="plus-circle"></i> Additional Features</h3>
                <div class="features-grid">
                    ${selectedFeatures.map(feature => `
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i data-lucide="${feature.icon || 'star'}"></i>
                        </div>
                        <div class="feature-content">
                            <h4>${feature.name}</h4>
                            <p>${feature.description}</p>
                            <span class="feature-price">$${feature.price.toLocaleString()}</span>
                        </div>
                    </div>
                    `).join('')}
                </div>
                    </div>
                    ` : ''}
                    
            <!-- Add-On Services -->
            ${selectedAddons.length > 0 ? `
            <div class="quote-details-section">
                <h3><i data-lucide="settings"></i> Add-On Services</h3>
                <div class="addons-grid">
                    ${selectedAddons.map(addon => `
                    <div class="addon-item">
                        <div class="addon-icon">
                            <i data-lucide="${addon.icon || 'tool'}"></i>
                        </div>
                        <div class="addon-content">
                            <h4>${addon.name}</h4>
                            <p>${addon.description}</p>
                            <span class="addon-price">$${addon.price.toLocaleString()}</span>
                        </div>
                    </div>
                    `).join('')}
                </div>
                    </div>
                    ` : ''}
                    
            <!-- Pricing Breakdown -->
            <div class="quote-details-section">
                <h3><i data-lucide="calculator"></i> Pricing Breakdown</h3>
                <div class="pricing-breakdown">
                    <div class="breakdown-item">
                        <span class="item-label">Base Package</span>
                        <span class="item-price">$${selectedPackage ? selectedPackage.price.toLocaleString() : '1,200'}</span>
                    </div>
                    ${selectedFeatures.map(feature => `
                    <div class="breakdown-item">
                        <span class="item-label">${feature.name}</span>
                        <span class="item-price">$${feature.price.toLocaleString()}</span>
                </div>
                    `).join('')}
                    ${selectedAddons.map(addon => `
                    <div class="breakdown-item">
                        <span class="item-label">${addon.name}</span>
                        <span class="item-price">$${addon.price.toLocaleString()}</span>
                    </div>
                    `).join('')}
                    <div class="breakdown-total">
                        <span class="total-label">Total Investment</span>
                        <span class="total-value">$${quoteData.totalPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <!-- Customer Information -->
            <div class="customer-info-section">
                <h3><i data-lucide="user"></i> Customer Information</h3>
                <div class="customer-info-grid">
                    <div class="info-item">
                        <i data-lucide="user"></i>
                        <div>
                            <strong>Name:</strong><br>
                            ${quoteData.customerInfo.name}
                        </div>
                    </div>
                    <div class="info-item">
                        <i data-lucide="mail"></i>
                        <div>
                            <strong>Email:</strong><br>
                            ${quoteData.customerInfo.email}
                    </div>
                    </div>
                    ${quoteData.customerInfo.phone ? `
                    <div class="info-item">
                        <i data-lucide="phone"></i>
                        <div>
                            <strong>Phone:</strong><br>
                            ${quoteData.customerInfo.phone}
                    </div>
                    </div>
                    ` : ''}
                    ${quoteData.customerInfo.company ? `
                    <div class="info-item">
                        <i data-lucide="building"></i>
                        <div>
                            <strong>Company:</strong><br>
                            ${quoteData.customerInfo.company}
                        </div>
                    </div>
                    ` : ''}
                    <div class="info-item">
                        <i data-lucide="map-pin"></i>
                        <div>
                            <strong>Service Location:</strong><br>
                            ${quoteData.customerInfo.location}
                        </div>
                    </div>
                    <div class="info-item">
                        <i data-lucide="navigation"></i>
                        <div>
                            <strong>Service Area:</strong><br>
                            ${quoteData.customerInfo.serviceArea} miles radius
                        </div>
                    </div>
                </div>
                ${quoteData.customerInfo.message ? `
                <div class="additional-requirements">
                    <h4><i data-lucide="message-square"></i> Additional Requirements</h4>
                    <p>${quoteData.customerInfo.message}</p>
                </div>
                ` : ''}
            </div>
            
            <!-- Payment Options -->
            <div class="payment-options-section">
                <h3><i data-lucide="credit-card"></i> Payment Options</h3>
                <div class="payment-options-grid">
                    <div class="payment-option recommended">
                        <div class="payment-header">
                            <div class="payment-icon">
                                <i data-lucide="shield-check"></i>
                            </div>
                            <div class="payment-badge">Recommended</div>
                        </div>
                        <div class="payment-content">
                            <h4>50% Upfront Payment</h4>
                            <div class="payment-breakdown">
                                <div class="payment-item">
                                    <span>Upfront Payment:</span>
                                    <span class="payment-amount">$${Math.round(quoteData.totalPrice * 0.5).toLocaleString()}</span>
                                </div>
                                <div class="payment-item">
                                    <span>Upon Completion:</span>
                                    <span class="payment-amount">$${Math.round(quoteData.totalPrice * 0.5).toLocaleString()}</span>
                                </div>
                            </div>
                            <ul class="payment-benefits">
                                <li><i data-lucide="check"></i> Secure project start</li>
                                <li><i data-lucide="check"></i> Flexible payment terms</li>
                                <li><i data-lucide="check"></i> No hidden fees</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="payment-option">
                        <div class="payment-header">
                            <div class="payment-icon">
                                <i data-lucide="dollar-sign"></i>
                            </div>
                        </div>
                        <div class="payment-content">
                            <h4>Full Payment</h4>
                            <div class="payment-breakdown">
                                <div class="payment-item">
                                    <span>Total Amount:</span>
                                    <span class="payment-amount">$${quoteData.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                            <ul class="payment-benefits">
                                <li><i data-lucide="check"></i> One-time payment</li>
                                <li><i data-lucide="check"></i> 5% discount applied</li>
                                <li><i data-lucide="check"></i> Priority support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Project Timeline -->
            <div class="timeline-section">
                <h3><i data-lucide="calendar"></i> Project Timeline</h3>
                <div class="timeline-steps">
                    <div class="timeline-step">
                        <div class="step-icon">
                            <i data-lucide="play"></i>
                        </div>
                        <div class="step-content">
                            <h4>Project Start</h4>
                            <p>Immediate start upon payment confirmation</p>
                        </div>
                    </div>
                    <div class="timeline-step">
                        <div class="step-icon">
                            <i data-lucide="layout"></i>
                        </div>
                        <div class="step-content">
                            <h4>Design Phase</h4>
                            <p>Custom design and layout creation</p>
                        </div>
                    </div>
                    <div class="timeline-step">
                        <div class="step-icon">
                            <i data-lucide="code"></i>
                        </div>
                        <div class="step-content">
                            <h4>Development</h4>
                            <p>Website development and feature implementation</p>
                        </div>
                    </div>
                    <div class="timeline-step">
                        <div class="step-icon">
                            <i data-lucide="check-circle"></i>
                        </div>
                        <div class="step-content">
                            <h4>Launch & Support</h4>
                            <p>Website launch and ongoing support</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- What's Included -->
            <div class="included-section">
                <h3><i data-lucide="gift"></i> What's Included</h3>
                <div class="included-grid">
                    <div class="included-item">
                        <i data-lucide="wifi"></i>
                        <h4>Hosting Setup</h4>
                        <p>Professional hosting configuration</p>
                    </div>
                    <div class="included-item">
                        <i data-lucide="shield"></i>
                        <h4>SSL Certificate</h4>
                        <p>Secure HTTPS connection</p>
                    </div>
                    <div class="included-item">
                        <i data-lucide="smartphone"></i>
                        <h4>Mobile Optimization</h4>
                        <p>Perfect on all devices</p>
                    </div>
                    <div class="included-item">
                        <i data-lucide="search"></i>
                        <h4>SEO Setup</h4>
                        <p>Search engine optimization</p>
                    </div>
                    <div class="included-item">
                        <i data-lucide="headphones"></i>
                        <h4>30 Days Support</h4>
                        <p>Post-launch assistance</p>
                    </div>
                    <div class="included-item">
                        <i data-lucide="download"></i>
                        <h4>Training</h4>
                        <p>Website management training</p>
                    </div>
                </div>
            </div>
            
            <!-- What's Included & Next Steps -->
            <div class="quote-footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <h4><i data-lucide="check-circle"></i> What's Included</h4>
                        <ul>
                            <li>Professional website design and development</li>
                            <li>Mobile-responsive design for all devices</li>
                            <li>SEO optimization for local search visibility</li>
                            <li>Content management system (CMS)</li>
                            <li>30 days of support and maintenance</li>
                            <li>Training and documentation</li>
                            <li>Google Analytics integration</li>
                            <li>Social media integration</li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4><i data-lucide="arrow-right"></i> Next Steps</h4>
                        <ol>
                            <li>Review and approve this quote</li>
                            <li>Sign the service agreement</li>
                            <li>Provide content and branding materials</li>
                            <li>Development begins within 24 hours</li>
                            <li>Regular progress updates throughout</li>
                            <li>Final review and launch</li>
                        </ol>
                    </div>
                </div>
                <div class="footer-note">
                    <div class="note-content">
                        <i data-lucide="info"></i>
                        <div>
                            <strong>Important:</strong> This quote is valid for 30 days from the date of generation. 
                            For questions, modifications, or to proceed with this quote, please contact us.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}





// Admin functionality removed

// Only disable scroll restoration on page refresh
if (performance.navigation.type === 1 && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Initialize user scroll tracking
window.userHasScrolled = false;
let scrollTimeout;

// Track user scrolling
window.addEventListener('scroll', function() {
    window.userHasScrolled = true;
    
    // Clear existing timeout
    clearTimeout(scrollTimeout
    
    // Reset the flag after 2 seconds of no scrolling
    scrollTimeout = setTimeout(() => {
        window.userHasScrolled = false;
    }, 2000
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize quote system
    window.quoteSystem = new QuoteSystem(
    
    // Ensure summary is updated after everything is loaded
    setTimeout(() => {
        if (window.quoteSystem) {
            window.quoteSystem.updateSummary(
            window.quoteSystem.updateGenerateButton(
            
            // Force price display
            const summaryTotalElement = document.getElementById('summaryTotal'
            if (summaryTotalElement) {
                const currentPrice = window.quoteSystem.calculateTotalPrice(
                summaryTotalElement.textContent = `$${currentPrice.toLocaleString()}`;
            }
            
            }
    }, 100
    
    // Also update summary when window is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (window.quoteSystem) {
                window.quoteSystem.updateSummary(
                window.quoteSystem.updateGenerateButton(
                
                // Force price display
                const summaryTotalElement = document.getElementById('summaryTotal'
                if (summaryTotalElement) {
                    const currentPrice = window.quoteSystem.calculateTotalPrice(
                    summaryTotalElement.textContent = `$${currentPrice.toLocaleString()}`;
                }
                
                }
        }, 200
    }
    
    // Update summary when page becomes visible (returning from About Us page)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && window.quoteSystem) {
            setTimeout(() => {
                // Force reload from localStorage and restore UI state
                window.quoteSystem.loadFromLocalStorage(
                window.quoteSystem.restoreUIState(
                window.quoteSystem.updateSummary(
                window.quoteSystem.updateGenerateButton(
                
                // Force price display
                const summaryTotalElement = document.getElementById('summaryTotal'
                if (summaryTotalElement) {
                    const currentPrice = window.quoteSystem.calculateTotalPrice(
                    summaryTotalElement.textContent = `$${currentPrice.toLocaleString()}`;
                }
                
                }, 100
        }
    }
    
    // Update summary when page gains focus (alternative method)
    window.addEventListener('focus', function() {
        if (window.quoteSystem) {
            setTimeout(() => {
                // Force reload from localStorage and restore UI state
                window.quoteSystem.loadFromLocalStorage(
                window.quoteSystem.restoreUIState(
                window.quoteSystem.updateSummary(
                window.quoteSystem.updateGenerateButton(
                
                // Force price display
                const summaryTotalElement = document.getElementById('summaryTotal'
                if (summaryTotalElement) {
                    const currentPrice = window.quoteSystem.calculateTotalPrice(
                    summaryTotalElement.textContent = `$${currentPrice.toLocaleString()}`;
                }
                
                }, 100
        }
    }
    
    // Update summary when page is shown (including back navigation)
    window.addEventListener('pageshow', function(event) {
        if (window.quoteSystem) {
            setTimeout(() => {
                // Force reload from localStorage and restore UI state
                window.quoteSystem.loadFromLocalStorage(
                window.quoteSystem.restoreUIState(
                window.quoteSystem.updateSummary(
                window.quoteSystem.updateGenerateButton(
                
                // Force price display
                const summaryTotalElement = document.getElementById('summaryTotal'
                if (summaryTotalElement) {
                    const currentPrice = window.quoteSystem.calculateTotalPrice(
                    summaryTotalElement.textContent = `$${currentPrice.toLocaleString()}`;
                }
                
                }, 100
        }
    }
    
    // Only scroll to top on page refresh/reload
    if (performance.navigation.type === 1) {
        // Page was refreshed/reloaded
        scrollToTop(
        
        // Also scroll to top when window loads completely
        window.addEventListener('load', function() {
            scrollToTop(
        }
        
        // Single additional scroll to top after a delay
        setTimeout(() => scrollToTop(), 1000
    }
    
    // Initialize modal functionality

    
    // Component tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn'
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active')
            
            // Add active class to clicked button
            this.classList.add('active'
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active'
            }
            
            // Show selected tab content
            const selectedContent = document.getElementById(`${tabName}-tab`
            if (selectedContent) {
                selectedContent.classList.add('active'
            }
        }
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle'
    const navList = document.querySelector('.nav-list'
    
    if (mobileMenuToggle && navList) {
        mobileMenuToggle.addEventListener('click', function() {
            navList.classList.toggle('active'
            this.classList.toggle('active'
        }
    }
    
    // Get Started button scroll functionality
    const getStartedBtn = document.querySelector('.hero-btn-primary'
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            const heroSection = document.querySelector('.hero-section'
            if (heroSection) {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                window.scrollTo({
                    top: heroBottom,
                    behavior: 'smooth'
                }
                
                // Update quote summary after scrolling
                setTimeout(() => {
                    if (window.quoteSystem) {
                        window.quoteSystem.updateSummary(
                        }
                }, 500
            }
        }
    }
    
    // Learn More button functionality
    const learnMoreBtn = document.querySelector('.hero-btn-secondary'
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            window.location.href = 'about-us.html';
        }
    }
}

// Helper functions for validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email
}

function isValidPhone(phone) {
    // Remove all non-digit characters except + at the beginning
    const cleaned = phone.replace(/[^\d+]/g, ''
    // Must start with + or digit, have 7-15 digits total
    const phoneRegex = /^[\+]?[1-9][\d]{6,14}$/;
    return phoneRegex.test(cleaned
}

// Add missing toggle methods for simplified system
QuoteSystem.prototype.toggleAdditionalFeature = function(card) {
    const featureId = card.dataset.featureId;
    if (!featureId) return;

    
    if (this.selectedAdditionalFeatures.has(featureId)) {
        this.selectedAdditionalFeatures.delete(featureId
        card.classList.remove('selected'
        } else {
        this.selectedAdditionalFeatures.add(featureId
        card.classList.add('selected'
        }
    
    // Update visual state
    this.updateAdditionalFeatureVisualState(card, featureId
    
    // Re-render and update
    this.virtualRenderer.queueRender(() => this.renderAdditionalFeatures(), 'normal'
    this.saveToLocalStorage(
    this.updateSummary(
    this.updateGenerateButton(
    
    // Show user feedback
    const feature = this.additionalFeatures.find(f => f.id === featureId
    if (feature) {
        const action = this.selectedAdditionalFeatures.has(featureId) ? 'added' : 'removed';
        this.showNotification(`${feature.name} ${action} to your quote`, 'success'
    }
};

QuoteSystem.prototype.updateAdditionalFeatureVisualState = function(card, featureId) {
    const isSelected = this.selectedAdditionalFeatures.has(featureId
    const isIncluded = card.classList.contains('included-in-package'
    
    // Update card classes
    if (isSelected) {
        card.classList.add('selected'
        card.classList.remove('not-selected'
    } else {
        card.classList.remove('selected'
        card.classList.add('not-selected'
    }
    
    // Update badges
    const existingBadges = card.querySelectorAll('.included-badge, .selected-badge, .not-selected-badge'
    existingBadges.forEach(badge => badge.remove()
    
    if (isIncluded) {
        card.insertAdjacentHTML('beforeend', '<div class="included-badge">Included</div>'
    } else if (isSelected) {
        card.insertAdjacentHTML('beforeend', '<div class="selected-badge">Selected</div>'
    } else {
        card.insertAdjacentHTML('beforeend', '<div class="not-selected-badge">Not Selected</div>'
    }
};

QuoteSystem.prototype.toggleAddonService = function(serviceId, card = null) {
    // If no card provided, try to find it
    if (!card) {
        card = document.querySelector(`[data-service-id="${serviceId}"]`
    }
    if (!card) {
        return;
    }

    
    if (this.selectedAddonServices.has(serviceId)) {
        this.selectedAddonServices.delete(serviceId
        card.classList.remove('selected'
        } else {
        this.selectedAddonServices.add(serviceId
        card.classList.add('selected'
        }

    
    // Re-render to update the UI
    this.virtualRenderer.queueRender(() => this.renderAddonServices(), 'normal'
    this.saveToLocalStorage(
    this.updateSummary(
    this.updateGenerateButton(
    
    // Show user feedback
    const service = this.addonServices.find(s => s.id === serviceId
    if (service) {
        const action = this.selectedAddonServices.has(serviceId) ? 'added' : 'removed';
        this.showNotification(`${service.name} ${action} to your quote`, 'success'
    }
};

// ===== SCROLL TO QUOTE SUMMARY FUNCTIONALITY =====

// Initialize scroll to quote summary button
document.addEventListener('DOMContentLoaded', function() {
    const scrollBtn = document.getElementById('scrollToQuoteSummary'
    const quoteSidebar = document.querySelector('.quote-sidebar'
    
    if (!scrollBtn || !quoteSidebar) return;
    
    // Show/hide button based on scroll position
    function toggleScrollButton() {
        const scrollPosition = window.pageYOffset;
        const quoteSidebarTop = quoteSidebar.offsetTop;
        const windowHeight = window.innerHeight;
        
        // Show button when user scrolls past the quote sidebar
        if (scrollPosition > quoteSidebarTop - windowHeight + 100) {
            scrollBtn.classList.add('show'
        } else {
            scrollBtn.classList.remove('show'
        }
    }
    
    // Smooth scroll to quote summary
    function scrollToQuoteSummary() {
        const quoteSidebar = document.querySelector('.quote-sidebar'
        const fixedQuoteSummary = document.getElementById('fixedQuoteSummary'
        
        // Check if device is mobile
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile && fixedQuoteSummary) {
            // On mobile, show the fixed quote summary
            fixedQuoteSummary.classList.add('show'
            const fixedSummaryContent = document.getElementById('fixedSummaryContent'
            const fixedSummaryToggle = document.getElementById('fixedSummaryToggle'
            if (fixedSummaryContent && fixedSummaryToggle) {
                fixedSummaryContent.style.maxHeight = '180px';
                fixedSummaryToggle.setAttribute('aria-expanded', 'true'
            }
            
            // On mobile, just scroll down a reasonable amount instead of to the very bottom
            const currentScroll = window.pageYOffset;
            const reasonableScrollDistance = Math.min(300, window.innerHeight * 0.3 // Max 300px or 30% of viewport
            const targetPosition = Math.min(currentScroll + reasonableScrollDistance, document.body.scrollHeight - window.innerHeight
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            }
            
            // Add highlight effect to fixed summary
            fixedQuoteSummary.style.transition = 'box-shadow 0.3s ease';
            fixedQuoteSummary.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.3)';
            setTimeout(() => {
                fixedQuoteSummary.style.boxShadow = '';
            }, 2000
            
            return;
        }
        
        if (!quoteSidebar) return;
        
        // Desktop behavior
        const targetPosition = quoteSidebar.offsetTop - 20;
        // Ensure we don't scroll beyond the document bounds
        const finalTargetPosition = Math.max(0, Math.min(targetPosition, document.body.scrollHeight - window.innerHeight)
        // Smooth scroll to the target position
        window.scrollTo({
            top: finalTargetPosition,
            behavior: 'smooth'
        }
        
        // Add a subtle highlight effect to the quote sidebar
        quoteSidebar.style.transition = 'box-shadow 0.3s ease';
        quoteSidebar.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.3)';
        
        // Remove the highlight after animation
        setTimeout(() => {
            quoteSidebar.style.boxShadow = '';
        }, 2000
    }
    
    // Event listeners
    window.addEventListener('scroll', toggleScrollButton
    scrollBtn.addEventListener('click', scrollToQuoteSummary
    
    // Initialize button state
    toggleScrollButton(
    
    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Up arrow to scroll to quote summary
        if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
            e.preventDefault(
            scrollToQuoteSummary(
        }
    }
    
    // Add touch support for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].clientY;
        const touchDiff = touchStartY - touchEndY;
        
        // Swipe up gesture to scroll to quote summary (if button is visible)
        if (touchDiff > 50 && scrollBtn.classList.contains('show')) {
            scrollToQuoteSummary(
        }
    }
}

// ===== FIXED BOTTOM QUOTE SUMMARY FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    const fixedQuoteSummary = document.getElementById('fixedQuoteSummary'
    const fixedSummaryToggle = document.getElementById('fixedSummaryToggle'
    const fixedSummaryContent = document.getElementById('fixedSummaryContent'
    
    if (!fixedQuoteSummary || !fixedSummaryToggle || !fixedSummaryContent) return;
    
    // Toggle fixed quote summary
    function toggleFixedSummary() {
        const isExpanded = fixedSummaryToggle.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            // Collapse
            fixedSummaryContent.style.maxHeight = '0';
            fixedSummaryToggle.setAttribute('aria-expanded', 'false'
            fixedQuoteSummary.classList.remove('show'
        } else {
            // Expand
            fixedSummaryContent.style.maxHeight = '180px';
            fixedSummaryToggle.setAttribute('aria-expanded', 'true'
            fixedQuoteSummary.classList.add('show'
        }
    }
    
    // Event listener for toggle button
    fixedSummaryToggle.addEventListener('click', toggleFixedSummary
    
    // Show fixed summary when items are selected (mobile only)
    function showFixedSummaryIfMobile() {
        if (window.innerWidth <= 768) {
            fixedQuoteSummary.classList.add('show'
            fixedSummaryContent.style.maxHeight = '180px';
            fixedSummaryToggle.setAttribute('aria-expanded', 'true'
        }
    }
    
    // Hide fixed summary when no items are selected (mobile only)
    function hideFixedSummaryIfMobile() {
        if (window.innerWidth <= 768) {
            fixedQuoteSummary.classList.remove('show'
            fixedSummaryContent.style.maxHeight = '0';
            fixedSummaryToggle.setAttribute('aria-expanded', 'false'
        }
    }
    
    // Expose functions globally for use in other parts of the code
    window.showFixedSummaryIfMobile = showFixedSummaryIfMobile;
    window.hideFixedSummaryIfMobile = hideFixedSummaryIfMobile;
    
    // Auto-show on mobile when page loads if there are selected items
    setTimeout(() => {
        const selectedItems = document.querySelectorAll('.selected-item'
        if (selectedItems.length > 0 && window.innerWidth <= 768) {
            showFixedSummaryIfMobile(
        }
    }, 1000
}
