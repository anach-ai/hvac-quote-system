// Storage utilities for localStorage management
import { errorHandler } from './ErrorHandler.js';

export class StorageUtils {
    constructor(storageKey = 'hvacQuoteData') {
        this.storageKey = storageKey;
        this.maxAge = 24 * 60 * 60 * 1000; // 24 hours
        this.maxSize = 5 * 1024 * 1024; // 5MB limit
        this.compressionThreshold = 1024 * 1024; // 1MB
        this.setupErrorRecovery();
    }

    /**
     * Setup error recovery strategies
     */
    setupErrorRecovery() {
        // Register recovery strategy for storage errors
        errorHandler.registerRecoveryStrategy('Storage', (errorInfo) => {
            if (errorInfo.message.includes('QuotaExceededError')) {
                // Try to clear old data and retry
                this.clearOldData();
            } else if (errorInfo.message.includes('Corrupted')) {
                // Clear corrupted data
                this.clear();
            }
        });
    }
    
    // Save data to localStorage
    save(data) {
        try {
            // Validate data before saving
            if (!this.validateData(data)) {
                throw new Error('Invalid data format');
            }

            const storageData = {
                ...data,
                timestamp: Date.now(),
                version: '1.0'
            };

            const jsonData = JSON.stringify(storageData);
            
            // Check size before saving
            const dataSize = new Blob([jsonData]).size;
            if (dataSize > this.maxSize) {
                throw new Error('Data too large for storage');
            }

            // Try to save with compression if data is large
            const dataToSave = dataSize > this.compressionThreshold ? 
                this.compressData(jsonData) : jsonData;

            localStorage.setItem(this.storageKey, dataToSave);
            
            // Verify save was successful
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) {
                throw new Error('Failed to verify saved data');
            }

            return true;
        } catch (error) {
            errorHandler.handleStorageError(error, {
                operation: 'save',
                dataSize: data ? JSON.stringify(data).length : 0,
                storageKey: this.storageKey
            });
            return false;
        }
    }

    /**
     * Validate data before saving
     */
    validateData(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        // Check for circular references
        try {
            JSON.stringify(data);
        } catch (error) {
            return false;
        }

        return true;
    }

    /**
     * Compress data using simple encoding
     */
    compressData(data) {
        try {
            // Simple compression: remove unnecessary whitespace
            return data.replace(/\s+/g, ' ').trim();
        } catch (error) {
            // If compression fails, return original data
            return data;
        }
    }

    /**
     * Decompress data
     */
    decompressData(data) {
        try {
            // Check if data is compressed (simple heuristic)
            if (data.length < 1000) {
                return data; // Likely not compressed
            }
            return data;
        } catch (error) {
            return data;
        }
    }
    
    // Load data from localStorage
    load() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) return null;
            
            // Decompress data if needed
            const decompressedData = this.decompressData(savedData);
            
            let data;
            try {
                data = JSON.parse(decompressedData);
            } catch (parseError) {
                throw new Error('Corrupted data format');
            }
            
            // Validate data structure
            if (!this.validateLoadedData(data)) {
                throw new Error('Invalid data structure');
            }
            
            // Check if data is still valid
            if (this.isDataFresh(data.timestamp)) {
                return data;
            } else {
                // Clear expired data
                this.clear();
                return null;
            }
        } catch (error) {
            errorHandler.handleStorageError(error, {
                operation: 'load',
                storageKey: this.storageKey
            });
            
            // Clear corrupted data
            if (error.message.includes('Corrupted') || error.message.includes('Invalid')) {
                this.clear();
            }
            
            return null;
        }
    }

    /**
     * Validate loaded data structure
     */
    validateLoadedData(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        // Check for required fields
        if (typeof data.timestamp !== 'number') {
            return false;
        }

        // Check for reasonable timestamp
        if (data.timestamp > Date.now() + 86400000) { // Future timestamp
            return false;
        }

        return true;
    }
    
    // Check if data is fresh (not expired)
    isDataFresh(timestamp) {
        return (Date.now() - timestamp) < this.maxAge;
    }
    
    // Clear localStorage
    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            errorHandler.handleStorageError(error, {
                operation: 'clear',
                storageKey: this.storageKey
            });
            return false;
        }
    }

    /**
     * Clear old data to free up space
     */
    clearOldData() {
        try {
            const keys = Object.keys(localStorage);
            const oldKeys = keys.filter(key => {
                if (key === this.storageKey) return false;
                
                try {
                    const data = localStorage.getItem(key);
                    if (!data) return true;
                    
                    const parsed = JSON.parse(data);
                    return parsed.timestamp && (Date.now() - parsed.timestamp) > this.maxAge;
                } catch (error) {
                    return true; // Remove corrupted data
                }
            });
            
            oldKeys.forEach(key => {
                try {
                    localStorage.removeItem(key);
                } catch (error) {
                    // Ignore individual removal errors
                }
            });
            
            return oldKeys.length;
        } catch (error) {
            errorHandler.handleStorageError(error, {
                operation: 'clearOldData',
                storageKey: this.storageKey
            });
            return 0;
        }
    }
    
    // Get storage size
    getSize() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? new Blob([data]).size : 0;
        } catch (error) {
            errorHandler.handleStorageError(error, {
                operation: 'getSize',
                storageKey: this.storageKey
            });
            return 0;
        }
    }

    /**
     * Get available storage space
     */
    getAvailableSpace() {
        try {
            const testKey = '__storage_test__';
            const testData = 'x'.repeat(1024); // 1KB test data
            
            // Try to store increasingly large amounts of data
            for (let i = 1; i <= 10; i++) {
                const data = testData.repeat(i);
                try {
                    localStorage.setItem(testKey, data);
                    localStorage.removeItem(testKey);
                } catch (error) {
                    return (i - 1) * 1024; // Return available space in bytes
                }
            }
            
            return 10 * 1024; // At least 10KB available
        } catch (error) {
            return 0;
        }
    }
    
    // Check if localStorage is available
    isAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            errorHandler.handleStorageError(error, {
                operation: 'isAvailable',
                storageKey: this.storageKey
            });
            return false;
        }
    }

    /**
     * Get detailed storage status
     */
    getDetailedStatus() {
        const isAvailable = this.isAvailable();
        const currentSize = this.getSize();
        const availableSpace = this.getAvailableSpace();
        const data = this.load();
        
        return {
            isAvailable,
            currentSize,
            availableSpace,
            hasData: !!data,
            dataAge: data?.timestamp ? Date.now() - data.timestamp : null,
            isHealthy: isAvailable && currentSize < availableSpace * 0.8, // 80% threshold
            warnings: this.getStorageWarnings(currentSize, availableSpace)
        };
    }

    /**
     * Get storage warnings
     */
    getStorageWarnings(currentSize, availableSpace) {
        const warnings = [];
        
        if (currentSize > availableSpace * 0.8) {
            warnings.push('Storage space running low');
        }
        
        if (currentSize > this.maxSize) {
            warnings.push('Data size exceeds recommended limit');
        }
        
        return warnings;
    }
    
    // Get storage statistics
    getStats() {
        const data = this.load();
        const detailedStatus = this.getDetailedStatus();
        
        return {
            hasData: !!data,
            size: this.getSize(),
            isAvailable: this.isAvailable(),
            timestamp: data?.timestamp || null,
            age: data?.timestamp ? Date.now() - data.timestamp : null,
            availableSpace: detailedStatus.availableSpace,
            isHealthy: detailedStatus.isHealthy,
            warnings: detailedStatus.warnings
        };
    }
    
    // Export data for backup
    export() {
        const data = this.load();
        if (!data) return null;
        
        return {
            data,
            exportTimestamp: Date.now(),
            version: '1.0'
        };
    }
    
    // Import data from backup
    import(backupData) {
        try {
            if (!backupData || !backupData.data) {
                throw new Error('Invalid backup data');
            }
            
            // Validate backup data structure
            if (!this.validateData(backupData.data)) {
                throw new Error('Invalid backup data format');
            }
            
            return this.save(backupData.data);
        } catch (error) {
            errorHandler.handleStorageError(error, {
                operation: 'import',
                storageKey: this.storageKey
            });
            return false;
        }
    }

    /**
     * Create backup with error handling
     */
    createBackup() {
        try {
            const data = this.load();
            if (!data) {
                throw new Error('No data to backup');
            }
            
            return {
                data,
                backupTimestamp: Date.now(),
                version: '1.0',
                checksum: this.calculateChecksum(data)
            };
        } catch (error) {
            errorHandler.handleStorageError(error, {
                operation: 'createBackup',
                storageKey: this.storageKey
            });
            return null;
        }
    }

    /**
     * Calculate simple checksum for data integrity
     */
    calculateChecksum(data) {
        try {
            const jsonString = JSON.stringify(data);
            let checksum = 0;
            for (let i = 0; i < jsonString.length; i++) {
                checksum += jsonString.charCodeAt(i);
            }
            return checksum.toString(16);
        } catch (error) {
            return '0';
        }
    }
}
