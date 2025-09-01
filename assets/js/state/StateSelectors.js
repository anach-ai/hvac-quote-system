// ===== STATE SELECTORS =====

/**
 * State Selectors - Efficient, memoized selectors for state queries
 */

// Memoization cache
const selectorCache = new Map();

/**
 * Create a memoized selector
 */
function createSelector(selectorFn, dependencies = []) {
    const cacheKey = selectorFn.toString() + dependencies.join(',');
    
    if (selectorCache.has(cacheKey)) {
        return selectorCache.get(cacheKey);
    }
    
    let lastState = null;
    let lastResult = null;
    
    const memoizedSelector = (state) => {
        // Check if dependencies have changed
        const dependencyValues = dependencies.map(dep => dep(state));
        const dependencyKey = JSON.stringify(dependencyValues);
        
        if (lastState === state && lastResult !== null) {
            return lastResult;
        }
        
        lastState = state;
        lastResult = selectorFn(state, ...dependencyValues);
        return lastResult;
    };
    
    selectorCache.set(cacheKey, memoizedSelector);
    return memoizedSelector;
}

/**
 * Basic selectors
 */
export const Selectors = {
    // Package selectors
    getSelectedPackage: (state) => state.selectedPackage,
    getPackages: (state) => state.packages,
    getSelectedPackageDetails: createSelector(
        (state, packages) => {
            if (!state.selectedPackage || !packages) return null;
            return packages.find(pkg => pkg.id === state.selectedPackage);
        },
        [(state) => state.packages]
    ),
    
    // Feature selectors
    getSelectedFeatures: (state) => state.selectedFeatures,
    getFeatures: (state) => state.features,
    getSelectedFeatureIds: (state) => Array.from(state.selectedFeatures),
    getSelectedFeatureDetails: createSelector(
        (state, features, selectedIds) => {
            if (!selectedIds || !features) return [];
            const allFeatures = Object.values(features).flat();
            return allFeatures.filter(feature => selectedIds.includes(feature.id));
        },
        [(state) => state.features, (state) => Array.from(state.selectedFeatures)]
    ),
    
    // Addon selectors
    getSelectedAddons: (state) => state.selectedAddons,
    getAddons: (state) => state.addons,
    getSelectedAddonIds: (state) => Array.from(state.selectedAddons),
    getSelectedAddonDetails: createSelector(
        (state, addons, selectedIds) => {
            if (!selectedIds || !addons) return [];
            return addons.filter(addon => selectedIds.includes(addon.id));
        },
        [(state) => state.addons, (state) => Array.from(state.selectedAddons)]
    ),
    
    // Component selectors
    getSelectedComponents: (state) => state.selectedComponents,
    getComponents: (state) => state.components,
    getSelectedComponentIds: (state) => Array.from(state.selectedComponents),
    getSelectedComponentDetails: createSelector(
        (state, components, selectedIds) => {
            if (!selectedIds || !components) return [];
            const allComponents = Object.values(components).flat();
            return allComponents.filter(component => selectedIds.includes(component.id));
        },
        [(state) => state.components, (state) => Array.from(state.selectedComponents)]
    ),
    
    // Emergency service selectors
    getSelectedEmergency: (state) => state.selectedEmergency,
    getEmergencyServices: (state) => state.emergencyServices,
    getSelectedEmergencyDetails: createSelector(
        (state, services) => {
            if (!state.selectedEmergency || !services) return null;
            return services.find(service => service.id === state.selectedEmergency);
        },
        [(state) => state.emergencyServices]
    ),
    
    // Service area selectors
    getSelectedServiceArea: (state) => state.selectedServiceArea,
    getServiceAreas: (state) => state.serviceAreas,
    getSelectedServiceAreaDetails: createSelector(
        (state, areas) => {
            if (!state.selectedServiceArea || !areas) return null;
            return areas.find(area => area.id === state.selectedServiceArea);
        },
        [(state) => state.serviceAreas]
    ),
    
    // HVAC feature selectors
    getSelectedHvacFeatures: (state) => state.selectedHvacFeatures,
    getHvacFeatures: (state) => state.hvacFeatures,
    getSelectedHvacFeatureIds: (state) => Array.from(state.selectedHvacFeatures),
    getSelectedHvacFeatureDetails: createSelector(
        (state, features, selectedIds) => {
            if (!selectedIds || !features) return [];
            return features.filter(feature => selectedIds.includes(feature.id));
        },
        [(state) => state.hvacFeatures, (state) => Array.from(state.selectedHvacFeatures)]
    ),
    
    // Appliance feature selectors
    getSelectedApplianceFeatures: (state) => state.selectedApplianceFeatures,
    getApplianceFeatures: (state) => state.applianceFeatures,
    getSelectedApplianceFeatureIds: (state) => Array.from(state.selectedApplianceFeatures),
    getSelectedApplianceFeatureDetails: createSelector(
        (state, features, selectedIds) => {
            if (!selectedIds || !features) return [];
            return features.filter(feature => selectedIds.includes(feature.id));
        },
        [(state) => state.applianceFeatures, (state) => Array.from(state.selectedApplianceFeatures)]
    ),
    
    // Contact feature selectors
    getSelectedContactFeatures: (state) => state.selectedContactFeatures,
    getContactFeatures: (state) => state.contactFeatures,
    getSelectedContactFeatureIds: (state) => Array.from(state.selectedContactFeatures),
    getSelectedContactFeatureDetails: createSelector(
        (state, features, selectedIds) => {
            if (!selectedIds || !features) return [];
            return features.filter(feature => selectedIds.includes(feature.id));
        },
        [(state) => state.contactFeatures, (state) => Array.from(state.selectedContactFeatures)]
    ),
    
    // Price selectors
    getTotalPrice: (state) => state.totalPrice,
    getDiscount: (state) => state.discount,
    getFinalPrice: createSelector(
        (state, totalPrice, discount) => {
            if (!discount) return totalPrice;
            return Math.max(0, totalPrice - discount.amount);
        },
        [(state) => state.totalPrice, (state) => state.discount]
    ),
    getDiscountAmount: createSelector(
        (state, discount) => discount ? discount.amount : 0,
        [(state) => state.discount]
    ),
    getDiscountPercentage: createSelector(
        (state, totalPrice, discountAmount) => {
            if (totalPrice === 0 || discountAmount === 0) return 0;
            return Math.round((discountAmount / totalPrice) * 100);
        },
        [(state) => state.totalPrice, (state) => state.discount?.amount || 0]
    ),
    
    // Progress selectors
    getCurrentStep: (state) => state.currentStep,
    getTotalSteps: (state) => state.totalSteps,
    getProgressPercentage: createSelector(
        (state, currentStep, totalSteps) => (currentStep / totalSteps) * 100,
        [(state) => state.currentStep, (state) => state.totalSteps]
    ),
    canGoNext: createSelector(
        (state, currentStep, totalSteps) => currentStep < totalSteps,
        [(state) => state.currentStep, (state) => state.totalSteps]
    ),
    canGoPrevious: createSelector(
        (state, currentStep) => currentStep > 1,
        [(state) => state.currentStep]
    ),
    
    // UI state selectors
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    getNotification: (state) => state.notification,
    getModalState: (state) => state.modals,
    getModalIsOpen: (modalId) => (state) => state.modals[modalId] || false,
    
    // System state selectors
    getIsInitialized: (state) => state.isInitialized,
    getHistorySize: (state) => state.history.length,
    getHistoryIndex: (state) => state.historyIndex,
    canUndo: createSelector(
        (state, historyIndex) => historyIndex > 0,
        [(state) => state.historyIndex]
    ),
    canRedo: createSelector(
        (state, historyIndex, historySize) => historyIndex < historySize - 1,
        [(state) => state.historyIndex, (state) => state.history.length]
    ),
    
    // Combined selectors
    getAllSelectedItems: createSelector(
        (state, selectedFeatures, selectedAddons, selectedComponents, selectedEmergency, selectedServiceArea, selectedHvacFeatures, selectedApplianceFeatures, selectedContactFeatures) => ({
            features: selectedFeatures,
            addons: selectedAddons,
            components: selectedComponents,
            emergency: selectedEmergency,
            serviceArea: selectedServiceArea,
            hvacFeatures: selectedHvacFeatures,
            applianceFeatures: selectedApplianceFeatures,
            contactFeatures: selectedContactFeatures
        }),
        [
            (state) => Array.from(state.selectedFeatures),
            (state) => Array.from(state.selectedAddons),
            (state) => Array.from(state.selectedComponents),
            (state) => state.selectedEmergency,
            (state) => state.selectedServiceArea,
            (state) => Array.from(state.selectedHvacFeatures),
            (state) => Array.from(state.selectedApplianceFeatures),
            (state) => Array.from(state.selectedContactFeatures)
        ]
    ),
    
    getSelectionSummary: createSelector(
        (state, selectedFeatures, selectedAddons, selectedComponents, selectedEmergency, selectedServiceArea, selectedHvacFeatures, selectedApplianceFeatures, selectedContactFeatures) => ({
            totalItems: selectedFeatures.length + selectedAddons.length + selectedComponents.length + 
                        (selectedEmergency ? 1 : 0) + (selectedServiceArea ? 1 : 0) + 
                        selectedHvacFeatures.length + selectedApplianceFeatures.length + selectedContactFeatures.length,
            features: selectedFeatures.length,
            addons: selectedAddons.length,
            components: selectedComponents.length,
            hasEmergency: !!selectedEmergency,
            hasServiceArea: !!selectedServiceArea,
            hvacFeatures: selectedHvacFeatures.length,
            applianceFeatures: selectedApplianceFeatures.length,
            contactFeatures: selectedContactFeatures.length
        }),
        [
            (state) => Array.from(state.selectedFeatures),
            (state) => Array.from(state.selectedAddons),
            (state) => Array.from(state.selectedComponents),
            (state) => state.selectedEmergency,
            (state) => state.selectedServiceArea,
            (state) => Array.from(state.selectedHvacFeatures),
            (state) => Array.from(state.selectedApplianceFeatures),
            (state) => Array.from(state.selectedContactFeatures)
        ]
    ),
    
    getQuoteSummary: createSelector(
        (state, selectedPackage, totalPrice, finalPrice, discount, selectionSummary) => ({
            package: selectedPackage,
            basePrice: totalPrice,
            finalPrice: finalPrice,
            discount: discount,
            savings: discount ? discount.amount : 0,
            selections: selectionSummary
        }),
        [
            (state) => state.selectedPackage,
            (state) => state.totalPrice,
            (state) => state.discount,
            (state) => Selectors.getSelectionSummary(state)
        ]
    ),
    
    // Validation selectors
    isQuoteValid: createSelector(
        (state, selectedPackage, currentStep) => {
            if (!selectedPackage) return false;
            if (currentStep < state.totalSteps) return false;
            return true;
        },
        [(state) => state.selectedPackage, (state) => state.currentStep]
    ),
    
    getValidationErrors: createSelector(
        (state, selectedPackage, currentStep) => {
            const errors = [];
            
            if (!selectedPackage) {
                errors.push('Please select a package');
            }
            
            if (currentStep < state.totalSteps) {
                errors.push('Please complete all steps');
            }
            
            return errors;
        },
        [(state) => state.selectedPackage, (state) => state.currentStep]
    ),
    
    // Performance selectors
    getStateSize: createSelector(
        (state) => {
            const stateString = JSON.stringify(state);
            return new Blob([stateString]).size;
        }
    ),
    
    getSelectorCacheSize: () => selectorCache.size,
    
    // Debug selectors
    getDebugInfo: createSelector(
        (state, stateSize, cacheSize) => ({
            stateKeys: Object.keys(state).length,
            stateSize: stateSize,
            selectorCacheSize: cacheSize,
            subscribers: 0, // Will be updated by StateManager
            historySize: state.history.length,
            historyIndex: state.historyIndex
        }),
        [(state) => Selectors.getStateSize(state), () => Selectors.getSelectorCacheSize()]
    )
};

/**
 * Clear selector cache
 */
export function clearSelectorCache() {
    selectorCache.clear();
}

/**
 * Get selector performance stats
 */
export function getSelectorStats() {
    return {
        cacheSize: selectorCache.size,
        cacheEntries: Array.from(selectorCache.keys())
    };
}

/**
 * Create a custom selector
 */
export function createCustomSelector(selectorFn, dependencies = []) {
    return createSelector(selectorFn, dependencies);
}

/**
 * Compose selectors
 */
export function composeSelectors(...selectors) {
    return (state) => {
        return selectors.map(selector => selector(state));
    };
}

/**
 * Conditional selector
 */
export function createConditionalSelector(condition, trueSelector, falseSelector) {
    return (state) => {
        return condition(state) ? trueSelector(state) : falseSelector(state);
    };
}

/**
 * Async selector (for future use with async state)
 */
export function createAsyncSelector(selectorFn, dependencies = []) {
    return async (state) => {
        const dependencyValues = dependencies.map(dep => dep(state));
        return await selectorFn(state, ...dependencyValues);
    };
}

export default Selectors;
