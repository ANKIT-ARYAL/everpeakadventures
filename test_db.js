require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function main() {
  const res = await pool.query('SELECT slug, "heroImage" FROM "Tour" WHERE slug=\'bhaktapur-day-tour\'');
  console.log(res.rows[0].heroImage);
  await pool.end();
}
main().catch(console.error);
