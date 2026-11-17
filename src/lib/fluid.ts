/**
 * One-off fluid size, on the same scale as the tokens in globals.css.
 *
 * Returns a CSS length that is `min` px on a 375px-wide phone, `max` px at the
 * 1440px design width (linear in between), and then keeps growing in
 * proportion until the viewport reaches 1920px (1.33x), where it locks.
 *
 *   fluid(16, 18)  ->  16px @375 · 18px @1440 · 24px @1920
 */
export function fluid(min: number, max: number): string {
  return `calc(${min}px + ${max - min} * var(--t) + ${max} * var(--g))`;
}
