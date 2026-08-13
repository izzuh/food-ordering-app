import { Pool } from 'pg';
import { env } from '../config/env.js';
export const db = new Pool({ connectionString: env.DATABASE_URL, max: 10, idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000 });
