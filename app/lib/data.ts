'use server'

import { Pool } from 'pg';

const db = new Pool({
    user: process.env.DB_USER,
    host: "db",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

export async function fetchIntervenants() { 
    const client = await db.connect();
  try {
    const result = await client.query('SELECT * FROM "Intervenant";');
    return result.rows;
  } catch (err) {
    console.error('Erreur lors de la récupération des intervenants', err);
    throw err;
  } finally {
    client.release();
  }
}
