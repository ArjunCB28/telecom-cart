import { cartService } from '../src/services/cartService';
import { cartStore } from '../src/store/cartStore';

describe('CartService - Main Paths', () => {
  beforeEach(() => {
    cartStore.clearUserCarts('test-user-1');
  });

  test('should create a new empty cart', () => {
    const cart = cartService.getOrCreateCart('test-user-1');
    
    expect(cart).toBeDefined();
    expect(cart.items).toHaveLength(0);
    expect(cart.total).toBe(0);
  });

  test('should add item to cart', () => {
    const result = cartService.addItem('test-user-1', {
      itemId: 'item-001',
      quantity: 2,
    });
    
    expect(result.error).toBeUndefined();
    expect(result.cart.items).toHaveLength(1);
    expect(result.cart.items[0].itemId).toBe('item-001');
    expect(result.cart.items[0].quantity).toBe(2);
  });

  test('should update item quantity', () => {
    cartService.addItem('test-user-1', { itemId: 'item-001', quantity: 2 });
    
    const result = cartService.updateItemQuantity('test-user-1', 'item-001', {
      quantity: 5,
    });
    
    expect(result.error).toBeUndefined();
    expect(result.cart.items[0].quantity).toBe(5);
  });

  test('should remove item from cart', () => {
    cartService.addItem('test-user-1', { itemId: 'item-001', quantity: 2 });
    
    const result = cartService.removeItem('test-user-1', 'item-001');
    
    expect(result.error).toBeUndefined();
    expect(result.cart.items).toHaveLength(0);
  });

  test('should get cart with items', () => {
    cartService.addItem('test-user-1', { itemId: 'item-001', quantity: 2 });
    
    const cart = cartService.getCart('test-user-1');
    
    expect(cart.items).toHaveLength(1);
    expect(cart.total).toBeGreaterThan(0);
  });
});
