import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

/**
 * Generate a JWT token for testing purposes
 * In production, this would use a proper secret and be handled by an auth service
 */
export function generateTestToken(userId: string): string {
  const payload: JWTPayload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
  };

  // For testing, we use a simple secret. In production, use a secure secret.
  const secret = process.env.JWT_SECRET || 'test-secret-key';
  
  return jwt.sign(payload, secret);
}

/**
 * Decode JWT token (for development/testing)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload | null;
  } catch (error) {
    return null;
  }
}

