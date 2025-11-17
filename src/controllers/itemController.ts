import { Request, Response } from 'express';
import { itemService } from '../services/itemService';

/**
 * Get all available items
 * GET /api/items
 */
export const getItems = (req: Request, res: Response): void => {
  try {
    const items = itemService.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: 'InternalServerError',
      message: err.message || 'Failed to retrieve items'
    });
  }
};

