// Validation utilities for form inputs and data sanitization
import { errorHandler } from './ErrorHandler.js';

export class ValidationUtils {
    // Validation rules configuration
    static rules = {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address',
            maxLength: 254
        },
        phone: {
            pattern: /^[\+]?[1-9][\d]{0,15}$/,
            message: 'Please enter a valid phone number',
            maxLength: 20
        },
        name: {
            pattern: /^[a-zA-Z\s\-']{2,50}$/,
            message: 'Please enter a valid name (2-50 characters, letters only)',
            minLength: 2,
            maxLength: 50
        },
        company: {
            pattern: /^[a-zA-Z0-9\s\-&.,'()]{1,100}$/,
            message: 'Please enter a valid company name',
            maxLength: 100
        },
        location: {
            pattern: /^[a-zA-Z0-9\s\-.,'()]{3,100}$/,
            message: 'Please enter a valid service location',
            minLength: 3,
            maxLength: 100
        },
        message: {
            maxLength: 1000,
            message: 'Message must be 1000 characters or less'
        },
        serviceArea: {
            validValues: ['15', '30', '50'],
            message: 'Please select a valid service area'
        }
    };
    // Email validation
    static validateEmail(email) {
        try {
            if (!email || typeof email !== 'string') {
                return { isValid: false, error: 'Email is required' };
            }
            
            const trimmedEmail = email.trim();
            
            if (trimmedEmail.length > this.rules.email.maxLength) {
                return { isValid: false, error: `Email must be ${this.rules.email.maxLength} characters or less` };
            }
            
            if (!this.rules.email.pattern.test(trimmedEmail)) {
                return { isValid: false, error: this.rules.email.message };
            }
            
            return { isValid: true, error: null };
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return { isValid: false, error: 'Email validation failed' };
        }
    }
    
    // Phone validation
    static validatePhone(phone) {
        try {
            if (!phone || typeof phone !== 'string') {
                return { isValid: true, error: null }; // Optional field
            }
            
            const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
            
            if (cleanedPhone.length > this.rules.phone.maxLength) {
                return { isValid: false, error: `Phone number must be ${this.rules.phone.maxLength} characters or less` };
            }
            
            if (!this.rules.phone.pattern.test(cleanedPhone)) {
                return { isValid: false, error: this.rules.phone.message };
            }
            
            return { isValid: true, error: null };
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return { isValid: false, error: 'Phone validation failed' };
        }
    }
    
    // Required field validation
    static validateRequired(value, minLength = 1) {
        try {
            if (!value || typeof value !== 'string') {
                return { isValid: false, error: 'This field is required' };
            }
            
            const trimmedValue = value.trim();
            
            if (trimmedValue.length < minLength) {
                return { isValid: false, error: `This field must be at least ${minLength} characters long` };
            }
            
            return { isValid: true, error: null };
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return { isValid: false, error: 'Field validation failed' };
        }
    }
    
    // Name validation
    static validateName(name) {
        try {
            const requiredValidation = this.validateRequired(name, this.rules.name.minLength);
            if (!requiredValidation.isValid) {
                return requiredValidation;
            }
            
            const trimmedName = name.trim();
            
            if (trimmedName.length > this.rules.name.maxLength) {
                return { isValid: false, error: `Name must be ${this.rules.name.maxLength} characters or less` };
            }
            
            if (!this.rules.name.pattern.test(trimmedName)) {
                return { isValid: false, error: this.rules.name.message };
            }
            
            return { isValid: true, error: null };
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return { isValid: false, error: 'Name validation failed' };
        }
    }
    
    // Company name validation
    static validateCompany(company) {
        try {
            if (!company) {
                return { isValid: true, error: null }; // Optional field
            }
            
            const trimmedCompany = company.trim();
            
            if (trimmedCompany.length > this.rules.company.maxLength) {
                return { isValid: false, error: `Company name must be ${this.rules.company.maxLength} characters or less` };
            }
            
            if (!this.rules.company.pattern.test(trimmedCompany)) {
                return { isValid: false, error: this.rules.company.message };
            }
            
            return { isValid: true, error: null };
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return { isValid: false, error: 'Company validation failed' };
        }
    }
    
    // Location validation
    static validateLocation(location) {
        try {
            const requiredValidation = this.validateRequired(location, this.rules.location.minLength);
            if (!requiredValidation.isValid) {
                return requiredValidation;
            }
            
            const trimmedLocation = location.trim();
            
            if (trimmedLocation.length > this.rules.location.maxLength) {
                return { isValid: false, error: `Location must be ${this.rules.location.maxLength} characters or less` };
            }
            
            if (!this.rules.location.pattern.test(trimmedLocation)) {
                return { isValid: false, error: this.rules.location.message };
            }
            
            return { isValid: true, error: null };
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return { isValid: false, error: 'Location validation failed' };
        }
    }
    
    // Message validation
    static validateMessage(message) {
        try {
            if (!message) {
                return { isValid: true, error: null }; // Optional field
            }
            
            if (message.length > this.rules.message.maxLength) {
                return { isValid: false, error: this.rules.message.message };
            }
            
            return { isValid: true, error: null };
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return { isValid: false, error: 'Message validation failed' };
        }
    }
    
    // Service area validation
    static validateServiceArea(area) {
        try {
            if (!this.rules.serviceArea.validValues.includes(area)) {
                return { isValid: false, error: this.rules.serviceArea.message };
            }
            
            return { isValid: true, error: null };
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return { isValid: false, error: 'Service area validation failed' };
        }
    }
    
    // Comprehensive form validation
    static validateQuoteForm(formData) {
        try {
            const errors = [];
            const fieldErrors = {};
            
            // Name validation
            const nameValidation = this.validateName(formData.name);
            if (!nameValidation.isValid) {
                errors.push(nameValidation.error);
                fieldErrors.name = nameValidation.error;
            }
            
            // Email validation
            const emailValidation = this.validateEmail(formData.email);
            if (!emailValidation.isValid) {
                errors.push(emailValidation.error);
                fieldErrors.email = emailValidation.error;
            }
            
            // Phone validation (optional but if provided, must be valid)
            if (formData.phone) {
                const phoneValidation = this.validatePhone(formData.phone);
                if (!phoneValidation.isValid) {
                    errors.push(phoneValidation.error);
                    fieldErrors.phone = phoneValidation.error;
                }
            }
            
            // Company validation
            if (formData.company) {
                const companyValidation = this.validateCompany(formData.company);
                if (!companyValidation.isValid) {
                    errors.push(companyValidation.error);
                    fieldErrors.company = companyValidation.error;
                }
            }
            
            // Location validation
            const locationValidation = this.validateLocation(formData.location);
            if (!locationValidation.isValid) {
                errors.push(locationValidation.error);
                fieldErrors.location = locationValidation.error;
            }
            
            // Service area validation
            const serviceAreaValidation = this.validateServiceArea(formData.serviceArea);
            if (!serviceAreaValidation.isValid) {
                errors.push(serviceAreaValidation.error);
                fieldErrors.serviceArea = serviceAreaValidation.error;
            }
            
            // Message validation
            if (formData.message) {
                const messageValidation = this.validateMessage(formData.message);
                if (!messageValidation.isValid) {
                    errors.push(messageValidation.error);
                    fieldErrors.message = messageValidation.error;
                }
            }
            
            // Log validation errors for debugging
            if (errors.length > 0) {
                errorHandler.handleValidationErrors(errors, {
                    formData: this.sanitizeFormData(formData),
                    fieldErrors
                });
            }
            
            return {
                isValid: errors.length === 0,
                errors,
                fieldErrors
            };
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'error',
                userActionable: false
            });
            
            return {
                isValid: false,
                errors: ['Form validation failed. Please try again.'],
                fieldErrors: {}
            };
        }
    }
    
