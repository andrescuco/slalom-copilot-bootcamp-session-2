const { isValidDueDate } = require('../src/app');

describe('isValidDueDate', () => {
  it('accepts empty due date values', () => {
    expect(isValidDueDate(undefined)).toBe(true);
    expect(isValidDueDate(null)).toBe(true);
    expect(isValidDueDate('')).toBe(true);
  });

  it('accepts valid ISO date strings', () => {
    expect(isValidDueDate('2026-01-01')).toBe(true);
    expect(isValidDueDate('2024-02-29')).toBe(true);
  });

  it('rejects malformed or invalid dates', () => {
    expect(isValidDueDate('2026/01/01')).toBe(false);
    expect(isValidDueDate('not-a-date')).toBe(false);
    expect(isValidDueDate('2023-02-29')).toBe(false);
    expect(isValidDueDate('2026-13-01')).toBe(false);
    expect(isValidDueDate(123)).toBe(false);
  });
});
