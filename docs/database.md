# PostgreSQL Database Design

## Design principles

- PostgreSQL is the system of record for users, restaurants, menus, carts, orders, and payments.
- IDs use UUIDs to avoid exposing sequential record counts.
- Monetary values are stored as integer minor units (`price_minor`, `total_minor`) rather than floating point numbers.
- Orders preserve item-name and price snapshots so historical orders do not change when menus change.
- Delivery details are copied into `orders.delivery_address_snapshot` so an old order remains accurate if a user edits an address later.
- Foreign keys and check constraints protect important business invariants.
- Payment status and order status are separate because payment and fulfillment are different state machines.

## Core relationships

```text
users
 ├── addresses
 ├── carts ── cart_items ── menu_items
 ├── orders ── order_items
 │            └── payments
 └── restaurants (as owner)

restaurants
 ├── menu_categories
 └── menu_items
```

## Order totals

The server calculates:

```text
subtotal = sum(order item unit price × quantity)
total = subtotal + delivery fee
```

The client must never be the source of truth for the final payable amount.

## Payment model

A payment record stores the payment provider and provider reference. Raw card details are never stored in this database.

Payment flow:

```text
Client requests checkout
        ↓
Server loads cart/menu prices
        ↓
Server calculates total
        ↓
Server creates pending order/payment
        ↓
Payment provider checkout
        ↓
Provider confirms transaction
        ↓
Server verifies provider transaction
        ↓
Payment marked paid
        ↓
Order confirmed
```

## Status rules

The application layer will enforce valid transitions. For example:

```text
pending_payment → confirmed
confirmed → accepted | cancelled
accepted → preparing | cancelled
preparing → ready_for_delivery
ready_for_delivery → out_for_delivery
out_for_delivery → delivered
```

A delivered or cancelled order is terminal.

## Migration strategy

The initial `backend/src/db/schema.sql` represents the baseline schema. Before production, this should be converted to versioned migrations so schema changes can be applied and rolled back in a controlled way.
