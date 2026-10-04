# API quick reference

Base URL: `/api/v1`

## Health
- `GET /health`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`

## Customer
- `GET /restaurants`
- `GET /restaurants/:id`
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

When an order becomes `ready_for_delivery`, a delivery record is created if one does not already exist.

## Rider/admin
- `GET /delivery/available`
- `GET /delivery/mine`
- `POST /delivery/:id/claim`
- `PATCH /delivery/:id/status`
- `PATCH /delivery/:id/location`

Valid rider transitions:
- `assigned -> accepted` through claim
- `accepted -> picked_up`
- `accepted -> cancelled`
- `picked_up -> delivered`

## Stripe
- `POST /payments/webhook`

The webhook is registered before normal JSON parsing. Stripe's raw request body is validated with `STRIPE_WEBHOOK_SECRET` before payment state is changed.
