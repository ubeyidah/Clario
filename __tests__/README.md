# Test Suite Documentation

This directory contains comprehensive unit tests for the Clario learning platform.

## Overview

The test suite uses:
- **Jest** as the test framework
- **React Testing Library** for component testing
- **@testing-library/jest-dom** for DOM assertions

## Running Tests

```bash
# Run tests in watch mode (development)
pnpm test

# Run tests once (CI)
pnpm test:ci

# Run tests with coverage report
pnpm test:coverage
```

## Test Structure