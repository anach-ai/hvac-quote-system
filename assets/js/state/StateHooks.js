// ===== STATE HOOKS =====

import { stateManager } from './StateManager.js';
import { Selectors } from './StateSelectors.js';

/**
 * State Hooks - React-like hooks for state management
 */

// Hook registry for cleanup
const hookRegistry = new Map();
let hookId = 0;

/**
 * Generate unique hook ID
 */
function generateHookId() {
    return `hook_${++hookId}_${Date.now()}`;
}

/**
 * Cleanup hook subscriptions
 */
function cleanupHook(hookId) {
    const hook = hookRegistry.get(hookId);
    if (hook && hook.unsubscribe) {
        hook.unsubscribe();
        hookRegistry.delete(hookId);
    }
}

/**
 * Cleanup all hooks
 */
export function cleanupAllHooks() {
    hookRegistry.forEach((hook, id) => {
        cleanupHook(id);
    });
}

/**
 * useState hook - Subscribe to specific state slice
 */
export function useState(selector, initialValue = null) {
    const hookId = generateHookId();
    let currentValue = initialValue;
    let subscribers = new Set();
    
    // Get initial value
    if (selector) {
        currentValue = selector(stateManager.getState());
    }
    
    // Subscribe to state changes
    const unsubscribe = stateManager.subscribe((state) => {
        const newValue = selector ? selector(state) : state;
        
        if (newValue !== currentValue) {
            currentValue = newValue;
            
            // Notify subscribers
            subscribers.forEach(callback => {
                try {
                    callback(currentValue);
                } catch (error) {
                    console.error('Hook subscriber error:', error);
                }
            });
        }
    });
    
    // Register hook for cleanup
    hookRegistry.set(hookId, { unsubscribe });
    
    // Return state and setter
    return [
        currentValue,
        (newValue) => {
            if (typeof newValue === 'function') {
                currentValue = newValue(currentValue);
            } else {
                currentValue = newValue;
            }
            
            // Notify subscribers
            subscribers.forEach(callback => {
                try {
                    callback(currentValue);
                } catch (error) {
                    console.error('Hook subscriber error:', error);
                }
            });
        },
        {
            subscribe: (callback) => {
                subscribers.add(callback);
                return () => subscribers.delete(callback);
            },
            unsubscribe: () => {
                unsubscribe();
                cleanupHook(hookId);
            }
        }
    ];
}

/**
 * useReducer hook - Local state with reducer pattern
 */
export function useReducer(reducer, initialState) {
    const [state, setState] = useState(() => initialState);
    
    const dispatch = (action) => {
        const newState = reducer(state, action);
        setState(newState);
    };
    
    return [state, dispatch];
}

/**
 * useEffect hook - Side effects based on state changes
 */
export function useEffect(effect, dependencies = []) {
    const hookId = generateHookId();
    let cleanup = null;
    let lastDependencies = null;
    
    const checkDependencies = () => {
        if (!dependencies || dependencies.length === 0) {
            return true;
        }
        
        if (!lastDependencies) {
            lastDependencies = [...dependencies];
            return true;
        }
        
        const hasChanged = dependencies.some((dep, index) => dep !== lastDependencies[index]);
        if (hasChanged) {
            lastDependencies = [...dependencies];
            return true;
        }
        
        return false;
    };
    
    const executeEffect = () => {
        // Cleanup previous effect
        if (cleanup && typeof cleanup === 'function') {
            try {
                cleanup();
            } catch (error) {
                console.error('Effect cleanup error:', error);
            }
        }
        
        // Execute new effect
        try {
            cleanup = effect();
        } catch (error) {
            console.error('Effect execution error:', error);
        }
    };
    
    // Execute effect immediately
    if (checkDependencies()) {
        executeEffect();
    }
    
    // Subscribe to state changes
    const unsubscribe = stateManager.subscribe(() => {
        if (checkDependencies()) {
            executeEffect();
        }
    });
    
    // Register hook for cleanup
    hookRegistry.set(hookId, {
        unsubscribe: () => {
            unsubscribe();
            if (cleanup && typeof cleanup === 'function') {
                try {
                    cleanup();
                } catch (error) {
                    console.error('Effect cleanup error:', error);
                }
            }
            cleanupHook(hookId);
        }
    });
    
    return {
        cleanup: () => {
            if (cleanup && typeof cleanup === 'function') {
                cleanup();
            }
        }
    };
}

/**
 * useCallback hook - Memoized callback
 */
export function useCallback(callback, dependencies = []) {
    const hookId = generateHookId();
    let memoizedCallback = null;
    let lastDependencies = null;
    
    const getCallback = () => {
        if (!dependencies || dependencies.length === 0) {
            return callback;
        }
        
        if (!lastDependencies) {
            lastDependencies = [...dependencies];
            memoizedCallback = callback;
            return memoizedCallback;
        }
        
        const hasChanged = dependencies.some((dep, index) => dep !== lastDependencies[index]);
        if (hasChanged) {
            lastDependencies = [...dependencies];
            memoizedCallback = callback;
        }
        
        return memoizedCallback;
    };
    
    // Register hook for cleanup
    hookRegistry.set(hookId, { unsubscribe: () => cleanupHook(hookId) });
    
    return getCallback();
}

