require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function main() {
  const res = await pool.query('SELECT slug, "heroImage" FROM "Tour" WHERE "regions" @> ARRAY[\'Nepal Classic Tour\']::text[]');
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}
main().catch(console.error);
