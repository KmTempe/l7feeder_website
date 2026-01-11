import '@testing-library/jest-dom';

// Provide matchMedia for components using MUI's useMediaQuery.
if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => { },
            removeListener: () => { },
            addEventListener: () => { },
            removeEventListener: () => { },
            dispatchEvent: () => false,
        }),
    });
}

// Fail tests on console.error
const consoleError = console.error;
console.error = (...args) => {
    consoleError(...args);
    throw new Error('console.error was called');
};

