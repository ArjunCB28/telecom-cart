import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

/**
 * Error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Default error response
  const errorResponse: ErrorResponse = {
    error: 'InternalServerError',
    message: err.message || 'An unexpected error occurred'
  };

  res.status(500).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'NotFound',
    message: `Route ${req.method} ${req.path} not found`
  });
};

