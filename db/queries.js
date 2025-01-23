const pool = require("./pool");

async function getAll(sort, direction) {
  try {
    if (!sort && !direction) {
      const { rows } = await pool.query(`SELECT * FROM music`);
      return rows;
    } else if (sort && !direction) {
      const { rows } = await pool.query(`SELECT * FROM music ORDER BY ${sort}`);
      return rows;
    } else {
      const { rows } = await pool.query(
        `SELECT * FROM music ORDER BY ${sort} ${direction}`
      );
      return rows;
    }
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

async function getAlbum(id) {
  try {
    const { rows } = await pool.query(
      `SELECT artists, albums, genres, date FROM music WHERE id = ${id}`
    );
    console.log(`query: `, rows);

    return rows;
  } catch (error) {
    console.error("Error getting album:", error);
    throw new Error("Failed to retrieve album");
  }
}

async function getArtists() {
  try {
    const { rows } = await pool.query("SELECT  DISTINCT artists FROM music");
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

async function insertAlbum(artist, album, genre, trueDate) {
  await pool.query(
    "INSERT INTO music(artists, albums, genres, date) VALUES ($1, $2, $3, $4)",
    [artist, album, genre, trueDate]
  );
}

module.exports = {
  getAll,
  getAlbums,
  getAlbum,
  getArtists,
  getGenres,
  getDate,
  insertAlbum,
};
