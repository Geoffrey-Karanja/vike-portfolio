import { writable, derived } from 'svelte/store';

// Boot state
export const booted = writable(false);

// Terminal history — array of { type, content } objects
// type: 'input' | 'output' | 'error' | 'system'
export const history = writable([]);

// Current active section being displayed
// null | 'about' | 'projects' | 'tools' | 'contact' | 'vitals'
export const activeSection = writable(null);

// Is the terminal currently processing a command
export const processing = writable(false);

// Add a line to terminal history
export function printLine(content, type = 'output') {
  history.update(h => [...h, { type, content, id: Date.now() + Math.random() }]);
}

// Clear terminal history
export function clearTerminal() {
  history.set([]);
}

// Boot sequence complete
export function completeBoot() {
  booted.set(true);
  printLine('VIKE v1.0.0 — Vocal Interface for Kinetic Exploration', 'system');
  printLine('Type a command or click the orb to speak.', 'system');
  printLine('Try: help', 'system');
}