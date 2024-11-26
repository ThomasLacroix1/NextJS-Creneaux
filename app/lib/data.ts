import { Pool } from 'pg';

let pool: Pool | null = null;

if (typeof window === 'undefined') {
    // Si le code est exécuté côté serveur, créez le pool de connexion
    pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432', 10),
    });
}

export async function fetchIntervenants() {
    if (!pool) {
        throw new Error('Database connection is only available on the server');
    }

    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM intervenants');
        return res.rows;
    } catch (err) {
        throw new Error('Failed to fetch intervenants');
    } finally {
        client.release();
    }
}
