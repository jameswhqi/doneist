import { Prisma } from '@/prisma/client';
import { char, coroutine, digits, optionalWhitespace } from 'arcsecond';

export function formatDate(date: Date | null) {
  return date ? `${date.getMonth() + 1}/${date.getDate()}` : '';
}

export function formatUTCDate(date: Date | null) {
  return date ? `${date.getUTCMonth() + 1}/${date.getUTCDate()}` : '';
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

export type ProjectWithPosts = Prisma.ProjectGetPayload<{ include: { tasks: true; }; }>;

export const dateParser = coroutine(run => {
  run(optionalWhitespace);
  const month = run(digits.map(Number));
  run(optionalWhitespace);
  run(char('/'));
  run(optionalWhitespace);
  const day = run(digits.map(Number));
  run(optionalWhitespace);

  return { month, day };
});

export function validateUTCDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  ) {
    return date;
  } else {
    throw Error('date out of bounds');
  };
}