/**
 * useMemo hook - Memoized value
 */
export function useMemo(factory, dependencies = []) {
    const hookId = generateHookId();
    let memoizedValue = null;
    let lastDependencies = null;
    
    const getValue = () => {
        if (!dependencies || dependencies.length === 0) {
            return factory();
        }
        
        if (!lastDependencies) {
            lastDependencies = [...dependencies];
            memoizedValue = factory();
            return memoizedValue;
        }
        
        const hasChanged = dependencies.some((dep, index) => dep !== lastDependencies[index]);
        if (hasChanged) {
            lastDependencies = [...dependencies];
            memoizedValue = factory();
        }
        
        return memoizedValue;
    };
    
    // Register hook for cleanup
    hookRegistry.set(hookId, { unsubscribe: () => cleanupHook(hookId) });
    
    return getValue();
}

/**
 * useRef hook - Mutable reference
 */
export function useRef(initialValue = null) {
    const hookId = generateHookId();
    const ref = { current: initialValue };
    
    // Register hook for cleanup
    hookRegistry.set(hookId, { unsubscribe: () => cleanupHook(hookId) });
    
    return ref;
}

/**
 * usePrevious hook - Get previous value
 */
export function usePrevious(value) {
    const ref = useRef();
    const previous = ref.current;
    ref.current = value;
    return previous;
}

/**
 * useInterval hook - Interval with cleanup
 */
export function useInterval(callback, delay) {
    const savedCallback = useRef();
    
    // Remember the latest callback
    savedCallback.current = callback;
    
    useEffect(() => {
        if (delay !== null) {
            const id = setInterval(() => savedCallback.current(), delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

/**
 * useTimeout hook - Timeout with cleanup
 */
export function useTimeout(callback, delay) {
    const savedCallback = useRef();
    
    // Remember the latest callback
    savedCallback.current = callback;
    
    useEffect(() => {
        if (delay !== null) {
            const id = setTimeout(() => savedCallback.current(), delay);
            return () => clearTimeout(id);
        }
    }, [delay]);
}

/**
 * useLocalStorage hook - Sync state with localStorage
 */
export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });
    
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    };
    
    return [storedValue, setValue];
}

/**
 * useSessionStorage hook - Sync state with sessionStorage
 */
export function useSessionStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return initialValue;
        }
    });
    
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error writing to sessionStorage:', error);
        }
    };
    
    return [storedValue, setValue];
}

/**
 * useDebounce hook - Debounced value
 */
export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    
    return debouncedValue;
}

/**
 * useThrottle hook - Throttled value
 */
export function useThrottle(value, delay) {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastRun = useRef(Date.now());
    
    useEffect(() => {
        const handler = setTimeout(() => {
            if (Date.now() - lastRun.current >= delay) {
                setThrottledValue(value);
                lastRun.current = Date.now();
            }
        }, delay - (Date.now() - lastRun.current));
        
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    
    return throttledValue;
}

/**
 * useToggle hook - Boolean toggle
 */
export function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);
    
    const toggle = useCallback(() => {
        setValue(prev => !prev);
    }, []);
    
    const setTrue = useCallback(() => {
        setValue(true);
    }, []);
    
    const setFalse = useCallback(() => {
        setValue(false);
    }, []);
    
    return [value, { toggle, setTrue, setFalse, setValue }];
}

/**
 * useCounter hook - Counter with increment/decrement
 */
export function useCounter(initialValue = 0, step = 1) {
    const [count, setCount] = useState(initialValue);
    
    const increment = useCallback(() => {
        setCount(prev => prev + step);
    }, [step]);
    
    const decrement = useCallback(() => {
        setCount(prev => prev - step);
    }, [step]);
    
    const reset = useCallback(() => {
        setCount(initialValue);
    }, [initialValue]);
    
    return [count, { increment, decrement, reset, setCount }];
}

/**
 * useArray hook - Array operations
 */
export function useArray(initialValue = []) {
    const [array, setArray] = useState(initialValue);
    
    const push = useCallback((element) => {
        setArray(prev => [...prev, element]);
    }, []);
    
    const pop = useCallback(() => {
        setArray(prev => prev.slice(0, -1));
    }, []);
    
    const shift = useCallback(() => {
        setArray(prev => prev.slice(1));
    }, []);
    
    const unshift = useCallback((element) => {
        setArray(prev => [element, ...prev]);
    }, []);
    
    const clear = useCallback(() => {
        setArray([]);
    }, []);
    
    const remove = useCallback((index) => {
        setArray(prev => prev.filter((_, i) => i !== index));
    }, []);
    
    const update = useCallback((index, element) => {
        setArray(prev => prev.map((item, i) => i === index ? element : item));
    }, []);
    
    return [
        array,
        { push, pop, shift, unshift, clear, remove, update, setArray }
    ];
}

/**
 * useObject hook - Object operations
 */
