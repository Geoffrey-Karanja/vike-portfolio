/**
 * Returns the mood based on current hour
 * dawn  → 5am  - 9am
 * day   → 9am  - 5pm
 * dusk  → 5pm  - 8pm
 * night → 8pm  - 5am
 */
export function getMood() {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 9)  return 'dawn';
  if (hour >= 9  && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}

/**
 * Returns greeting based on hour
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

/**
 * Formats a date to relative time
 * e.g. "3 days ago"
 */
export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);

  if (mins  < 1)   return 'just now';
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 30)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}