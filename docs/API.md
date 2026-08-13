# API quick reference

Base URL: `/api/v1`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

## Customer
- `GET /restaurants`
- `GET /restaurants/:id/menu`
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:menuItemId`
- `DELETE /cart/items/:menuItemId`
- `GET /addresses`
- `POST /addresses`
- `POST /orders/checkout`
- `GET /orders`
- `GET /orders/:id`
- `POST /payments/initialize`
- `GET /payments/verify/:paymentIntentId`
- `GET /delivery/order/:orderId`

## Restaurant owner/admin
- `GET /restaurant-orders`
- `GET /restaurant-orders/:id`
- `PATCH /restaurant-orders/:id/status`

Valid restaurant transitions:
- `confirmed -> accepted`
- `accepted -> preparing`
- `preparing -> ready_for_delivery`
- `confirmed -> cancelled`
- `accepted -> cancelled`

## Rider/admin
- `GET /delivery/available`
- `GET /delivery/mine`
- `POST /delivery/:id/claim`
- `PATCH /delivery/:id/status`
- `PATCH /delivery/:id/location`

## Stripe
- `POST /payments/webhook`

The webhook does not use normal JSON parsing. Stripe's raw body is validated with `STRIPE_WEBHOOK_SECRET` before payment state is changed.
