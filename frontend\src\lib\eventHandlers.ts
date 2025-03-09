/**
 * Event handler utilities for form inputs and other events
 */

import React from 'react';

/**
 * Handle input change events with proper typing
 * @param setter - The state setter function
 * @returns An event handler function
 */
export function handleInputChange<T>(setter: (value: T) => void) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value as unknown as T);
  };
}

/**
 * Handle select change events with proper typing
 * @param setter - The state setter function
 * @returns An event handler function
 */
export function handleSelectChange<T>(setter: (value: T) => void) {
  return (e: React.ChangeEvent<{ value: unknown }>) => {
    setter(e.target.value as T);
  };
}

/**
 * Handle checkbox change events with proper typing
 * @param setter - The state setter function
 * @returns An event handler function
 */
export function handleCheckboxChange(setter: (checked: boolean) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.checked);
  };
}

/**
 * Handle pagination change events with proper typing
 * @param setter - The state setter function
 * @returns An event handler function
 */
export function handlePageChange(setter: (page: number) => void) {
  return (_event: React.ChangeEvent<unknown>, page: number) => {
    setter(page);
  };
}

/**
 * Handle key press events with proper typing
 * @param callback - The callback function to execute when the key is pressed
 * @param key - The key to listen for (default: 'Enter')
 * @returns An event handler function
 */
export function handleKeyPress(callback: () => void, key: string = 'Enter') {
  return (e: React.KeyboardEvent) => {
    if (e.key === key) {
      e.preventDefault();
      callback();
    }
  };
} 