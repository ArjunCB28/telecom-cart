import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, RequestWithUser } from '../types';

/**
 * Authentication middleware to extract userId from JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header. Expected format: Bearer <token>'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      // Verify or decode JWT token
      const secret = process.env.JWT_SECRET;
      let decoded: JWTPayload | null;
      
      if (secret) {
        // Verify token with secret (production mode)
        decoded = jwt.verify(token, secret) as JWTPayload;
      } else {
        // Decode without verification (development mode)
        decoded = jwt.decode(token) as JWTPayload | null;
      }
      
      if (!decoded || !decoded.userId) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token: userId not found in token payload'
        });
        return;
      }

      // Attach userId to request
      (req as RequestWithUser).userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or malformed token'
      });
      return;
    }
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication failed'
    });
    return;
  }
};

