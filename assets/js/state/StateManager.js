// ===== STATE MANAGEMENT SYSTEM =====

import { errorHandler } from '../utils/ErrorHandler.js';

/**
 * Action Types - Define all possible state changes
 */
export const ActionTypes = {
    // Package actions
    SELECT_PACKAGE: 'SELECT_PACKAGE',
    UPDATE_PACKAGE_PRICE: 'UPDATE_PACKAGE_PRICE',
    
    // Feature actions
    SELECT_FEATURE: 'SELECT_FEATURE',
    DESELECT_FEATURE: 'DESELECT_FEATURE',
    TOGGLE_FEATURE: 'TOGGLE_FEATURE',
    SELECT_FEATURES_BATCH: 'SELECT_FEATURES_BATCH',
    CLEAR_FEATURES: 'CLEAR_FEATURES',
    
    // Addon actions
    SELECT_ADDON: 'SELECT_ADDON',
    DESELECT_ADDON: 'DESELECT_ADDON',
    TOGGLE_ADDON: 'TOGGLE_ADDON',
    SELECT_ADDONS_BATCH: 'SELECT_ADDONS_BATCH',
    CLEAR_ADDONS: 'CLEAR_ADDONS',
    
    // Component actions
    SELECT_COMPONENT: 'SELECT_COMPONENT',
    DESELECT_COMPONENT: 'DESELECT_COMPONENT',
    TOGGLE_COMPONENT: 'TOGGLE_COMPONENT',
    SELECT_COMPONENTS_BATCH: 'SELECT_COMPONENTS_BATCH',
    CLEAR_COMPONENTS: 'CLEAR_COMPONENTS',
    
    // Emergency service actions
    SELECT_EMERGENCY_SERVICE: 'SELECT_EMERGENCY_SERVICE',
    DESELECT_EMERGENCY_SERVICE: 'DESELECT_EMERGENCY_SERVICE',
    
    // Service area actions
    SELECT_SERVICE_AREA: 'SELECT_SERVICE_AREA',
    DESELECT_SERVICE_AREA: 'DESELECT_SERVICE_AREA',
    
    // HVAC feature actions
    SELECT_HVAC_FEATURE: 'SELECT_HVAC_FEATURE',
    DESELECT_HVAC_FEATURE: 'DESELECT_HVAC_FEATURE',
    TOGGLE_HVAC_FEATURE: 'TOGGLE_HVAC_FEATURE',
    SELECT_HVAC_FEATURES_BATCH: 'SELECT_HVAC_FEATURES_BATCH',
    CLEAR_HVAC_FEATURES: 'CLEAR_HVAC_FEATURES',
    
    // Appliance feature actions
    SELECT_APPLIANCE_FEATURE: 'SELECT_APPLIANCE_FEATURE',
    DESELECT_APPLIANCE_FEATURE: 'DESELECT_APPLIANCE_FEATURE',
    TOGGLE_APPLIANCE_FEATURE: 'TOGGLE_APPLIANCE_FEATURE',
    SELECT_APPLIANCE_FEATURES_BATCH: 'SELECT_APPLIANCE_FEATURES_BATCH',
    CLEAR_APPLIANCE_FEATURES: 'CLEAR_APPLIANCE_FEATURES',
    
    // Contact feature actions
    SELECT_CONTACT_FEATURE: 'SELECT_CONTACT_FEATURE',
    DESELECT_CONTACT_FEATURE: 'DESELECT_CONTACT_FEATURE',
    TOGGLE_CONTACT_FEATURE: 'TOGGLE_CONTACT_FEATURE',
    SELECT_CONTACT_FEATURES_BATCH: 'SELECT_CONTACT_FEATURES_BATCH',
    CLEAR_CONTACT_FEATURES: 'CLEAR_CONTACT_FEATURES',
    
    // Price actions
    UPDATE_TOTAL_PRICE: 'UPDATE_TOTAL_PRICE',
    CALCULATE_PRICE: 'CALCULATE_PRICE',
    APPLY_DISCOUNT: 'APPLY_DISCOUNT',
    REMOVE_DISCOUNT: 'REMOVE_DISCOUNT',
    
    // Progress actions
    SET_CURRENT_STEP: 'SET_CURRENT_STEP',
    NEXT_STEP: 'NEXT_STEP',
    PREVIOUS_STEP: 'PREVIOUS_STEP',
    RESET_PROGRESS: 'RESET_PROGRESS',
    
    // Data actions
    LOAD_DATA: 'LOAD_DATA',
    LOAD_DATA_SUCCESS: 'LOAD_DATA_SUCCESS',
    LOAD_DATA_ERROR: 'LOAD_DATA_ERROR',
    UPDATE_PACKAGES: 'UPDATE_PACKAGES',
    UPDATE_FEATURES: 'UPDATE_FEATURES',
    UPDATE_ADDONS: 'UPDATE_ADDONS',
    UPDATE_COMPONENTS: 'UPDATE_COMPONENTS',
    UPDATE_EMERGENCY_SERVICES: 'UPDATE_EMERGENCY_SERVICES',
    UPDATE_SERVICE_AREAS: 'UPDATE_SERVICE_AREAS',
    UPDATE_HVAC_FEATURES: 'UPDATE_HVAC_FEATURES',
    UPDATE_APPLIANCE_FEATURES: 'UPDATE_APPLIANCE_FEATURES',
    UPDATE_CONTACT_FEATURES: 'UPDATE_CONTACT_FEATURES',
    
    // UI actions
    SET_LOADING_STATE: 'SET_LOADING_STATE',
    SET_ERROR_STATE: 'SET_ERROR_STATE',
    SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
    HIDE_NOTIFICATION: 'HIDE_NOTIFICATION',
    SET_MODAL_STATE: 'SET_MODAL_STATE',
    
    // Storage actions
    SAVE_TO_STORAGE: 'SAVE_TO_STORAGE',
    LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
    CLEAR_STORAGE: 'CLEAR_STORAGE',
    
    // System actions
    INITIALIZE_SYSTEM: 'INITIALIZE_SYSTEM',
    RESET_SYSTEM: 'RESET_SYSTEM',
    UNDO_ACTION: 'UNDO_ACTION',
    REDO_ACTION: 'REDO_ACTION'
};

