import { db } from '../../db/pool.js';

export async function listAddresses(userId: string) {
  const result = await db.query(
    `SELECT id, user_id, recipient_name, phone, address_line, city, postcode,
            country, latitude, longitude, is_default
     FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC`,
    [userId],
  );
  return result.rows;
}

export async function createAddress(userId: string, input: {
  recipientName: string; phone: string; addressLine: string; city: string;
  postcode: string; country?: string; latitude?: number; longitude?: number; isDefault?: boolean;
}) {
  const result = await db.query(
    `INSERT INTO addresses
      (user_id, recipient_name, phone, address_line, city, postcode, country,
       latitude, longitude, is_default)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING id, user_id, recipient_name, phone, address_line, city, postcode,
               country, latitude, longitude, is_default`,
    [userId, input.recipientName, input.phone, input.addressLine, input.city,
      input.postcode, input.country ?? 'GB', input.latitude ?? null,
      input.longitude ?? null, input.isDefault ?? false],
  );
  return result.rows[0];
}
