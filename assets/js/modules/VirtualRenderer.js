// Virtual Renderer for Performance Optimization
export class VirtualRenderer {
    constructor() {
        this.renderQueue = [];
        this.isRendering = false;
        this.processingDelay = 16; // 60fps target
        this.totalRenders = 0;
        this.completedRenders = 0;
        this.progressElement = null;
        this.setupProgressIndicator();
    }
    
    setupProgressIndicator() {
        // Create progress indicator if it doesn't exist
        if (!document.querySelector('.virtual-render-progress')) {
            this.progressElement = document.createElement('div');
            this.progressElement.className = 'virtual-render-progress';
            this.progressElement.innerHTML = `
                <div class="progress-text">
                    <i data-lucide="loader-2"></i>
                    <span>Rendering...</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            `;
            document.body.appendChild(this.progressElement);
        } else {
            this.progressElement = document.querySelector('.virtual-render-progress');
        }
    }
    
    showProgress() {
        if (this.progressElement) {
            this.progressElement.classList.add('show');
        }
    }
    
    hideProgress() {
        if (this.progressElement) {
            this.progressElement.classList.remove('show');
        }
    }
    
    updateProgress() {
        if (this.progressElement && this.totalRenders > 0) {
            const percentage = (this.completedRenders / this.totalRenders) * 100;
            const progressFill = this.progressElement.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${percentage}%`;
            }
        }
    }
    
    queueRender(renderFunction, priority = 'normal') {
        this.renderQueue.push({ fn: renderFunction, priority });
        this.totalRenders++;
        this.processQueue();
    }
    
    async processQueue() {
        if (this.isRendering) return;
        this.isRendering = true;
        this.showProgress();
        
        // Sort by priority
        this.renderQueue.sort((a, b) => {
            const priorities = { high: 3, normal: 2, low: 1 };
            return priorities[b.priority] - priorities[a.priority];
        });
        
        while (this.renderQueue.length > 0) {
            const { fn } = this.renderQueue.shift();
            
            try {
                await new Promise(resolve => {
                    requestAnimationFrame(() => {
                        fn();
                        this.completedRenders++;
                        this.updateProgress();
                        resolve();
                    });
                });
                
                // Small delay to prevent UI blocking
                await new Promise(resolve => setTimeout(resolve, this.processingDelay));
            } catch (error) {
                this.completedRenders++;
                this.updateProgress();
            }
        }
        
        this.isRendering = false;
        this.hideProgress();
        
        // Reset counters after a short delay
        setTimeout(() => {
            this.totalRenders = 0;
            this.completedRenders = 0;
        }, 1000);
    }
    
    clearQueue() {
        this.renderQueue = [];
        this.totalRenders = 0;
        this.completedRenders = 0;
        this.hideProgress();
    }
    
    getQueueLength() {
        return this.renderQueue.length;
    }
    
    isProcessing() {
        return this.isRendering;
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        this.clearQueue();
        if (this.progressElement && this.progressElement.parentElement) {
            this.progressElement.parentElement.removeChild(this.progressElement);
        }
        this.progressElement = null;
    }
}
