const pool = require("./pool");

////////////////////////////////////////////
//////////////* ALBUMS *////////////////////
////////////////////////////////////////////

async function getAllAlbums(sort, direction) {
  const query = `
        SELECT albums.id AS id, albums.title AS title, artists.name AS artist, artists.id AS artist_id, genres.name AS genre, albums.release_date AS date
        FROM albums
        JOIN artists ON albums.artist_id = artists.id
        JOIN genres ON albums.genre_id = genres.id;

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

async function getAlbum(id) {
  // console.log(`Querying for album: ${id}`);

  try {
    const query = `
      SELECT 
        albums.id AS id, 
        albums.artist_id AS artist_id,
        albums.title AS title, 
        artists.name AS artist, 
        genres.name AS genre, 
        albums.release_date AS date,
        albums.genre_id AS genre_id
      FROM albums 
      JOIN artists ON albums.artist_id = artists.id
      JOIN genres ON albums.genre_id = genres.id  
      WHERE albums.id = $1;
    `;

    const { rows } = await pool.query(query, [id]);
    // console.log(`Query result:`, rows);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error("Error getting album:", error);
    throw new Error("Failed to retrieve album");
  }
}

async function insertAlbum(artist, album, genre, date) {
  try {
    // Insert artist if not exists
    const artistQuery = `
      INSERT INTO artists (name) 
      VALUES ($1) 
      ON CONFLICT (name) DO NOTHING 
      RETURNING id;
    `;
    let artistResult = await pool.query(artistQuery, [artist]);

    // If artist already exists, fetch the ID
    if (artistResult.rowCount === 0) {
      const existingArtist = await pool.query(
        "SELECT id FROM artists WHERE name = $1",
        [artist]
      );
      artistResult = existingArtist;
    }
    const artistId = artistResult.rows[0].id;

    // Insert genre if not exists
    const genreQuery = `
      INSERT INTO genres (name) 
      VALUES ($1) 
      ON CONFLICT (name) DO NOTHING 
      RETURNING id;
    `;
    let genreResult = await pool.query(genreQuery, [genre]);

    // If genre already exists, fetch the ID
    if (genreResult.rowCount === 0) {
      const existingGenre = await pool.query(
        "SELECT id FROM genres WHERE name = $1",
        [genre]
      );
      genreResult = existingGenre;
    }
    const genreId = genreResult.rows[0].id;

    // Insert album with artist_id and genre_id
    const albumQuery = `
      INSERT INTO albums (title, artist_id, genre_id, release_date) 
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const albumResult = await pool.query(albumQuery, [
      album,
      artistId,
      genreId,
      date,
    ]);

    return { albumId: albumResult.rows[0].id };
  } catch (error) {
    console.error("Error adding album:", error);
    throw new Error("Failed to retrieve all artists");
  }
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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const albumResult = await client.query(
      "SELECT genre_id FROM albums WHERE id = $1",
      [id]
    );

    if (albumResult.rows.length === 0) {
      throw new Error("Album not found");
    }

    const genreId = albumResult.rows[0].genre_id;

    const countResult = await client.query(
      "SELECT COUNT(*) FROM albums WHERE genre_id = $1",
      [genreId]
    );

    const albumCount = parseInt(countResult.rows[0].count, 10);

    await client.query("DELETE FROM albums WHERE id = $1", [id]);

    if (albumCount === 1) {
      await client.query("DELETE FROM genres WHERE id = $1", [genreId]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting album:", error);
    throw new Error("Failed to delete album");
  } finally {
    client.release();
  }
}

async function getLatestAlbums() {
  try {
    const { rows } = await pool.query(
      "SELECT albums.id AS id, albums.artist_id AS artist_id,albums.title AS title, artists.name AS artist, genres.name AS genre, albums.release_date AS date,albums.genre_id AS genre_id FROM albums JOIN artists ON albums.artist_id = artists.id JOIN genres ON albums.genre_id = genres.id ORDER BY date DESC LIMIT 6"
    );
    return rows;
  } catch (error) {
    console.error("Error getting latest albums:", error);
    throw new Error("Failed to get latest albums");
  }
}

async function getRandomAlbums() {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM albums
       JOIN artists
       ON artists.id = albums.artist_id
      ORDER BY RANDOM() LIMIT 4`
    );
    return rows;
  } catch (error) {
    console.error("Error getting random albums:", error);
    throw new Error("Failed to get random albums");
  }
}
////////////////////////////////////////////
////////////////* ARTISTS */////////////////
////////////////////////////////////////////

async function getArtists() {
  try {
    const { rows } = await pool.query("SELECT  DISTINCT name, id FROM artists");
    return rows;
  } catch (error) {
    console.error("Error getting all artists:", error);
    throw new Error("Failed to retrieve all artists");
  }
}

async function getArtist(id) {
  try {
    const query = `
     SELECT artists.id AS id, artists.name AS name, albums.title AS title, albums.id AS album_id, albums.release_date AS date 
     FROM artists
     JOIN albums ON albums.artist_id = artists.id 
     WHERE artists.id = $1
     ORDER BY date ASC;
    `;
    const { rows } = await pool.query(query, [id]);

    if (rows.length == 0) {
      const data = await pool.query(
        `SELECT artists.name AS name, artists.id AS id FROM artists
        WHERE artists.id = $1;`,
        [id]
      );
      const artistId = data.rows[0].id;
      const artistName = data.rows[0].name;

      return { rows, artistId, artistName };
    }

    return rows;
  } catch (error) {
    console.error("Error getting artist:", error);
    throw new Error("Failed to retrieve artist");
  }
}
async function insertArtist(artist) {
  const { row } = await pool.query(`INSERT INTO artists(name) VALUES ($1)`, [
    artist,
  ]);
  return row;
}

////////////////////////////////////////////
////////////////* GENRES *//////////////////
////////////////////////////////////////////

async function getGenres() {
  try {
    const { rows } = await pool.query("SELECT DISTINCT id, name FROM genres");
    return rows;
  } catch (error) {
    console.error("Error getting all genres:", error);
    throw new Error("Failed to retrieve all genres");
  }
}

async function getGenre(id) {
  try {
    const query = `
      SELECT genres.id AS genres_id, genres.name AS name, albums.id AS albums_id, albums.title AS title, albums.release_date AS date, artists.id AS artist_id, artists.name AS artist_name 
      FROM genres
      JOIN albums ON genres.id = albums.genre_id
      JOIN artists ON artists.id = albums.artist_id
      WHERE genres.id = $1 
    `;
    const { rows } = await pool.query(query, [id]);

    if (rows.length == 0) {
      const data = await pool.query(
        `SELECT genres.name AS name, genres.id AS id FROM genres
        WHERE genres.id = $1;`,
        [id]
      );
      const genreId = data.rows[0].id;
      const genreName = data.rows[0].name;

      return { rows, genreId, genreName };
    }
    return rows;
  } catch (error) {
    console.error("Error getting genre:", error);
    throw new Error("Failed to retrieve genre");
  }
}

module.exports = {
  getAllAlbums,
  getAlbum,
  getLatestAlbums,
  getRandomAlbums,
  insertAlbum,
  updateAlbum,
  deleteAlbum,
  getArtists,
  getArtist,
  insertArtist,
  getGenres,
  getGenre,
};
