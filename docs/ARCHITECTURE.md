# Food Ordering App Architecture

## Stack
- Mobile: React Native + Expo + TypeScript
- API: Node.js + Express + TypeScript
- Database: PostgreSQL
- Payments: Stripe PaymentIntents + Stripe webhooks
- Authentication: JWT access tokens

## Actors
- Customer: browse restaurants, manage cart, checkout, pay, track orders
- Restaurant owner: receive orders, accept, prepare, mark ready for delivery
- Rider: view available deliveries, claim jobs, update delivery status/location
- Admin: privileged restaurant/order access

## Request flow
`Mobile -> Express API -> module service -> PostgreSQL / Stripe`

The API is mounted at `/api/v1`. Stripe's webhook is mounted separately at `/api/v1/payments/webhook` and receives the raw request body so the signature can be verified.

## Core modules
- auth
- restaurants
- cart
- addresses
- orders
- payments
- restaurant-orders
- delivery

Each module keeps HTTP routes, business logic and data access separate where practical.

## Order lifecycle
`pending_payment -> confirmed -> accepted -> preparing -> ready_for_delivery`

A restaurant marking an order `ready_for_delivery` creates a delivery record transactionally. Rider status then progresses `assigned -> accepted -> picked_up -> delivered`.

## Payment lifecycle
1. Customer selects an address.
2. Checkout creates an order using server-side menu prices.
3. API creates a Stripe PaymentIntent in GBP.
4. Mobile opens Stripe PaymentSheet with the client secret.
5. Stripe sends a signed webhook after payment changes state.
6. API verifies amount/currency/reference and marks payment/order paid atomically.

The mobile client never decides whether an order is paid.

## Money
All monetary values are integer minor units. UK orders use GBP, so `£12.50` is represented as `1250`.

## Database
Run the initial migration with `npm run migrate` from `backend` after setting `DATABASE_URL`.

## Environment
Backend requires:
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Mobile requires `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

## Security requirements before production
- Use production Stripe keys only in deployment secrets.
- Configure Stripe webhook endpoint and signing secret.
- Restrict CORS to known mobile/web origins where applicable.
- Add request validation/rate limits to every public endpoint.
- Enable PostgreSQL backups and encrypted connections.
- Use HTTPS for every deployed API endpoint.
- Add observability, crash reporting and payment/order alerts.
