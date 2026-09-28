# Food Ordering App — Architecture

## 1. Purpose

This document defines the technical architecture for the food-ordering platform. The initial product is a customer-facing React Native mobile application that lets users discover restaurants, browse menus, create carts, place orders, and make payments.

The architecture is designed to grow into a multi-role platform supporting customers, restaurant operators, delivery riders, and administrators.

## 2. Initial technology direction

### Mobile
- React Native
- TypeScript
- Expo
- React Navigation
- Redux Toolkit for shared client state
- Typed API service layer

### Backend
- Node.js
- TypeScript
- Express
- REST API
- PostgreSQL as the target relational database

### Integrations
- Payment gateway: to be selected during payment implementation
- Push notifications: Firebase Cloud Messaging
- Maps/location: to be selected during delivery implementation

## 3. Repository structure

```text
food-ordering-app/
├── mobile/          # React Native application
├── backend/         # API and business logic
├── admin/           # Future administration/restaurant dashboard
├── docs/            # Product and technical documentation
└── README.md
```

## 4. Mobile architecture

The mobile application follows feature-oriented organization with clear separation between presentation, state, API services, and shared utilities.

```text
mobile/src/
├── components/      # reusable UI components
├── features/        # auth, restaurants, food, cart, orders, payments, profile
├── navigation/      # navigation stacks/tabs
├── services/        # HTTP client and external services
├── store/           # Redux store and slices
├── hooks/           # reusable React hooks
├── types/           # shared TypeScript types
├── utils/           # pure helper functions
├── constants/       # configuration constants
└── theme/           # design tokens and theme
```

## 5. Backend architecture

The backend uses a layered approach:

```text
Request
  ↓
Route
  ↓
Authentication / Validation Middleware
  ↓
Controller
  ↓
Service / Business Logic
  ↓
Repository / Data Access
  ↓
PostgreSQL
```

Suggested structure:

```text
backend/src/
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── repositories/
├── models/
├── validators/
├── types/
└── utils/
```

## 6. Core domain modules

1. Authentication and users
2. Restaurants
3. Menus and food items
4. Cart
5. Orders
6. Payments
7. Addresses
8. Notifications
9. Reviews
10. Delivery
11. Administration

## 7. Core order lifecycle

```text
Cart
  ↓
Checkout
  ↓
Payment initialization
  ↓
Payment verification
  ↓
Order created
  ↓
Restaurant accepts
  ↓
Food preparing
  ↓
Ready for delivery
  ↓
Rider assigned
  ↓
Out for delivery
  ↓
Delivered
```

Payment verification must be performed server-side. The mobile application must not be treated as authoritative for successful payment status.

## 8. Security principles

- HTTPS in all non-local environments
- Passwords hashed server-side
- Short-lived access tokens with refresh-token strategy
- Role-based authorization
- Request validation
- Rate limiting on authentication-sensitive endpoints
- Secrets stored in environment variables or a secret manager
- Payment credentials never bundled into the mobile application
- Payment webhook signatures verified server-side
- Do not store raw card details in the application database

## 9. State management

Redux Toolkit should contain only state that needs to be shared across screens or persisted according to product requirements. Server data should have a clearly defined caching strategy. Local UI state should remain inside components where practical.

## 10. API conventions

Base path:

```text
/api/v1
```

Examples:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/restaurants
GET  /api/v1/restaurants/:restaurantId
GET  /api/v1/restaurants/:restaurantId/menu
POST /api/v1/orders
GET  /api/v1/orders
GET  /api/v1/orders/:orderId
POST /api/v1/payments/initialize
POST /api/v1/payments/verify
```

Responses should use consistent JSON envelopes and HTTP status codes. API contracts will be documented in `docs/api.md` as implementation proceeds.

## 11. Testing strategy

- Unit tests for business rules and utilities
- API integration tests for critical endpoints
- Component tests for important mobile interactions
- End-to-end tests for registration, ordering, payment, and order tracking flows

## 12. Delivery strategy

Development should proceed in small, reviewable branches. Each major feature should have a focused branch and pull request. Production payment credentials and other secrets must never be committed to Git.

## 13. Architectural decisions still to finalize

- Exact Expo/native configuration
- PostgreSQL provider
- Authentication provider versus application-managed authentication
- Payment provider
- Maps provider
- Push notification setup
- Image storage provider
- Deployment platform
- Delivery tracking architecture