/**
 * Action Creators - Functions that create action objects
 */
export const ActionCreators = {
    // Package actions
    selectPackage: (packageId) => ({
        type: ActionTypes.SELECT_PACKAGE,
        payload: { packageId }
    }),
    
    updatePackagePrice: (packageId, price) => ({
        type: ActionTypes.UPDATE_PACKAGE_PRICE,
        payload: { packageId, price }
    }),
    
    // Feature actions
    selectFeature: (featureId) => ({
        type: ActionTypes.SELECT_FEATURE,
        payload: { featureId }
    }),
    
    deselectFeature: (featureId) => ({
        type: ActionTypes.DESELECT_FEATURE,
        payload: { featureId }
    }),
    
    toggleFeature: (featureId) => ({
        type: ActionTypes.TOGGLE_FEATURE,
        payload: { featureId }
    }),
    
    selectFeaturesBatch: (featureIds) => ({
        type: ActionTypes.SELECT_FEATURES_BATCH,
        payload: { featureIds }
    }),
    
    clearFeatures: () => ({
        type: ActionTypes.CLEAR_FEATURES
    }),
    
    // Addon actions
    selectAddon: (addonId) => ({
        type: ActionTypes.SELECT_ADDON,
        payload: { addonId }
    }),
    
    deselectAddon: (addonId) => ({
        type: ActionTypes.DESELECT_ADDON,
        payload: { addonId }
    }),
    
    toggleAddon: (addonId) => ({
        type: ActionTypes.TOGGLE_ADDON,
        payload: { addonId }
    }),
    
    selectAddonsBatch: (addonIds) => ({
        type: ActionTypes.SELECT_ADDONS_BATCH,
        payload: { addonIds }
    }),
    
    clearAddons: () => ({
        type: ActionTypes.CLEAR_ADDONS
    }),
    
    // Component actions
    selectComponent: (componentId) => ({
        type: ActionTypes.SELECT_COMPONENT,
        payload: { componentId }
    }),
    
    deselectComponent: (componentId) => ({
        type: ActionTypes.DESELECT_COMPONENT,
        payload: { componentId }
    }),
    
    toggleComponent: (componentId) => ({
        type: ActionTypes.TOGGLE_COMPONENT,
        payload: { componentId }
    }),
    
    selectComponentsBatch: (componentIds) => ({
        type: ActionTypes.SELECT_COMPONENTS_BATCH,
        payload: { componentIds }
    }),
    
    clearComponents: () => ({
        type: ActionTypes.CLEAR_COMPONENTS
    }),
    
    // Emergency service actions
    selectEmergencyService: (serviceId) => ({
        type: ActionTypes.SELECT_EMERGENCY_SERVICE,
        payload: { serviceId }
    }),
    
    deselectEmergencyService: () => ({
        type: ActionTypes.DESELECT_EMERGENCY_SERVICE
    }),
    
    // Service area actions
    selectServiceArea: (areaId) => ({
        type: ActionTypes.SELECT_SERVICE_AREA,
        payload: { areaId }
    }),
    
    deselectServiceArea: () => ({
        type: ActionTypes.DESELECT_SERVICE_AREA
    }),
    
    // HVAC feature actions
    selectHvacFeature: (featureId) => ({
        type: ActionTypes.SELECT_HVAC_FEATURE,
        payload: { featureId }
    }),
    
    deselectHvacFeature: (featureId) => ({
        type: ActionTypes.DESELECT_HVAC_FEATURE,
        payload: { featureId }
    }),
    
    toggleHvacFeature: (featureId) => ({
        type: ActionTypes.TOGGLE_HVAC_FEATURE,
        payload: { featureId }
    }),
    
    selectHvacFeaturesBatch: (featureIds) => ({
        type: ActionTypes.SELECT_HVAC_FEATURES_BATCH,
        payload: { featureIds }
    }),
    
    clearHvacFeatures: () => ({
        type: ActionTypes.CLEAR_HVAC_FEATURES
    }),
    
    // Appliance feature actions
    selectApplianceFeature: (featureId) => ({
        type: ActionTypes.SELECT_APPLIANCE_FEATURE,
        payload: { featureId }
    }),
    
    deselectApplianceFeature: (featureId) => ({
        type: ActionTypes.DESELECT_APPLIANCE_FEATURE,
        payload: { featureId }
    }),
    
    toggleApplianceFeature: (featureId) => ({
        type: ActionTypes.TOGGLE_APPLIANCE_FEATURE,
        payload: { featureId }
    }),
    
    selectApplianceFeaturesBatch: (featureIds) => ({
        type: ActionTypes.SELECT_APPLIANCE_FEATURES_BATCH,
        payload: { featureIds }
    }),
    
    clearApplianceFeatures: () => ({
        type: ActionTypes.CLEAR_APPLIANCE_FEATURES
    }),
    
    // Contact feature actions
    selectContactFeature: (featureId) => ({
        type: ActionTypes.SELECT_CONTACT_FEATURE,
        payload: { featureId }
    }),
    
    deselectContactFeature: (featureId) => ({
        type: ActionTypes.DESELECT_CONTACT_FEATURE,
        payload: { featureId }
    }),
    
    toggleContactFeature: (featureId) => ({
        type: ActionTypes.TOGGLE_CONTACT_FEATURE,
        payload: { featureId }
    }),
    
    selectContactFeaturesBatch: (featureIds) => ({
        type: ActionTypes.SELECT_CONTACT_FEATURES_BATCH,
        payload: { featureIds }
    }),
    
    clearContactFeatures: () => ({
        type: ActionTypes.CLEAR_CONTACT_FEATURES
    }),
    
    // Price actions
    updateTotalPrice: (price) => ({
        type: ActionTypes.UPDATE_TOTAL_PRICE,
        payload: { price }
    }),
    
    calculatePrice: () => ({
        type: ActionTypes.CALCULATE_PRICE
    }),
    
    applyDiscount: (discountCode, discountAmount) => ({
        type: ActionTypes.APPLY_DISCOUNT,
        payload: { discountCode, discountAmount }
    }),
    
    removeDiscount: () => ({
        type: ActionTypes.REMOVE_DISCOUNT
    }),
    
    // Progress actions
    setCurrentStep: (step) => ({
        type: ActionTypes.SET_CURRENT_STEP,
        payload: { step }
    }),
    
    nextStep: () => ({
        type: ActionTypes.NEXT_STEP
    }),
    
    previousStep: () => ({
        type: ActionTypes.PREVIOUS_STEP
    }),
    
    resetProgress: () => ({
        type: ActionTypes.RESET_PROGRESS
    }),
    
    // Data actions
    loadData: () => ({
        type: ActionTypes.LOAD_DATA
    }),
    
    loadDataSuccess: (data) => ({
        type: ActionTypes.LOAD_DATA_SUCCESS,
        payload: { data }
    }),
    
    loadDataError: (error) => ({
        type: ActionTypes.LOAD_DATA_ERROR,
        payload: { error }
    }),
    
    updatePackages: (packages) => ({
        type: ActionTypes.UPDATE_PACKAGES,
        payload: { packages }
    }),
    
    updateFeatures: (features) => ({
        type: ActionTypes.UPDATE_FEATURES,
        payload: { features }
    }),
    
    updateAddons: (addons) => ({
        type: ActionTypes.UPDATE_ADDONS,
        payload: { addons }
    }),
    
    updateComponents: (components) => ({
        type: ActionTypes.UPDATE_COMPONENTS,
        payload: { components }
    }),
    
    updateEmergencyServices: (services) => ({
        type: ActionTypes.UPDATE_EMERGENCY_SERVICES,
        payload: { services }
    }),
    
    updateServiceAreas: (areas) => ({
        type: ActionTypes.UPDATE_SERVICE_AREAS,
        payload: { areas }
    }),
    
    updateHvacFeatures: (features) => ({
        type: ActionTypes.UPDATE_HVAC_FEATURES,
        payload: { features }
    }),
    
    updateApplianceFeatures: (features) => ({
        type: ActionTypes.UPDATE_APPLIANCE_FEATURES,
        payload: { features }
    }),
    
    updateContactFeatures: (features) => ({
        type: ActionTypes.UPDATE_CONTACT_FEATURES,
        payload: { features }
    }),
    
    // UI actions
    setLoadingState: (isLoading) => ({
        type: ActionTypes.SET_LOADING_STATE,
        payload: { isLoading }
    }),
    
    setErrorState: (error) => ({
        type: ActionTypes.SET_ERROR_STATE,
        payload: { error }
    }),
    
    showNotification: (message, type = 'info') => ({
        type: ActionTypes.SHOW_NOTIFICATION,
        payload: { message, type }
    }),
    
    hideNotification: () => ({
        type: ActionTypes.HIDE_NOTIFICATION
    }),
    
    setModalState: (modalId, isOpen) => ({
        type: ActionTypes.SET_MODAL_STATE,
        payload: { modalId, isOpen }
    }),
    
    // Storage actions
    saveToStorage: () => ({
        type: ActionTypes.SAVE_TO_STORAGE
    }),
    
    loadFromStorage: () => ({
        type: ActionTypes.LOAD_FROM_STORAGE
    }),
    
    clearStorage: () => ({
        type: ActionTypes.CLEAR_STORAGE
    }),
    
    // System actions
    initializeSystem: () => ({
        type: ActionTypes.INITIALIZE_SYSTEM
    }),
    
    resetSystem: () => ({
        type: ActionTypes.RESET_SYSTEM
    }),
    
    undoAction: () => ({
        type: ActionTypes.UNDO_ACTION
    }),
    
    redoAction: () => ({
        type: ActionTypes.REDO_ACTION
    })
};

