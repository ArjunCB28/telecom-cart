import { Request, Response } from 'express';
import { RequestWithUser, AddItemRequest, UpdateItemRequest, ErrorResponse } from '../types';
import { cartService } from '../services/cartService';

/**
 * Add item to cart
 * POST /api/cart/items
 */
export const addItem = (req: Request, res: Response): void => {
  try {
    const userId = (req as RequestWithUser).userId;
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found in request'
      });
      return;
    }

    const body = req.body as AddItemRequest;
    
    // Validate request body
    if (!body.itemId || !body.quantity) {
      res.status(400).json({
        error: 'BadRequest',
        message: 'itemId and quantity are required'
      });
      return;
    }

    const result = cartService.addItem(userId, body);
    
    if (result.error) {
      res.status(400).json({
        error: 'BadRequest',
        message: result.error
      });
      return;
    }

    res.status(201).json(result.cart);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: 'InternalServerError',
      message: err.message || 'Failed to add item to cart'
    });
  }
};

/**
 * Update item quantity in cart
 * PUT /api/cart/items/:itemId
 */
export const updateItem = (req: Request, res: Response): void => {
  try {
    const userId = (req as RequestWithUser).userId;
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found in request'
      });
      return;
    }

    const itemId = req.params.itemId;
    const body = req.body as UpdateItemRequest;
    
    // Validate request body
    if (!body.quantity) {
      res.status(400).json({
        error: 'BadRequest',
        message: 'quantity is required'
      });
      return;
    }

    const result = cartService.updateItemQuantity(userId, itemId, body);
    
    if (result.error) {
      if (result.error === 'Item not found in cart') {
        res.status(404).json({
          error: 'Item not found',
          message: 'The specified item does not exist in the cart'
        });
        return;
      }
      
      res.status(400).json({
        error: 'BadRequest',
        message: result.error
      });
      return;
    }

    res.status(200).json(result.cart);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: 'InternalServerError',
      message: err.message || 'Failed to update item in cart'
    });
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/items/:itemId
 */
export const removeItem = (req: Request, res: Response): void => {
  try {
    const userId = (req as RequestWithUser).userId;
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found in request'
      });
      return;
    }

    const itemId = req.params.itemId;
    const result = cartService.removeItem(userId, itemId);
    
    if (result.error) {
      res.status(404).json({
        error: 'Item not found',
        message: 'The specified item does not exist in the cart'
      });
      return;
    }

    res.status(200).json(result.cart);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: 'InternalServerError',
      message: err.message || 'Failed to remove item from cart'
    });
  }
};

/**
 * Get cart state
 * GET /api/cart
 */
export const getCart = (req: Request, res: Response): void => {
  try {
    const userId = (req as RequestWithUser).userId;
    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User ID not found in request'
      });
      return;
    }

    const cart = cartService.getCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: 'InternalServerError',
      message: err.message || 'Failed to get cart'
    });
  }
};

