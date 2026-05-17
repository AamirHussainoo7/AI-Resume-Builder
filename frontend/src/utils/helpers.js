/**
 * Utility helper functions.
 */

/** Format a date string to readable format */
export function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

/** Format relative time (e.g., "2 hours ago") */
export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateStr);
}

/** Truncate text with ellipsis */
export function truncate(str, maxLength = 100) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

/** Get initials from a name */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Debounce function */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Generate a unique ID */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/** Capitalize first letter */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
