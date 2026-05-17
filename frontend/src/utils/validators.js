/**
 * Form validation helpers.
 */

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  return '';
}

export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required.`;
  }
  return '';
}

export function validateUrl(url) {
  if (!url) return '';
  try {
    new URL(url);
    return '';
  } catch {
    return 'Please enter a valid URL.';
  }
}