/**
 * Reducers - Pure functions that handle state transitions
 */
const reducers = {
    // Package reducer
    [ActionTypes.SELECT_PACKAGE]: (state, action) => ({
        ...state,
        selectedPackage: action.payload.packageId
    }),
    
    [ActionTypes.UPDATE_PACKAGE_PRICE]: (state, action) => {
        const { packageId, price } = action.payload;
        const updatedPackages = state.packages.map(pkg => 
            pkg.id === packageId ? { ...pkg, price } : pkg
        );
        return {
            ...state,
            packages: updatedPackages
        };
    },
    
    // Feature reducers
    [ActionTypes.SELECT_FEATURE]: (state, action) => ({
        ...state,
        selectedFeatures: new Set([...state.selectedFeatures, action.payload.featureId])
    }),
    
    [ActionTypes.DESELECT_FEATURE]: (state, action) => {
        const newFeatures = new Set(state.selectedFeatures);
        newFeatures.delete(action.payload.featureId);
        return {
            ...state,
            selectedFeatures: newFeatures
        };
    },
    
    [ActionTypes.TOGGLE_FEATURE]: (state, action) => {
        const { featureId } = action.payload;
        const newFeatures = new Set(state.selectedFeatures);
        
        if (newFeatures.has(featureId)) {
            newFeatures.delete(featureId);
        } else {
            newFeatures.add(featureId);
        }
        
        return {
            ...state,
            selectedFeatures: newFeatures
        };
    },
    
    [ActionTypes.SELECT_FEATURES_BATCH]: (state, action) => ({
        ...state,
        selectedFeatures: new Set([...state.selectedFeatures, ...action.payload.featureIds])
    }),
    
    [ActionTypes.CLEAR_FEATURES]: (state) => ({
        ...state,
        selectedFeatures: new Set()
    }),
    
    // Addon reducers
    [ActionTypes.SELECT_ADDON]: (state, action) => ({
        ...state,
        selectedAddons: new Set([...state.selectedAddons, action.payload.addonId])
    }),
    
    [ActionTypes.DESELECT_ADDON]: (state, action) => {
        const newAddons = new Set(state.selectedAddons);
        newAddons.delete(action.payload.addonId);
        return {
            ...state,
            selectedAddons: newAddons
        };
    },
    
    [ActionTypes.TOGGLE_ADDON]: (state, action) => {
        const { addonId } = action.payload;
        const newAddons = new Set(state.selectedAddons);
        
        if (newAddons.has(addonId)) {
            newAddons.delete(addonId);
        } else {
            newAddons.add(addonId);
        }
        
        return {
            ...state,
            selectedAddons: newAddons
        };
    },
    
    [ActionTypes.SELECT_ADDONS_BATCH]: (state, action) => ({
        ...state,
        selectedAddons: new Set([...state.selectedAddons, ...action.payload.addonIds])
    }),
    
    [ActionTypes.CLEAR_ADDONS]: (state) => ({
        ...state,
        selectedAddons: new Set()
    }),
    
    // Component reducers
    [ActionTypes.SELECT_COMPONENT]: (state, action) => ({
        ...state,
        selectedComponents: new Set([...state.selectedComponents, action.payload.componentId])
    }),
    
    [ActionTypes.DESELECT_COMPONENT]: (state, action) => {
        const newComponents = new Set(state.selectedComponents);
        newComponents.delete(action.payload.componentId);
        return {
            ...state,
            selectedComponents: newComponents
        };
    },
    
    [ActionTypes.TOGGLE_COMPONENT]: (state, action) => {
        const { componentId } = action.payload;
        const newComponents = new Set(state.selectedComponents);
        
        if (newComponents.has(componentId)) {
            newComponents.delete(componentId);
        } else {
            newComponents.add(componentId);
        }
        
        return {
            ...state,
            selectedComponents: newComponents
        };
    },
    
    [ActionTypes.SELECT_COMPONENTS_BATCH]: (state, action) => ({
        ...state,
        selectedComponents: new Set([...state.selectedComponents, ...action.payload.componentIds])
    }),
    
    [ActionTypes.CLEAR_COMPONENTS]: (state) => ({
        ...state,
        selectedComponents: new Set()
    }),
    
    // Emergency service reducers
    [ActionTypes.SELECT_EMERGENCY_SERVICE]: (state, action) => ({
        ...state,
        selectedEmergency: action.payload.serviceId
    }),
    
    [ActionTypes.DESELECT_EMERGENCY_SERVICE]: (state) => ({
        ...state,
        selectedEmergency: null
    }),
    
    // Service area reducers
    [ActionTypes.SELECT_SERVICE_AREA]: (state, action) => ({
        ...state,
        selectedServiceArea: action.payload.areaId
    }),
    
    [ActionTypes.DESELECT_SERVICE_AREA]: (state) => ({
        ...state,
        selectedServiceArea: null
    }),
    
    // HVAC feature reducers
    [ActionTypes.SELECT_HVAC_FEATURE]: (state, action) => ({
        ...state,
        selectedHvacFeatures: new Set([...state.selectedHvacFeatures, action.payload.featureId])
    }),
    
    [ActionTypes.DESELECT_HVAC_FEATURE]: (state, action) => {
        const newFeatures = new Set(state.selectedHvacFeatures);
        newFeatures.delete(action.payload.featureId);
        return {
            ...state,
            selectedHvacFeatures: newFeatures
        };
    },
    
    [ActionTypes.TOGGLE_HVAC_FEATURE]: (state, action) => {
        const { featureId } = action.payload;
        const newFeatures = new Set(state.selectedHvacFeatures);
        
        if (newFeatures.has(featureId)) {
            newFeatures.delete(featureId);
        } else {
            newFeatures.add(featureId);
        }
        
        return {
            ...state,
            selectedHvacFeatures: newFeatures
        };
    },
    
    [ActionTypes.SELECT_HVAC_FEATURES_BATCH]: (state, action) => ({
        ...state,
        selectedHvacFeatures: new Set([...state.selectedHvacFeatures, ...action.payload.featureIds])
    }),
    
    [ActionTypes.CLEAR_HVAC_FEATURES]: (state) => ({
        ...state,
        selectedHvacFeatures: new Set()
    }),
    
    // Appliance feature reducers
    [ActionTypes.SELECT_APPLIANCE_FEATURE]: (state, action) => ({
        ...state,
        selectedApplianceFeatures: new Set([...state.selectedApplianceFeatures, action.payload.featureId])
    }),
    
    [ActionTypes.DESELECT_APPLIANCE_FEATURE]: (state, action) => {
        const newFeatures = new Set(state.selectedApplianceFeatures);
        newFeatures.delete(action.payload.featureId);
        return {
            ...state,
            selectedApplianceFeatures: newFeatures
        };
    },
    
    [ActionTypes.TOGGLE_APPLIANCE_FEATURE]: (state, action) => {
        const { featureId } = action.payload;
        const newFeatures = new Set(state.selectedApplianceFeatures);
        
        if (newFeatures.has(featureId)) {
            newFeatures.delete(featureId);
        } else {
            newFeatures.add(featureId);
        }
        
        return {
            ...state,
            selectedApplianceFeatures: newFeatures
        };
    },
    
    [ActionTypes.SELECT_APPLIANCE_FEATURES_BATCH]: (state, action) => ({
        ...state,
        selectedApplianceFeatures: new Set([...state.selectedApplianceFeatures, ...action.payload.featureIds])
    }),
    
    [ActionTypes.CLEAR_APPLIANCE_FEATURES]: (state) => ({
        ...state,
        selectedApplianceFeatures: new Set()
    }),
    
    // Contact feature reducers
    [ActionTypes.SELECT_CONTACT_FEATURE]: (state, action) => ({
        ...state,
        selectedContactFeatures: new Set([...state.selectedContactFeatures, action.payload.featureId])
    }),
    
    [ActionTypes.DESELECT_CONTACT_FEATURE]: (state, action) => {
        const newFeatures = new Set(state.selectedContactFeatures);
        newFeatures.delete(action.payload.featureId);
        return {
            ...state,
            selectedContactFeatures: newFeatures
        };
    },
    
    [ActionTypes.TOGGLE_CONTACT_FEATURE]: (state, action) => {
        const { featureId } = action.payload;
        const newFeatures = new Set(state.selectedContactFeatures);
        
        if (newFeatures.has(featureId)) {
            newFeatures.delete(featureId);
        } else {
            newFeatures.add(featureId);
        }
        
        return {
            ...state,
            selectedContactFeatures: newFeatures
        };
    },
    
    [ActionTypes.SELECT_CONTACT_FEATURES_BATCH]: (state, action) => ({
        ...state,
        selectedContactFeatures: new Set([...state.selectedContactFeatures, ...action.payload.featureIds])
    }),
    
    [ActionTypes.CLEAR_CONTACT_FEATURES]: (state) => ({
        ...state,
        selectedContactFeatures: new Set()
    }),
    
    // Price reducers
    [ActionTypes.UPDATE_TOTAL_PRICE]: (state, action) => ({
        ...state,
        totalPrice: action.payload.price
    }),
    
    [ActionTypes.APPLY_DISCOUNT]: (state, action) => ({
        ...state,
        discount: {
            code: action.payload.discountCode,
            amount: action.payload.discountAmount
        }
    }),
    
    [ActionTypes.REMOVE_DISCOUNT]: (state) => ({
        ...state,
        discount: null
    }),
    
    // Progress reducers
    [ActionTypes.SET_CURRENT_STEP]: (state, action) => ({
        ...state,
        currentStep: action.payload.step
    }),
    
    [ActionTypes.NEXT_STEP]: (state) => ({
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps)
    }),
    
    [ActionTypes.PREVIOUS_STEP]: (state) => ({
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1)
    }),
    
    [ActionTypes.RESET_PROGRESS]: (state) => ({
        ...state,
        currentStep: 1
    }),
    
    // Data reducers
    [ActionTypes.LOAD_DATA]: (state) => ({
        ...state,
        isLoading: true,
        error: null
    }),
    
    [ActionTypes.LOAD_DATA_SUCCESS]: (state, action) => ({
        ...state,
        isLoading: false,
        error: null,
        ...action.payload.data
    }),
    
    [ActionTypes.LOAD_DATA_ERROR]: (state, action) => ({
        ...state,
        isLoading: false,
        error: action.payload.error
    }),
    
    [ActionTypes.UPDATE_PACKAGES]: (state, action) => ({
        ...state,
        packages: action.payload.packages
    }),
    
    [ActionTypes.UPDATE_FEATURES]: (state, action) => ({
        ...state,
        features: action.payload.features
    }),
    
    [ActionTypes.UPDATE_ADDONS]: (state, action) => ({
        ...state,
        addons: action.payload.addons
    }),
    
    [ActionTypes.UPDATE_COMPONENTS]: (state, action) => ({
        ...state,
        components: action.payload.components
    }),
    
    [ActionTypes.UPDATE_EMERGENCY_SERVICES]: (state, action) => ({
        ...state,
        emergencyServices: action.payload.services
    }),
    
    [ActionTypes.UPDATE_SERVICE_AREAS]: (state, action) => ({
        ...state,
        serviceAreas: action.payload.areas
    }),
    
    [ActionTypes.UPDATE_HVAC_FEATURES]: (state, action) => ({
        ...state,
        hvacFeatures: action.payload.features
    }),
    
    [ActionTypes.UPDATE_APPLIANCE_FEATURES]: (state, action) => ({
        ...state,
        applianceFeatures: action.payload.features
    }),
    
    [ActionTypes.UPDATE_CONTACT_FEATURES]: (state, action) => ({
        ...state,
        contactFeatures: action.payload.features
    }),
    
    // UI reducers
    [ActionTypes.SET_LOADING_STATE]: (state, action) => ({
        ...state,
        isLoading: action.payload.isLoading
    }),
    
    [ActionTypes.SET_ERROR_STATE]: (state, action) => ({
        ...state,
        error: action.payload.error
    }),
    
    [ActionTypes.SHOW_NOTIFICATION]: (state, action) => ({
        ...state,
        notification: {
            message: action.payload.message,
            type: action.payload.type,
            timestamp: Date.now()
        }
    }),
    
    [ActionTypes.HIDE_NOTIFICATION]: (state) => ({
        ...state,
        notification: null
    }),
    
    [ActionTypes.SET_MODAL_STATE]: (state, action) => ({
        ...state,
        modals: {
            ...state.modals,
            [action.payload.modalId]: action.payload.isOpen
        }
    }),
    
    // System reducers
    [ActionTypes.INITIALIZE_SYSTEM]: (state) => ({
        ...state,
        isInitialized: true
    }),
    
    [ActionTypes.RESET_SYSTEM]: () => getInitialState()
};

