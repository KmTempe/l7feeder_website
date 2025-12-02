import '@testing-library/jest-dom';

// Fail tests on console.error
const consoleError = console.error;
console.error = (...args) => {
    consoleError(...args);
    throw new Error('console.error was called');
};

