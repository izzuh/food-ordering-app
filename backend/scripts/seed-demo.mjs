import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const ownerId = '00000000-0000-0000-0000-000000000001';
const restaurantId = '00000000-0000-0000-0000-000000000010';
const categoryId = '00000000-0000-0000-0000-000000000020';
const itemIds = [
  '00000000-0000-0000-0000-000000000030',
  '00000000-0000-0000-0000-000000000031',
  '00000000-0000-0000-0000-000000000032',
];

const demoPasswordHash = 'scrypt:50b29d9dab04a7aada81440d051ac216:615babe734cd3f7fe841f269cabf661fed23fb10e42eb2230aa5e899180449df8dafdebdc34c710ada78ddac2ddb5c594619fecc539996258d090bc6ef006c26';

try {
  await pool.query(
    `INSERT INTO users (id, name, email, phone, password_hash, role)
     VALUES ($1, 'Demo Restaurant Owner', 'demo-owner@example.com', '+440000000000', $2, 'restaurant_owner')
     ON CONFLICT (id) DO NOTHING`,
    [ownerId, demoPasswordHash],
  );

  await pool.query(
    `INSERT INTO restaurants (id, owner_id, name, description, address, phone, is_open)
     VALUES ($1, $2, 'Demo Kitchen', 'Demo restaurant for local development', '1 Demo Street, Manchester, M1 1AA', '+440000000000', TRUE)
     ON CONFLICT (id) DO UPDATE SET owner_id = EXCLUDED.owner_id, name = EXCLUDED.name,
       description = EXCLUDED.description, address = EXCLUDED.address, phone = EXCLUDED.phone, is_open = TRUE`,
    [restaurantId, ownerId],
  );

  await pool.query(
    `INSERT INTO menu_categories (id, restaurant_id, name, sort_order)
     VALUES ($1, $2, 'Popular', 1)
     ON CONFLICT (id) DO UPDATE SET restaurant_id = EXCLUDED.restaurant_id, name = EXCLUDED.name, sort_order = EXCLUDED.sort_order`,
    [categoryId, restaurantId],
  );

  const items = [
    [itemIds[0], 'Classic Burger', 'Beef burger with lettuce, tomato and house sauce', 899],
    [itemIds[1], 'Chicken Wrap', 'Grilled chicken, salad and garlic sauce in a toasted wrap', 749],
    [itemIds[2], 'Chips', 'Crispy seasoned chips', 299],
  ];

  for (const [id, name, description, price] of items) {
    await pool.query(
      `INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price_minor, is_available)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       ON CONFLICT (id) DO UPDATE SET restaurant_id = EXCLUDED.restaurant_id, category_id = EXCLUDED.category_id,
         name = EXCLUDED.name, description = EXCLUDED.description, price_minor = EXCLUDED.price_minor, is_available = TRUE`,
      [id, restaurantId, categoryId, name, description, price],
    );
  }

  console.log('Demo data is ready. Demo restaurant owner: demo-owner@example.com / Demo12345!');
} finally {
  await pool.end();
}
