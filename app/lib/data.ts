'use server'

import { Pool } from 'pg';

const db = new Pool({
    user: process.env.DB_USER,
    host: "db",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

export async function fetchIntervenants(offset: number, limit: number) {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT * FROM "intervenants" OFFSET $1 LIMIT $2;', [offset, limit]);
    return result.rows;
  } catch (err) {
    console.error('Erreur lors de la récupération des intervenants avec pagination', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function countIntervenants() {
  const client = await db.connect();
  try {
    const result = await client.query('SELECT COUNT(*) FROM "intervenants";');
    return parseInt(result.rows[0].count, 10);
  } catch (err) {
    console.error('Erreur lors du comptage des intervenants', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteIntervenant(id){
  const client = await db.connect();
  try {
    await client.query('DELETE FROM "intervenants" WHERE id = $1;', [id]);
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'intervenant', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function createIntervenant(data) {
  const client = await db.connect();
  try {
    await client.query(
      'INSERT INTO "intervenants" (email, firstname, lastname, key, creationdate, enddate) VALUES ($1, $2, $3, $4, $5, $6);',
      [data.email, data.firstname, data.lastname, data.key, data.creationdate, data.enddate]
    );
  } catch (err) {
    console.error('Erreur lors de la création de l\'intervenant', err);
    throw err;
  } finally {
    client.release();
  }
}