/**
 * Get initial state
 */
export function getInitialState() {
    return {
        // Selections
        selectedPackage: null,
        selectedFeatures: new Set(),
        selectedAddons: new Set(),
        selectedComponents: new Set(),
        selectedEmergency: null,
        selectedServiceArea: null,
        selectedHvacFeatures: new Set(),
        selectedApplianceFeatures: new Set(),
        selectedContactFeatures: new Set(),
        
        // Pricing
        totalPrice: 0,
        discount: null,
        
        // Progress
        currentStep: 1,
        totalSteps: 5,
        
        // Data
        packages: [],
        features: { core: [], content: [], marketing: [], social: [], advanced: [], hvac: [], appliance: [] },
        addons: [],
        components: { pages: [], features: [], technical: [] },
        emergencyServices: [],
        serviceAreas: [],
        hvacFeatures: [],
        applianceFeatures: [],
        contactFeatures: [],
        
        // UI State
        isLoading: false,
        error: null,
        notification: null,
        modals: {},
        
        // System State
        isInitialized: false,
        
        // History for undo/redo
        history: [],
        historyIndex: -1,
        maxHistorySize: 50
    };
}

/**
 * Main Reducer - Combines all reducers
 */
function mainReducer(state, action) {
    const reducer = reducers[action.type];
    
    if (reducer) {
        return reducer(state, action);
    }
    
    return state;
}

