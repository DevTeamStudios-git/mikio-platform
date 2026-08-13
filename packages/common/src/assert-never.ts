/**
 * Exhaustiveness check for discriminated unions. Place in the default branch
 * of a switch over a union to get a compile error when a case is added that
 * isn't handled yet.
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}