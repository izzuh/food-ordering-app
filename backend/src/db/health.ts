import { db } from './pool.js';

export async function checkDatabaseConnection(): Promise<void> {
  await db.query('SELECT 1');
}
