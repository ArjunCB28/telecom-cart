import { Cart, CartItem, CartContext, AddItemRequest, UpdateItemRequest } from '../types';
import { cartStore } from '../store/cartStore';
import { itemService } from './itemService';
import { CART_TTL_MS, MAX_ITEMS_PER_CART } from '../config/constants';

/**
 * Generate a unique cart ID
 */
function generateCartId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `cart-${timestamp}-${random}`;
}

/**
 * Check if a cart has expired
 */
function isCartExpired(cart: Cart): boolean {
  const expiresAt = new Date(cart.expiresAt).getTime();
  return Date.now() > expiresAt;
}

/**
 * Create a new empty cart
 */
function createNewCart(): Cart {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CART_TTL_MS);
  
  return {
    cartId: generateCartId(),
    items: [],
    total: 0,
    expiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Calculate cart total
 */
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Update cart timestamps
 */
function updateCartTimestamps(cart: Cart): Cart {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CART_TTL_MS);
  
  return {
    ...cart,
    expiresAt: expiresAt.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * CartService - Central coordinator for cart operations
 */
class CartService {
  /**
   * Get or create cart for user (handles expiry silently)
   */
  getOrCreateCart(userId: string): Cart {
    const context = cartStore.getCart(userId);
    
    if (!context) {
      const newCart = createNewCart();
      cartStore.saveCart(userId, newCart);
      return newCart;
    }
    
    if (isCartExpired(context.cart)) {
      // Silent expiration - create new cart
      const newCart = createNewCart();
      cartStore.saveCart(userId, newCart);
      return newCart;
    }
    
    return context.cart;
  }

  /**
   * Add item to cart
   */
  addItem(userId: string, request: AddItemRequest): { cart: Cart; error?: string } {
    // Validate item
    const itemValidation = itemService.validateItem(request.itemId);
    if (!itemValidation.valid) {
      return { cart: this.getOrCreateCart(userId), error: itemValidation.error };
    }

    // Validate quantity
    if (!request.quantity || request.quantity <= 0 || !Number.isInteger(request.quantity)) {
      return { cart: this.getOrCreateCart(userId), error: 'Quantity must be a positive integer' };
    }

    // Get or create cart
    let cart = this.getOrCreateCart(userId);

    // Check max items per cart
    if (cart.items.length >= MAX_ITEMS_PER_CART) {
      return { cart, error: `Maximum ${MAX_ITEMS_PER_CART} items per cart allowed` };
    }

    // Get item details
    const item = itemService.getItem(request.itemId);
    if (!item) {
      return { cart, error: `Item ${request.itemId} not found` };
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(i => i.itemId === request.itemId);
    
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += request.quantity;
    } else {
      // Add new item
      cart.items.push({
        itemId: request.itemId,
        quantity: request.quantity,
        price: item.price,
      });
    }

    // Recalculate total and update timestamps
    cart.total = calculateTotal(cart.items);
    cart = updateCartTimestamps(cart);
    
    // Save cart
    cartStore.saveCart(userId, cart);
    
    return { cart };
  }

  /**
   * Update item quantity in cart
   */
  updateItemQuantity(userId: string, itemId: string, request: UpdateItemRequest): { cart: Cart; error?: string } {
    // Validate quantity
    if (!request.quantity || request.quantity <= 0 || !Number.isInteger(request.quantity)) {
      const cart = this.getOrCreateCart(userId);
      return { cart, error: 'Quantity must be a positive integer' };
    }

    // Get or create cart
    let cart = this.getOrCreateCart(userId);

    // Find item in cart
    const itemIndex = cart.items.findIndex(i => i.itemId === itemId);
    if (itemIndex < 0) {
      return { cart, error: 'Item not found in cart' };
    }

    // Update quantity
    cart.items[itemIndex].quantity = request.quantity;

    // Recalculate total and update timestamps
    cart.total = calculateTotal(cart.items);
    cart = updateCartTimestamps(cart);
    
    // Save cart
    cartStore.saveCart(userId, cart);
    
    return { cart };
  }

  /**
   * Remove item from cart
   */
  removeItem(userId: string, itemId: string): { cart: Cart; error?: string } {
    // Get or create cart
    let cart = this.getOrCreateCart(userId);

    // Find item in cart
    const itemIndex = cart.items.findIndex(i => i.itemId === itemId);
    if (itemIndex < 0) {
      return { cart, error: 'Item not found in cart' };
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    // Recalculate total and update timestamps
    cart.total = calculateTotal(cart.items);
    cart = updateCartTimestamps(cart);
    
    // Save cart (even if empty, context is maintained)
    cartStore.saveCart(userId, cart);
    
    return { cart };
  }

  /**
   * Get cart state
   */
  getCart(userId: string): Cart {
    return this.getOrCreateCart(userId);
  }
}

export const cartService = new CartService();

