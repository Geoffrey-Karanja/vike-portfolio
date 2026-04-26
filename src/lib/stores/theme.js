import { writable, derived } from 'svelte/store';

// 'dawn' | 'day' | 'dusk' | 'night'
export const mood = writable('night');

// Derived accent color per mood — mirrors app.css
export const accentColor = derived(mood, $mood => {
  const map = {
    dawn:  '#FF9F0A',
    day:   '#0A84FF',
    dusk:  '#FF453A',
    night: '#BF5AF2'
  };
  return map[$mood] ?? '#0A84FF';
});