const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "BhaPosYan43.21P,",
  database: "db_contacts",
  host: "localhost",
  port: 5432,
});

module.exports = pool;