export function useObject(initialValue = {}) {
    const [object, setObject] = useState(initialValue);
    
    const set = useCallback((key, value) => {
        setObject(prev => ({ ...prev, [key]: value }));
    }, []);
    
    const remove = useCallback((key) => {
        setObject(prev => {
            const newObj = { ...prev };
            delete newObj[key];
            return newObj;
        });
    }, []);
    
    const clear = useCallback(() => {
        setObject({});
    }, []);
    
    return [object, { set, remove, clear, setObject }];
}

/**
 * useAsync hook - Async operations
 */
export function useAsync(asyncFunction, immediate = true) {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    
    const execute = useCallback(async (...params) => {
        setStatus('pending');
        setData(null);
        setError(null);
        
        try {
            const response = await asyncFunction(...params);
            setData(response);
            setStatus('success');
            return response;
        } catch (err) {
            setError(err);
            setStatus('error');
            throw err;
        }
    }, [asyncFunction]);
    
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);
    
    return { execute, status, data, error };
}

/**
 * useEventListener hook - Event listener with cleanup
 */
export function useEventListener(eventName, handler, element = window) {
    const savedHandler = useRef();
    
    // Remember the latest handler
    savedHandler.current = handler;
    
    useEffect(() => {
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;
        
        const eventListener = (event) => savedHandler.current(event);
        
        element.addEventListener(eventName, eventListener);
        
        return () => {
            element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
}

/**
 * useOnClickOutside hook - Detect clicks outside element
 */
export function useOnClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}

/**
 * useKeyPress hook - Keyboard event listener
 */
export function useKeyPress(targetKey) {
    const [keyPressed, setKeyPressed] = useState(false);
    
    const downHandler = useCallback(({ key }) => {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }, [targetKey]);
    
    const upHandler = useCallback(({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    }, [targetKey]);
    
    useEventListener('keydown', downHandler);
    useEventListener('keyup', upHandler);
    
    return keyPressed;
}

/**
 * useHover hook - Detect hover state
 */
export function useHover() {
    const [value, setValue] = useState(false);
    const ref = useRef(null);
    
    const handleMouseOver = useCallback(() => setValue(true), []);
    const handleMouseOut = useCallback(() => setValue(false), []);
    
    useEffect(() => {
        const node = ref.current;
        if (node) {
            node.addEventListener('mouseover', handleMouseOver);
            node.addEventListener('mouseout', handleMouseOut);
            
            return () => {
                node.removeEventListener('mouseover', handleMouseOver);
                node.removeEventListener('mouseout', handleMouseOut);
            };
        }
    }, [handleMouseOver, handleMouseOut]);
    
    return [ref, value];
}

/**
 * useWindowSize hook - Window dimensions
 */
export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return windowSize;
}

/**
 * useScrollPosition hook - Scroll position
 */
export function useScrollPosition() {
    const [scrollPosition, setScrollPosition] = useState({
        x: window.pageXOffset,
        y: window.pageYOffset
    });
    
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition({
                x: window.pageXOffset,
                y: window.pageYOffset
            });
        };
        
        window.addEventListener('scroll', handleScroll);
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return scrollPosition;
}

/**
 * useOnlineStatus hook - Online/offline status
 */
export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    
    return isOnline;
}

/**
 * useGeolocation hook - Geolocation API
 */
export function useGeolocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    
    const getLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                setError(null);
            },
            (error) => {
                setError(error.message);
            }
        );
    }, []);
    
    return { location, error, getLocation };
}

/**
 * useClipboard hook - Clipboard API
 */
export function useClipboard() {
    const [copiedText, setCopiedText] = useState('');
    
    const copy = useCallback(async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    }, []);
    
    return { copiedText, copy };
}

/**
 * useMediaQuery hook - Media query listener
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });
    
    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const updateMatches = (event) => setMatches(event.matches);
        
        mediaQuery.addEventListener('change', updateMatches);
        
        return () => mediaQuery.removeEventListener('change', updateMatches);
    }, [query]);
    
    return matches;
}

/**
 * useFocusTrap hook - Focus trap for modals
 */
export function useFocusTrap(enabled = true) {
    const ref = useRef(null);
    
    useEffect(() => {
        if (!enabled || !ref.current) return;
        
        const element = ref.current;
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        const handleKeyDown = (event) => {
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };
        
        element.addEventListener('keydown', handleKeyDown);
        
        return () => {
            element.removeEventListener('keydown', handleKeyDown);
        };
    }, [enabled]);
    
    return ref;
}

export default {
    useState,
    useReducer,
    useEffect,
    useCallback,
    useMemo,
    useRef,
    usePrevious,
    useInterval,
    useTimeout,
    useLocalStorage,
    useSessionStorage,
    useDebounce,
    useThrottle,
    useToggle,
    useCounter,
    useArray,
    useObject,
    useAsync,
    useEventListener,
    useOnClickOutside,
    useKeyPress,
    useHover,
    useWindowSize,
    useScrollPosition,
    useOnlineStatus,
    useGeolocation,
    useClipboard,
    useMediaQuery,
    useFocusTrap,
    cleanupAllHooks
};
