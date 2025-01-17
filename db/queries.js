const pool = require("./pool");

async function getAll(sort, direction) {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM music ORDER BY ${sort} ${direction}`
    );
    return rows;
  } catch (error) {
    console.error("Error getting all:", error);
    throw new Error("Failed to retrieve all");
  }
}

async function getDate() {
  try {
    const { rows } = await pool.query("SELECT date FROM music");
    return rows;
  } catch (error) {
    console.error("Error getting all dates:", error);
    throw new Error("Failed to retrieve all dates");
  }
}

async function getAlbums() {
  try {
    const { rows } = await pool.query("SELECT albums FROM music");
    return rows;
  } catch (error) {
    console.error("Error getting all albums:", error);
    throw new Error("Failed to retrieve all albums");
  }
}

async function getArtists() {
  try {
    const { rows } = await pool.query("SELECT artists FROM music");
    return rows;
  } catch (error) {
    console.error("Error getting all artists:", error);
    throw new Error("Failed to retrieve all artists");
  }
}

async function getGenres() {
  try {
    const { rows } = await pool.query(
      "SELECT DISTINCT genres FROM music ORDER BY genres ASC"
    );
    return rows;
  } catch (error) {
    console.error("Error getting all genres:", error);
    throw new Error("Failed to retrieve all genres");
  }
}

module.exports = { getAll, getAlbums, getArtists, getGenres, getDate };
