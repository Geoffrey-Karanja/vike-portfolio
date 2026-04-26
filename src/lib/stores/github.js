import { writable } from 'svelte/store';

// Raw repos array from GitHub API
export const repos = writable([]);

// Loading state
export const loading = writable(false);

// Error state
export const error = writable(null);

// Currently focused repo in constellation
export const focusedRepo = writable(null);