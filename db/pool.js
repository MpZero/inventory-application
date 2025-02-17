require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.LOCAL_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
