# Tests

Minimal tests covering main paths only.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Test Coverage

Tests cover the following main paths:

### CartService Tests (`cartService.test.ts`)
- Create new cart
- Add item to cart
- Update item quantity
- Remove item from cart
- Get cart with items

### ItemService Tests (`itemService.test.ts`)
- Get all available items
- Get item by ID
- Validate item

### CartStore Tests (`cartStore.test.ts`)
- Save and retrieve cart

### Authentication Tests (`auth.test.ts`)
- Valid token acceptance
- Missing token rejection
