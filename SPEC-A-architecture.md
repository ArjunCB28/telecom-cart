# Architecture

## Architecture Overview

The system provides cart management as an API, supporting multiple users with isolated cart contexts. 

---

## Core Components

### 1. Request Handler
- Receives HTTP requests for cart actions (add, update, remove, view).
- Each request must include a user identity (currently its just a simple text name. It could be extended to use decoded jwt payload to get userId or session based cookie) indicating the requester.

### 2. API Controller
- Exposes REST endpoints for cart operations:
  - `POST /cart/items` — Add cart item
  - `PUT /cart/items/:itemId` — Update cart item quantity
  - `DELETE /cart/items/:itemId` — Remove item
  - `GET /cart` — Get cart state
- Validates and processes incoming requests.
- Performs input validation and translates errors into appropriate responses.
- Delegates business logic to CartManager and ItemManager.
- Handles errors and returns formatted responses.

### 3. Item Service
- Items are already created back-office.
- ItemManager only exposes the created Items.

### 4. Cart Service
- Central coordinator for cart operations.
- Ensures compliance with business rules, such as maximum items per cart and correct item structure.
- Handles session expiry checks and initialization of new cart contexts.

### 5. Cart Context Store
- Maintains a mapping between user/session identifiers and individual cart states.
- Each cart context includes items, quantities, pricing, time-to-live (TTL), and expiry timestamp.
- Supports silent expiration—if the context is expired, a new cart context is created without explicit error.

### 5. Integration Abstraction (SalesforceCartClient)
- Simulates external cart system behaviors for testing or future integration.
- Validates actions, handles cart context expiry, and ensures business logic consistency.

### 6. Logging Mechanism
- Records key events, such as cart creation, item addition/removal, and context expiry.
- Logging is non-intrusive and designed to support basic monitoring and debugging.

### 7. Plugin/Hook System
- Provides interfaces for attaching custom logic (post-processing, notifications) to cart actions.
- Allows for future extensibility without modifying core business logic.
