import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../src/middleware/auth';
import { generateTestToken } from '../src/utils/jwtHelper';

describe('Authentication Middleware - Main Paths', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
    };
    
    nextFunction = jest.fn() as NextFunction;
  });

  test('should allow request with valid token', () => {
    const token = generateTestToken('test-user-123');
    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };
    
    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    
    expect(nextFunction).toHaveBeenCalled();
    expect((mockRequest as any).userId).toBe('test-user-123');
  });

  test('should reject request without token', () => {
    mockRequest.headers = {};
    
    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
