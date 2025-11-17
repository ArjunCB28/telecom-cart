# Telecom Cart API

A REST API for cart management operations built with Node.js, Express, and TypeScript.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 3. Generate JWT Token

```bash
npm run generate-token yourname
```

**Note:** This is a temporary solution for getting user-specific carts. The token encodes your name as the `userId`, which is used to save items in the cart store against that specific user.

- Generate another token with a different username to test multi-user cart isolation
- Copy the generated token for use in Postman

### 4. Setup Postman

1. **Import Collection:**
   - Import the JSON file from `collections/telecom-cart-api.postman_collection.json` into Postman

2. **Set Authorization Token:**
   - Open the collection variables
   - Replace `{{jwt_token}}` with your generated token
   - Or manually set it in the Authorization header: `Bearer <your-token>`

3. **Collection Structure:**
   - **Items Folder:** Contains `GET /api/items` endpoint (public, no auth required)
   - **Cart Folder:** Contains all cart operations (requires authentication)

### 5. Testing the API

- **Get Available Items:** Use `GET /api/items` to see all available items
- **Add Items to Cart:** Use `POST /api/cart/items` to add items to your cart
- **View Cart:** Use `GET /api/cart` to see your current cart state
- **Update/Remove Items:** Use the respective endpoints in the Cart folder

## Important Notes

- **Cart Expiry:** Cart expiry is set to **2 minutes** (configured in `src/config/constants.ts`) to easily test inactivity scenarios
- **User Isolation:** Each user (identified by `userId` in JWT token) has their own isolated cart
- **Token Generation:** Use `npm run generate-token <username>` to create tokens for different users


## API Endpoints

- `GET /api/items` - Get all available items (public)
- `POST /api/cart/items` - Add item to cart (requires auth)
- `PUT /api/cart/items/:itemId` - Update item quantity (requires auth)
- `DELETE /api/cart/items/:itemId` - Remove item from cart (requires auth)
- `GET /api/cart` - Get cart state (requires auth)

## Project Structure

```
collections/         # Postman API collection files
scripts/             # Utility scripts (generate-token.ts)
src/
├── config/          # Configuration constants
├── controllers/     # Request handlers
├── data/            # Mock data files (items.json)
├── middleware/      # Express middleware (auth, error handling)
├── routes/          # API routes
├── services/        # Business logic (CartService, ItemService)
├── store/           # Data store layer
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
tests/               # Test files for critical paths
```

## Testing

Tests are located in the `tests/` folder and cover critical paths:
- Cart operations (add, update, remove, expiry)
- Item validation
- Authentication
- Data store operations

Run tests with:
```bash
npm test
```

## Design Decisions

### Items API
- Added `GET /api/items` endpoint to retrieve all available items
- This endpoint is public (no authentication required) to allow users to browse items before adding them to their cart

### Authentication & User-Based Carts
- Implemented JWT-based authentication layer to identify users and associate carts with specific users
- Each user's cart is isolated and managed independently based on their `userId` extracted from the JWT token

### Trade-offs & Future Considerations
- **Current Limitation:** Logged-out users cannot use the cart functionality
- **Future Enhancement:** Session cookie-based logic could be implemented to support anonymous users
- **Checkout Flow:** Users can be required to log in during the checkout process, at which point their session-based cart can be merged with their user account