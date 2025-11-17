import { Cart, CartContext } from '../types';

/**
 * In-memory HashMap store for cart contexts
 * Key: userId (string)
 * Value: Array of CartContext objects with updatedAt timestamp
 */
class CartStore {
  private store: Map<string, CartContext[]> = new Map();

  /**
   * Get the most recent cart for a user
   */
  getCart(userId: string): CartContext | null {
    const contexts = this.store.get(userId);
    if (!contexts || contexts.length === 0) {
      return null;
    }
    
    // Return the most recent cart (last in array)
    return contexts[contexts.length - 1];
  }

  /**
   * Get all cart contexts for a user
   */
  getAllCarts(userId: string): CartContext[] {
    return this.store.get(userId) || [];
  }

  /**
   * Save or update a cart for a user
   */
  saveCart(userId: string, cart: Cart): void {
    const contexts = this.store.get(userId) || [];
    const updatedAt = Date.now();
    
    // Find if cart already exists
    const existingIndex = contexts.findIndex(ctx => ctx.cart.cartId === cart.cartId);
    
    if (existingIndex >= 0) {
      // Update existing cart
      contexts[existingIndex] = {
        cart: { ...cart, updatedAt: new Date(updatedAt).toISOString() },
        updatedAt
      };
    } else {
      // Add new cart context
      contexts.push({
        cart: { ...cart, updatedAt: new Date(updatedAt).toISOString() },
        updatedAt
      });
    }
    
    this.store.set(userId, contexts);
  }

  /**
   * Delete a specific cart for a user
   */
  deleteCart(userId: string, cartId: string): boolean {
    const contexts = this.store.get(userId);
    if (!contexts) {
      return false;
    }
    
    const filtered = contexts.filter(ctx => ctx.cart.cartId !== cartId);
    if (filtered.length === contexts.length) {
      return false; // Cart not found
    }
    
    this.store.set(userId, filtered);
    return true;
  }

  /**
   * Clear all carts for a user
   */
  clearUserCarts(userId: string): void {
    this.store.delete(userId);
  }

  /**
   * Get all users (for debugging/admin purposes)
   */
  getAllUsers(): string[] {
    return Array.from(this.store.keys());
  }
}

export const cartStore = new CartStore();