/**
 * State Manager Class
 */
export class StateManager {
    constructor(initialState = getInitialState()) {
        this.state = initialState;
        this.subscribers = new Set();
        this.middleware = [];
        this.isDispatching = false;
        this.pendingActions = [];
        
        // Setup default middleware
        this.setupDefaultMiddleware();
    }
    
    /**
     * Setup default middleware
     */
    setupDefaultMiddleware() {
        // Logging middleware
        this.use((store, action, next) => {
            const startTime = performance.now();
            const result = next(action);
            const endTime = performance.now();
            
            console.log(`Action: ${action.type}`, {
                action,
                duration: `${(endTime - startTime).toFixed(2)}ms`,
                timestamp: new Date().toISOString()
            });
            
            return result;
        });
        
        // Error handling middleware
        this.use((store, action, next) => {
            try {
                return next(action);
            } catch (error) {
                errorHandler.handleError(error, {
                    context: 'StateManager',
                    action: action.type,
                    payload: action.payload
                });
                throw error;
            }
        });
        
        // History middleware for undo/redo
        this.use((store, action, next) => {
            const result = next(action);
            
            // Don't track certain actions in history
            const excludedActions = [
                ActionTypes.SET_LOADING_STATE,
                ActionTypes.SHOW_NOTIFICATION,
                ActionTypes.HIDE_NOTIFICATION,
                ActionTypes.SET_MODAL_STATE
            ];
            
            if (!excludedActions.includes(action.type)) {
                this.addToHistory(action);
            }
            
            return result;
        });
    }
    
