# Food Ordering App — Architecture

## 1. Purpose

The product is a customer-facing React Native application backed by a Node.js/Express API and PostgreSQL. The MVP supports registration, authentication, restaurant discovery, menus, carts, delivery addresses, checkout, Stripe payments, order history, and basic order tracking.

The backend also contains restaurant-operator and rider workflows that can be expanded after the customer MVP is stable.

## 2. Technology

### Mobile
- React Native
- Expo SDK 53
- TypeScript
- Axios
- AsyncStorage
- Stripe React Native SDK
- Local screen state for the MVP shell

### Backend
- Node.js
- TypeScript
- Express 5
- PostgreSQL
- JWT access/refresh tokens
- Zod validation
- Stripe PaymentIntents and webhooks

## 3. Repository structure

```text
food-ordering-app/
├── mobile/          # Expo React Native application
├── backend/         # Express API and database migrations
├── docs/            # Product, architecture, and API documentation
├── scripts/         # Root development helpers
└── README.md
```

## 4. Mobile architecture

The current MVP uses a small application shell in `mobile/App.tsx`. Authentication state is provided by `AuthContext`; screens call typed service functions that use the shared Axios client.

```text
App.tsx
  ↓
AuthProvider
  ↓
Role-aware app shell
  ↓
Customer screens / Restaurant screens / Rider screens
  ↓
Service layer
  ↓
Express API
```

The mobile project keeps shared types in `src/types`, API calls in `src/services`, authentication persistence in `src/context`, and reusable authentication screens under `src/screens/auth`.

## 5. Backend architecture

The backend is organized by domain module. Each module keeps its routes, service/repository logic, and types close together.

```text
HTTP request
  ↓
Express middleware
  ↓
Route
  ↓
Service / business rules
  ↓
Repository / PostgreSQL
```

The API also has security middleware for Helmet, CORS, JSON size limits, and rate limiting. Stripe webhooks are registered before normal JSON parsing so the exact raw body can be signature-verified.

## 6. Authentication

Registration and login return both an access token and a refresh token. Access tokens expire after 15 minutes; refresh tokens expire after 30 days.

The mobile app stores both tokens in AsyncStorage and refreshes the session periodically. A failed refresh clears the local session and returns the user to authentication.

The server never accepts a client-supplied role during registration; new accounts are customers by default.

## 7. Customer order lifecycle

```text
Register / Login
  ↓
Browse restaurants
  ↓
Restaurant menu
  ↓
Cart
  ↓
Delivery address
  ↓
Create pending-payment order
  ↓
Stripe PaymentIntent / PaymentSheet
  ↓
Server-side payment verification
  ↓
Order confirmed
  ↓
Restaurant accepts
  ↓
Preparing
  ↓
Ready for delivery
  ↓
Delivery
  ↓
Delivered
```

The server calculates prices from current menu data and stores price/name snapshots in `order_items`. The mobile client never decides the final payable amount or payment status.

## 8. Currency and money

The MVP uses **GBP** consistently. Monetary values are integer minor units: `£12.50` is stored as `1250`.

Orders and payments both use `GBP`, and Stripe receives the order currency from the trusted server-side order record.

## 9. Payments

The payment flow is:

1. Customer creates an order in `pending_payment` state.
2. Backend creates a Stripe PaymentIntent using the server-calculated order total.
3. Mobile initializes Stripe PaymentSheet with the client secret.
4. Customer completes payment in Stripe's native UI.
5. Mobile may request server-side verification of the PaymentIntent.
6. Stripe's signed webhook is the authoritative asynchronous payment signal.
7. Backend marks the payment paid and moves the order to `confirmed`.

Stripe secret keys and webhook secrets remain server-side. The mobile app receives only the publishable key.

## 10. Restaurant and rider workflows

Restaurant operators can view orders belonging to their own restaurant and use the controlled status sequence:

```text
confirmed → accepted → preparing → ready_for_delivery
```

Cancellation is allowed from `confirmed` and `accepted`.

When an order becomes `ready_for_delivery`, a delivery record is created transactionally.

Riders can claim an unassigned delivery and then progress:

```text
assigned → accepted → picked_up → delivered
```

Rider status changes are scoped to the authenticated rider and invalid transitions are rejected.

## 11. Database

The initial migration creates users, restaurants, menu categories/items, carts, addresses, orders, order items, payments, and deliveries. The migration is idempotent and can be run with:

```text
cd backend
npm run migrate
```

## 12. API conventions

Base path:

```text
/api/v1
```

Important endpoints include:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
GET  /api/v1/restaurants
GET  /api/v1/restaurants/:id/menu
GET  /api/v1/cart
POST /api/v1/cart/items
GET  /api/v1/addresses
POST /api/v1/orders/checkout
GET  /api/v1/orders
GET  /api/v1/orders/:id
POST /api/v1/payments/initialize
GET  /api/v1/payments/verify/:paymentIntentId
POST /api/v1/payments/webhook
```

Successful responses use `{ success: true, data: ... }`; API errors use `{ success: false, error: { code, message } }`.

## 13. Development workflow

The repository root provides scripts for installing both applications, running both development processes, and typechecking both projects. CI uses the committed lockfiles and the same typecheck commands.

The `main` branch should remain untouched while changes are developed and verified on a working branch.

## 14. Production requirements

Before production, the project still needs automated tests, deployment configuration, database backups, observability, push notifications, a production Stripe webhook, HTTPS, and a formal restaurant/admin management interface.
