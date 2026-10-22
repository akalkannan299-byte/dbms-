import { describe, it, expect } from 'vitest';

describe('cart money arithmetic', () => {
  it('calculates line total and estimated 5% tax', () => {
    const items = [{ price: 60, quantity: 2 }, { price: 30, quantity: 3 }, { price: 50, quantity: 2 }];
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(subtotal).toBe(310);
    expect(Number((subtotal * 0.05).toFixed(2))).toBe(15.5);
    expect(Number((subtotal * 1.05).toFixed(2))).toBe(325.5);
  });
});
