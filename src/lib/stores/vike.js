import { writable } from 'svelte/store';

// 'idle' | 'listening' | 'speaking' | 'thinking'
export const vikeState = writable('idle');

// Is voice available in this browser
export const voiceAvailable = writable(false);

// Current transcript from speech recognition
export const transcript = writable('');

// Is VIKE muted
export const muted = writable(false);