# Food Ordering App

React Native + Expo mobile app with a Node.js/Express API and PostgreSQL database.

## Project layout

- `mobile/` — Expo React Native customer/restaurant/rider app
- `backend/` — Express API and database migrations
- `docs/` — product, architecture, and API documentation

## Prerequisites

- Node.js 20.18+ for Expo SDK 53
- PostgreSQL
- Git
- Android Studio + an Android device/emulator if testing Android native payments
- A Stripe account/test keys for the payment flow

## First setup

From the repository root:

```text
npm run install:all
```

Create `backend/.env` from `backend/.env.example` and set:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Create `mobile/.env` from `mobile/.env.example`.

For a physical phone, replace the example API host with the computer's LAN IPv4 address, for example `http://192.168.1.100:4000/api/v1`. The backend listens on `0.0.0.0` so devices on the same network can reach it. Android emulators can use the built-in `10.0.2.2` default.

## Database

From the `backend` directory:

```text
npm run migrate
```

The migration is idempotent and creates the initial schema.

## Run the project

The easiest option is from the repository root:

```text
npm run dev
```

This starts the backend and Expo development server together.

You can also run them separately:

```text
npm run backend
npm run mobile
```

The API health endpoint is:

```text
http://localhost:4000/api/v1/health
```

## Stripe development build

The mobile project uses `@stripe/stripe-react-native`, which contains native Android/iOS code. Use an Expo development/native build for the complete payment flow rather than relying on an Expo Go client that does not contain the Stripe native module.

For Android development, connect an Android device or start an emulator, then run from `mobile`:

```text
npx expo run:android
```

After the development build is installed, normal JavaScript development can use the Expo development server.

## Checks

Run both TypeScript checks from the root:

```text
npm run typecheck
```

The GitHub Actions workflow runs the same backend/mobile typechecks.

## Currency

The MVP uses **GBP** consistently. Monetary values are stored as integer minor units, so `£12.50` is stored as `1250`.

## Payment security

Stripe secret keys and webhook secrets belong only in `backend/.env` or deployment secrets. Never put a secret Stripe key in the mobile app or commit `.env` files.
