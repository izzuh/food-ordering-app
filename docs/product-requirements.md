# Food Ordering App — Product Requirements

## Product goal

Enable customers to discover food, order from restaurants, pay securely, and follow the progress of their orders from one mobile application.

## User roles

### Customer
- Create an account and sign in
- Browse restaurants and menus
- Search for food
- Add and edit cart items
- Save delivery addresses
- Checkout and pay
- View order status and history
- Receive order notifications
- Review completed orders/restaurants

### Restaurant operator
- Manage restaurant profile
- Manage categories and menu items
- Receive and process orders
- Update preparation status
- Review order history and sales

### Delivery rider
- View assigned deliveries
- Accept/decline according to business rules
- Update delivery status
- View delivery destination

### Administrator
- Manage users, restaurants, riders, orders, and platform configuration
- Review payments and operational metrics

## MVP scope

The first release should focus on the customer ordering journey:

1. Authentication
2. Restaurant discovery
3. Restaurant menu
4. Food details
5. Cart
6. Delivery address
7. Checkout
8. Payment
9. Order confirmation
10. Order history
11. Basic order status

Restaurant management, rider workflows, advanced tracking, promotions, reviews, and analytics can follow after the MVP foundation is stable.

## Primary customer journey

```text
Open app
  ↓
Sign in / Register
  ↓
Browse restaurants
  ↓
Choose restaurant
  ↓
Choose food
  ↓
Add to cart
  ↓
Review cart
  ↓
Choose delivery address
  ↓
Review order total
  ↓
Pay
  ↓
Payment verified
  ↓
Order confirmed
  ↓
Track order status
```

## Key business rules

- A cart must contain items from a compatible restaurant context. Multi-restaurant carts are out of MVP scope unless explicitly designed later.
- Prices used for order calculation must come from trusted server-side data.
- The server calculates the final payable amount; the client only displays it.
- An order should not be marked paid solely because the mobile client reports success.
- Payment confirmation must be verified through the payment provider/server workflow.
- Once an order reaches a terminal status, later status transitions must be rejected.
- Order items should retain the price snapshot used at purchase time so historical orders remain accurate after menu prices change.

## MVP acceptance criteria

A customer can:

- Register and sign in
- Browse available restaurants
- Open a restaurant and see its menu
- Add food to a cart and change quantities
- Enter/select a delivery address
- See a server-calculated order total
- Complete a supported payment flow
- See a confirmed order after successful server-side payment verification
- View the order in order history
- See basic order status changes

## Out of scope for MVP

- Complex loyalty program
- Subscription plans
- Advanced recommendations
- Multi-city dispatch optimization
- Complex restaurant settlements
- Advanced analytics dashboards
- Multi-restaurant checkout

These should be treated as future product increments rather than blocking the first release.
