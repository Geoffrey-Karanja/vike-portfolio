const BASE = 'https://api.github.com';

/**
 * Fetch public repos for a username
 * Sorted by stars, top 10
 */
export async function fetchRepos(username) {
  const res = await fetch(
    `${BASE}/users/${username}/repos?sort=stars&per_page=10&type=public`
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

/**
 * Fetch user profile
 */
export async function fetchProfile(username) {
  const res = await fetch(`${BASE}/users/${username}`);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

/**
 * Map a repo language to a color
 */
export function languageColor(lang) {
  const map = {
    Swift:       '#FA7343',
    JavaScript:  '#F7DF1E',
    TypeScript:  '#3178C6',
    Python:      '#3776AB',
    Rust:        '#CE422B',
    Go:          '#00ADD8',
    Kotlin:      '#7F52FF',
    Dart:        '#00B4AB',
    HTML:        '#E34F26',
    CSS:         '#1572B6',
    Shell:       '#89E051',
  };
  return map[lang] ?? '#666666';
}