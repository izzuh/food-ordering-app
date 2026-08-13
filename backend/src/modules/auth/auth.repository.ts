import { db } from '../../db/pool.js';
import type { AuthUser } from './auth.types.js';

interface UserRow extends AuthUser {
  password_hash: string;
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const result = await db.query<UserRow>(
    `SELECT id, name, email, phone, role, password_hash
     FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
    [email],
  );
  return result.rows[0] ?? null;
}

export async function findUserById(id: string): Promise<AuthUser | null> {
  const result = await db.query<AuthUser>(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1 AND is_active = TRUE LIMIT 1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
}): Promise<AuthUser> {
  const result = await db.query<AuthUser>(
    `INSERT INTO users (name, email, phone, password_hash)
     VALUES ($1, LOWER($2), $3, $4)
     RETURNING id, name, email, phone, role`,
    [input.name, input.email, input.phone ?? null, input.passwordHash],
  );
  return result.rows[0];
}
