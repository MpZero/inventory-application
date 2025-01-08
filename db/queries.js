const pool = require("./pool");

async function getAlbums() {
  try {
    const { rows } = await pool.query("SELECT albums FROM music");
    return rows;
  } catch (error) {
    console.error("Error getting all albums:", error);
    throw new Error("Failed to retrieve all albums");
  }
}

module.exports = { getAlbums };