    // Input sanitization
    static sanitizeString(str) {
        try {
            if (!str || typeof str !== 'string') return '';
            
            // Create a temporary div to escape HTML
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return '';
        }
    }
    
    // Sanitize HTML content
    static sanitizeHTML(html) {
        try {
            if (!html || typeof html !== 'string') return '';
            
            // Basic HTML sanitization - remove script tags and dangerous attributes
            return html
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/data:/gi, '')
                .replace(/vbscript:/gi, '')
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
                .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return '';
        }
    }
    
    // Validate and sanitize form data
    static sanitizeFormData(formData) {
        try {
            if (!formData || typeof formData !== 'object') {
                return {};
            }
            
            const sanitized = {};
            
            for (const [key, value] of Object.entries(formData)) {
                if (typeof value === 'string') {
                    sanitized[key] = this.sanitizeString(value.trim());
                } else if (typeof value === 'object' && value !== null) {
                    // Recursively sanitize nested objects
                    sanitized[key] = this.sanitizeFormData(value);
                } else {
                    sanitized[key] = value;
                }
            }
            
            return sanitized;
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return {};
        }
    }
    
    // Price validation
    static validatePrice(price) {
        try {
            if (typeof price !== 'number') {
                return { isValid: false, error: 'Price must be a number' };
            }
            
            if (price < 0 || price > 100000) {
                return { isValid: false, error: 'Price must be between 0 and 100,000' };
            }
            
            return { isValid: true, error: null };
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return { isValid: false, error: 'Price validation failed' };
        }
    }
    
    // ID validation
    static validateId(id) {
        try {
            if (!id || typeof id !== 'string') {
                return { isValid: false, error: 'ID is required' };
            }
            
            const idRegex = /^[a-zA-Z0-9\-_]{1,50}$/;
            if (!idRegex.test(id)) {
                return { isValid: false, error: 'ID must contain only letters, numbers, hyphens, and underscores (1-50 characters)' };
            }
            
            return { isValid: true, error: null };
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return { isValid: false, error: 'ID validation failed' };
        }
    }

    /**
     * Real-time field validation
     */
    static validateField(fieldName, value) {
        try {
            switch (fieldName) {
                case 'name':
                    return this.validateName(value);
                case 'email':
                    return this.validateEmail(value);
                case 'phone':
                    return this.validatePhone(value);
                case 'company':
                    return this.validateCompany(value);
                case 'location':
                    return this.validateLocation(value);
                case 'message':
                    return this.validateMessage(value);
                case 'serviceArea':
                    return this.validateServiceArea(value);
                default:
                    return { isValid: true, error: null };
            }
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
            return { isValid: false, error: 'Field validation failed' };
        }
    }

    /**
     * Show field-specific error messages
     */
    static showFieldError(fieldName, errorMessage) {
        try {
            const errorElement = document.getElementById(`${fieldName}-error`);
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.hidden = false;
                
                // Add error styling to input
                const inputElement = document.getElementById(fieldName);
                if (inputElement) {
                    inputElement.classList.add('error');
                }
            }
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
        }
    }

    /**
     * Clear field-specific error messages
     */
    static clearFieldError(fieldName) {
        try {
            const errorElement = document.getElementById(`${fieldName}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.hidden = true;
                
                // Remove error styling from input
                const inputElement = document.getElementById(fieldName);
                if (inputElement) {
                    inputElement.classList.remove('error');
                }
            }
        } catch (error) {
            errorHandler.handleError(error, {
                context: 'Validation',
                severity: 'warning',
                userActionable: false
            });
        }
    }
}
