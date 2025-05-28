export function formatDate(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function formatUTCDate(date: Date) {
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}

export function formatDateISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatUTCDateISO(date: Date) {
  return date.toISOString().split('T')[0];
}

export function assertNotNull<T>(x: T | null, label: string): asserts x is T {
  if (x === null) throw new Error(label + ' should not be null');
}