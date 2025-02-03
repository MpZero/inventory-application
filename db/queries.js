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
////////////////////////////////////////////
//////////////* ALBUMS *////////////////////
////////////////////////////////////////////

async function getAlbums() {
  try {
    const { rows } = await pool.query("SELECT albums FROM music");
    return rows;
  } catch (error) {
    console.error("Error getting all albums:", error);
    throw new Error("Failed to retrieve all albums");
  }
}

async function getAlbum(album) {
  // console.log(`Querying for album: ${album}`);
  try {
    const query = `
      SELECT id, artists, albums, genres, date 
      FROM music 
      WHERE LOWER(REPLACE(albums, ' ', '')) = $1;
    `;
    const { rows } = await pool.query(query, [album]);
    // console.log(`Query result:`, rows);
    return rows;
  } catch (error) {
    console.error("Error getting album:", error);
    throw new Error("Failed to retrieve album");
  }
}

async function insertAlbum(artist, album, genre, trueDate) {
  await pool.query(
    "INSERT INTO music(artists, albums, genres, date) VALUES ($1, $2, $3, $4)",
    [artist, album, genre, trueDate]
  );
}

async function updateAlbum(artist, album, genre, date, id) {
  const result = await pool.query(
    `UPDATE music
     SET artists = $1, albums = $2, genres = $3, date = $4
     WHERE id = $5`,
    [artist, album, genre, date, id]
  );

  return result;
}

async function deleteAlbum(id) {
  try {
    await pool.query("DELETE FROM music WHERE id = $1", [id]);
  } catch (error) {
    console.error("Error getting genre:", error);
    throw new Error("Failed to retrieve genre");
  }
}
////////////////////////////////////////////
////////////////* ARTISTS */////////////////
////////////////////////////////////////////

async function getArtists() {
  try {
    const { rows } = await pool.query("SELECT  DISTINCT artists FROM music");
    return rows;
  } catch (error) {
    console.error("Error getting all artists:", error);
    throw new Error("Failed to retrieve all artists");
  }
}

async function getArtist(artist) {
  console.log(`Querying for artist: ${artist}`);
  try {
    const query = `
      SELECT id, artists, albums,  date 
      FROM music 
      WHERE LOWER(REPLACE(artists, ' ', '')) = $1 
      AND date IS NOT NULL
      ORDER BY date ASC;
    `;
    const { rows } = await pool.query(query, [artist]);

    console.log(`Query result:`, rows);
    return rows;
  } catch (error) {
    console.error("Error getting artist:", error);
    throw new Error("Failed to retrieve artist");
  }
}
async function insertArtist(artist) {
  const { row } = await pool.query(
    `INSERT INTO music(artists, albums, genres, date) VALUES ($1, NULL, NULL, NULL)`,
    [artist]
  );
  return row;
}

////////////////////////////////////////////
////////////////* GENRES *//////////////////
////////////////////////////////////////////

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

async function getGenre(genre) {
  // console.log(`Querying for genre: ${genre}`);
  try {
    const query = `
      SELECT id, artists, albums, genres,  date 
      FROM music 
      WHERE LOWER(REPLACE(genres, ' ', '')) = $1 ORDER BY albums ASC;
    `;
    const { rows } = await pool.query(query, [genre]);
    // console.log(`Query result:`, rows);
    return rows;
  } catch (error) {
    console.error("Error getting genre:", error);
    throw new Error("Failed to retrieve genre");
  }
}

module.exports = {
  getAll,
  getAlbums,
  getAlbum,
  insertAlbum,
  updateAlbum,
  deleteAlbum,
  getArtists,
  getArtist,
  insertArtist,
  getGenres,
  getGenre,
  getDate,
};
