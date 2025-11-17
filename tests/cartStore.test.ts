import { cartStore } from '../src/store/cartStore';
import { Cart } from '../src/types';

describe('CartStore - Main Paths', () => {
  beforeEach(() => {
    cartStore.clearUserCarts('test-user-1');
  });

  test('should save and retrieve cart', () => {
    const cart: Cart = {
      cartId: 'test-cart-1',
      items: [],
      total: 0,
      expiresAt: new Date(Date.now() + 1800000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    cartStore.saveCart('test-user-1', cart);
    const retrieved = cartStore.getCart('test-user-1');
    
    expect(retrieved).toBeDefined();
    expect(retrieved?.cart.cartId).toBe('test-cart-1');
  });
});
