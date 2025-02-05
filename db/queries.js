const pool = require("./pool");

async function getAllAlbums(sort, direction) {
  const query = `
        SELECT  albums.id AS id, albums.title AS title, artists.name AS artist, genres.name AS genre, albums.release_date AS date
        FROM albums
        JOIN artists ON albums.artist_id = artists.id
        JOIN genres ON albums.id = genres.id
`;
  try {
    if (!sort && !direction) {
      const { rows } = await pool.query(query);
      // console.log(`query rows`, rows);

      return rows;
    } else if (sort && !direction) {
      const { rows } = await pool.query(`${query} ORDER BY ${sort};`);
      return rows;
    } else {
      const { rows } = await pool.query(
        `${query} ORDER BY ${sort} ${direction};`
      );
      return rows;
    }
  } catch (error) {
    console.error("Error getting all:", error);
    throw new Error("Failed to retrieve all");
  }
}

// async function getDate() {
//   try {
//     const { rows } = await pool.query("SELECT date FROM music");
//     return rows;
//   } catch (error) {
//     console.error("Error getting all dates:", error);
//     throw new Error("Failed to retrieve all dates");
//   }
// }
////////////////////////////////////////////
//////////////* ALBUMS *////////////////////
////////////////////////////////////////////

// async function getAlbums() {
//   try {
//     const { rows } = await pool.query("SELECT albums FROM music");
//     return rows;
//   } catch (error) {
//     console.error("Error getting all albums:", error);
//     throw new Error("Failed to retrieve all albums");
//   }
// }

async function getAlbum(id) {
  console.log(`Querying for album: ${id}`);

  try {
    const query = `
      SELECT 
        albums.id AS id, 
        albums.title AS title, 
        artists.name AS artist, 
        genres.name AS genre, 
        albums.release_date AS date 
      FROM albums 
      JOIN artists ON albums.artist_id = artists.id
      JOIN genres ON albums.genre_id = genres.id  
      WHERE albums.id = $1;
    `;

    const { rows } = await pool.query(query, [id]);
    console.log(`Query result:`, rows);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error("Error getting album:", error);
    throw new Error("Failed to retrieve album");
  }
}

async function insertAlbum(artist, album, genre, trueDate) {
  await pool.query(
    "INSERT INTO albums(artists, albums, genres, date) VALUES ($1, $2, $3, $4)",
    [artist, album, genre, trueDate]
  );
}

async function updateAlbum(artist, album, genre, date, id) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const artistResult = await client.query(
      `INSERT INTO artists (name) 
       VALUES ($1) 
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name 
       RETURNING id;`,
      [artist]
    );
    const artistId = artistResult.rows[0].id;

    const genreResult = await client.query(
      `INSERT INTO genres (name) 
       VALUES ($1) 
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name 
       RETURNING id;`,
      [genre]
    );
    const genreId = genreResult.rows[0].id;

    const result = await client.query(
      `UPDATE albums
       SET 
           artist_id = $1, 
           title = $2, 
           genre_id = $3, 
           release_date = $4
       WHERE id = $5;`,
      [artistId, album, genreId, date, id]
    );

    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating album:", error);
    throw error;
  } finally {
    client.release();
  }
}

async function deleteAlbum(id) {
  try {
    await pool.query("DELETE FROM albums WHERE id = $1", [id]);
  } catch (error) {
    console.error("Error deleting album:", error);
    throw new Error("Failed to delete album");
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
  getAllAlbums,
  getAlbum,
  insertAlbum,
  updateAlbum,
  deleteAlbum,
  getArtists,
  getArtist,
  insertArtist,
  getGenres,
  getGenre,
  // getDate,
};
