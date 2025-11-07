// Simple password authentication utilities

const STORAGE_KEY = 'dashboard_authenticated';

export function validatePassword(inputPassword: string): boolean {
  const correctPassword = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || 'admin123';
  return inputPassword === correctPassword;
}

export function setAuthenticated(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, 'true');
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  }
  return false;
}

export function clearAuthentication(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
