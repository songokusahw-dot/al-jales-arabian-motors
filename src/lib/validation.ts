export function isValidPhone(v: string): boolean {
  const digits = v.replace(/[\s-]/g, "");
  return /^\+?[0-9]{7,15}$/.test(digits);
}
export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
