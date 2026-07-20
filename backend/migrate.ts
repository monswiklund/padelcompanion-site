import './src/loadEnv.ts';
import pg from 'pg';

const { Client } = pg;

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	host: process.env.PGHOST,
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	database: process.env.PGDATABASE,
	port: parseInt(process.env.PGPORT || '5432', 10)
});

async function migrate() {
	try {
		await client.connect();
		console.log('Connected to database for migration.');

		await client.query(`
      CREATE TABLE IF NOT EXISTS tournament_sessions (
        id TEXT PRIMARY KEY,
        share_code TEXT UNIQUE NOT NULL,
        edit_token TEXT NOT NULL,
        snapshot JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        last_ip TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_share_code ON tournament_sessions(share_code);
    `);

		console.log('Migration completed successfully.');
	} catch (err) {
		console.error('Migration failed:', err);
		throw err;
	} finally {
		await client.end();
	}
}

await migrate();
