import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const sql = await readFile(resolve(process.cwd(), 'migrations/001_initial_schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Database migration applied.');
} finally { await pool.end(); }