    /**
     * Add middleware
     */
    use(middleware) {
        this.middleware.push(middleware);
    }
    
    /**
     * Get current state
     */
    getState() {
        return this.state;
    }
    
    /**
     * Subscribe to state changes
     */
    subscribe(callback) {
        this.subscribers.add(callback);
        
        // Return unsubscribe function
        return () => {
            this.subscribers.delete(callback);
        };
    }
    
    /**
     * Notify all subscribers
     */
    notifySubscribers() {
        this.subscribers.forEach(callback => {
            try {
                callback(this.state);
            } catch (error) {
                errorHandler.handleError(error, {
                    context: 'StateManager',
                    method: 'notifySubscribers'
                });
            }
        });
    }
    
    /**
     * Dispatch action through middleware chain
     */
    dispatch(action) {
        if (this.isDispatching) {
            this.pendingActions.push(action);
            return;
        }
        
        this.isDispatching = true;
        
        try {
            // Create middleware chain
            let index = 0;
            const chain = this.middleware.map(middleware => {
                const next = (action) => {
                    if (index >= this.middleware.length) {
                        return this.reducer(this.state, action);
                    }
                    return this.middleware[index++](this, action, next);
                };
                return next;
            });
            
            // Execute middleware chain
            const result = chain.length > 0 ? chain[0](action) : this.reducer(this.state, action);
            
            // Process pending actions
            while (this.pendingActions.length > 0) {
                const pendingAction = this.pendingActions.shift();
                this.dispatch(pendingAction);
            }
            
            return result;
        } finally {
            this.isDispatching = false;
        }
    }
    
