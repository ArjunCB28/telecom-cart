import { Request } from 'express';

export interface CartItem {
  itemId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  total: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartContext {
  cart: Cart;
  updatedAt: number; // Unix timestamp in milliseconds
}

export interface AddItemRequest {
  itemId: string;
  quantity: number;
}

export interface UpdateItemRequest {
  quantity: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface JWTPayload {
  userId: string;
  [key: string]: any;
}

export interface Item {
  itemId: string;
  name: string;
  price: number;
  description?: string;
}

export interface RequestWithUser extends Request {
  userId?: string;
}

