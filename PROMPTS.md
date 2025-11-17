Read the specification files `SPEC-A-architecture.md` and `SPEC-B-api.md` provided below.

Create a Node.js (version 22) Express server using TypeScript that implements a REST API.

Requirements:
- Build a REST API handler (controllers/routes) according to the endpoint contracts.
- Implement individual services:
  - ItemService: for item-level logic. Items should be loaded from a mock JSON file (`src/data/items.json`).
  - CartService: for cart-level logic (add, update, expiry, per-user/session context).
- Follow the architectural separation given in architecture.md.
- Add Authentication layer for cart service. Use Express middleware to achieve that. Note: GET /api/items endpoint should be public (no authentication required).
- Use pure functions, TypeScript types.
- Use a data store layer using Hashmap. Internally use userId as key and within value array, store the cart information with cart updatedAt timestamp.
- Include clear error handling.
- Structure code into `src/`
- Add postman collections in `collections/` folder for cart and items



Follow-ups:
- Add item controller to get list of items from a mock file (GET /api/items endpoint)
- JWT Authentication: User ID should be extracted from Authorization header (Bearer token). JWT token can be decoded to extract userId from payload. Base URL should be `http://localhost:3000/api` (not `/api/v1`)
- Cart Expiry: Set cart expiry time to 2 minutes (in `src/config/constants.ts`) for easy testing