    /**
     * Main reducer function
     */
    reducer(state, action) {
        const newState = mainReducer(state, action);
        
        if (newState !== state) {
            this.state = newState;
            this.notifySubscribers();
        }
        
        return newState;
    }
    
    /**
     * Add action to history for undo/redo
     */
    addToHistory(action) {
        // Remove any history after current index
        this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        
        // Add new action
        this.state.history.push({
            action,
            timestamp: Date.now(),
            stateSnapshot: JSON.parse(JSON.stringify(this.state))
        });
        
        // Limit history size
        if (this.state.history.length > this.state.maxHistorySize) {
            this.state.history.shift();
        } else {
            this.state.historyIndex++;
        }
    }
    
    /**
     * Undo last action
     */
    undo() {
        if (this.state.historyIndex > 0) {
            this.state.historyIndex--;
            const historyEntry = this.state.history[this.state.historyIndex];
            this.state = { ...historyEntry.stateSnapshot };
            this.notifySubscribers();
            return true;
        }
        return false;
    }
    
    /**
     * Redo last undone action
     */
    redo() {
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.historyIndex++;
            const historyEntry = this.state.history[this.state.historyIndex];
            this.state = { ...historyEntry.stateSnapshot };
            this.notifySubscribers();
            return true;
        }
        return false;
    }
    
    /**
     * Get state slice
     */
    getSlice(sliceName) {
        return this.state[sliceName];
    }
    
    /**
     * Select state with selector function
     */
    select(selector) {
        return selector(this.state);
    }
    
    /**
     * Batch dispatch multiple actions
     */
    batchDispatch(actions) {
        actions.forEach(action => this.dispatch(action));
    }
    
    /**
     * Reset state to initial
     */
    reset() {
        this.dispatch(ActionCreators.resetSystem());
    }
    
    /**
     * Get state statistics
     */
    getStats() {
        return {
            subscribers: this.subscribers.size,
            middleware: this.middleware.length,
            historySize: this.state.history.length,
            historyIndex: this.state.historyIndex,
            stateKeys: Object.keys(this.state).length
        };
    }
}

// Create and export default instance
export const stateManager = new StateManager();
export default stateManager;
