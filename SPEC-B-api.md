# API Specification

## Overview

This document describes the REST API for cart management operations. The API supports multiple users with isolated cart contexts, where each user's cart is managed independently.

## Authentication

Most endpoints require authentication. The user ID is extracted from the Authorization header. The JWT token can be decoded to extract the userId from the payload.

**Header Format:**
```
Authorization: Bearer <jwt-token>
```

The JWT payload should contain a `userId` field that identifies the user.

**Note:** The `GET /api/items` endpoint is public and does not require authentication.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### 1. Get All Items

Retrieve a list of all available items from the mock data file.

**Endpoint:** `GET /items`

**Request Headers:**
```
(none required - public endpoint)
```

**Response: 200 OK**
```json
[
  {
    "itemId": "string",
    "name": "string",
    "price": number,
    "description": "string"
  }
]
```

**Response: 500 Internal Server Error**
```json
{
  "error": "InternalServerError",
  "message": "Failed to retrieve items"
}
```

**Business Rules:**
- This is a public endpoint and does not require authentication
- Items are loaded from a mock JSON file (`src/data/items.json`)
- Returns all available items that can be added to a cart

---

### 2. Add Cart Item

Add an item to the user's cart.

**Endpoint:** `POST /cart/items`

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "itemId": "string",
  "quantity": number
}
```

**Response: 201 Created**
```json
{
  "cartId": "string",
  "items": [
    {
      "itemId": "string",
      "quantity": number,
      "price": number
    }
  ],
  "total": number,
  "expiresAt": "ISO 8601 timestamp"
}
```

**Response: 400 Bad Request**
```json
{
  "error": "string",
  "message": "string"
}
```

**Business Rules:**
- Maximum items per cart limit is enforced
- Item structure must be valid
- If cart context has expired, a new cart is automatically created

---

### 3. Update Cart Item Quantity

Update the quantity of an existing item in the cart.

**Endpoint:** `PUT /cart/items/:itemId`

**Path Parameters:**
- `itemId` (string, required) - The identifier of the item to update

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "quantity": number
}
```

**Response: 200 OK**
```json
{
  "cartId": "string",
  "items": [
    {
      "itemId": "string",
      "quantity": number,
      "price": number
    }
  ],
  "total": number,
  "expiresAt": "ISO 8601 timestamp"
}
```

**Response: 404 Not Found**
```json
{
  "error": "Item not found",
  "message": "The specified item does not exist in the cart"
}
```

**Response: 400 Bad Request**
```json
{
  "error": "string",
  "message": "string"
}
```

**Business Rules:**
- Item must exist in the cart
- Quantity must be a positive number
- Maximum items per cart limit is enforced

---

### 4. Remove Cart Item

Remove an item from the user's cart.

**Endpoint:** `DELETE /cart/items/:itemId`

**Path Parameters:**
- `itemId` (string, required) - The identifier of the item to remove

**Request Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response: 200 OK**
```json
{
  "cartId": "string",
  "items": [
    {
      "itemId": "string",
      "quantity": number,
      "price": number
    }
  ],
  "total": number,
  "expiresAt": "ISO 8601 timestamp"
}
```

**Response: 404 Not Found**
```json
{
  "error": "Item not found",
  "message": "The specified item does not exist in the cart"
}
```

**Business Rules:**
- Item must exist in the cart
- If cart becomes empty after removal, cart context is maintained

---

### 5. Get Cart State

Retrieve the current state of the user's cart.

**Endpoint:** `GET /cart`

**Request Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response: 200 OK**
```json
{
  "cartId": "string",
  "items": [
    {
      "itemId": "string",
      "quantity": number,
      "price": number
    }
  ],
  "total": number,
  "expiresAt": "ISO 8601 timestamp",
  "createdAt": "ISO 8601 timestamp"
}
```

**Response: 200 OK (Empty Cart)**
```json
{
  "cartId": "string",
  "items": [],
  "total": 0,
  "expiresAt": "ISO 8601 timestamp",
  "createdAt": "ISO 8601 timestamp"
}
```

**Business Rules:**
- If cart context has expired, a new empty cart is automatically created
- Silent expiration: expired contexts result in new cart creation without explicit error

---

## Error Handling

### Error Response Format

All error responses follow this structure:

```json
{
  "error": "ErrorCode",
  "message": "Human-readable error message"
}
```

### Common Error Codes

- **400 Bad Request** - Invalid input, validation failure, or business rule violation
- **401 Unauthorized** - Missing or invalid Authorization header, or invalid JWT token
- **404 Not Found** - Resource (item, cart) not found
- **500 Internal Server Error** - Unexpected server error

### Business Rule Violations

When business rules are violated (e.g., maximum items per cart), the API returns a 400 Bad Request with a descriptive error message.

---

## Cart Context and Expiry

- Each cart has a time-to-live (TTL) and an expiry timestamp
- Cart contexts expire independently per user
- When a cart context expires, operations automatically create a new cart context without explicit error
- The `expiresAt` field in responses indicates when the cart will expire

---

## Data Models

### Item
```json
{
  "itemId": "string",
  "name": "string",
  "price": number,
  "description": "string"
}
```

### Cart Item
```json
{
  "itemId": "string",
  "quantity": number,
  "price": number
}
```

### Cart
```json
{
  "cartId": "string",
  "items": [CartItem],
  "total": number,
  "expiresAt": "ISO 8601 timestamp",
  "createdAt": "ISO 8601 timestamp"
}
```

---

## Example Requests

### Get All Items
```bash
curl -X GET http://localhost:3000/api/items
```

### Add Item to Cart
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "itemId": "item-001",
    "quantity": 2
  }'
```

### Update Item Quantity
```bash
curl -X PUT http://localhost:3000/api/cart/items/item-001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "quantity": 3
  }'
```

### Remove Item from Cart
```bash
curl -X DELETE http://localhost:3000/api/cart/items/item-001 \
  -H "Authorization: Bearer <jwt-token>"
```

### Get Cart State
```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer <jwt-token>"
```

