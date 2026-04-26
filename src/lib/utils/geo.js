/**
 * Returns a location-aware greeting string
 * Uses the browser's Intl API — zero cost, no API key
 */
export function getLocationGreeting(greeting) {
  try {
    const tz       = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const parts    = tz.split('/');
    const city     = parts[parts.length - 1].replace(/_/g, ' ');
    const country  = getCountryFromTz(tz);
    return `${greeting} from ${city}${country ? ', ' + country : ''}.`;
  } catch {
    return `${greeting}.`;
  }
}

function getCountryFromTz(tz) {
  const map = {
    'Africa/Nairobi':      'Kenya',
    'America/New_York':    'United States',
    'America/Los_Angeles': 'United States',
    'Europe/London':       'United Kingdom',
    'Europe/Paris':        'France',
    'Asia/Tokyo':          'Japan',
    'Asia/Kolkata':        'India',
    'Australia/Sydney':    'Australia',
  };
  return map[tz] ?? '';
}