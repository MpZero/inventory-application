const db = require("../db/queries");
const { getArtist } = require("./artistController");
const { regExpFunction } = require("./regExp");
const { body, validationResult } = require("express-validator");

const validateAndSanitizeAlbumUpdate = [
  body("albums")
    .notEmpty()
    .withMessage("Album title is required")
    .trim()
    .escape(),
  body("artist")
    .notEmpty()
    .withMessage("Artist name is required")
    .trim()
    .escape(),
  body("genre")
    .isString()
    .withMessage("Genre must be a string")
    .trim()
    .escape(),
  body("date").isISO8601().withMessage("Invalid date format").toDate(),
];

const validateAndSanitizeAlbumPost = [
  body("album")
    .notEmpty()
    .withMessage("Album title is required")
    .trim()
    .escape(),
  body("artist")
    .notEmpty()
    .withMessage("Artist name is required")
    .trim()
    .escape(),
  body("genre")
    .isString()
    .withMessage("Genre must be a string")
    .trim()
    .escape(),
  body("date").isISO8601().withMessage("Invalid date format").toDate(),
];

async function getAllAlbums(req, res) {
  try {
    const albums = await db.getAllAlbums(req.query.sort, req.query.direction);
    res.render("albums", {
      title: "Albums",
      albums,
      regExpFunction,
    });
  } catch (error) {
    console.error("Error fetching albums: ", error);
    res.status(500).send("Error fetching albums");
  }
}

async function getAlbum(req, res) {
  const albumId = req.params.id;
  try {
    const albumData = await db.getAlbum(albumId);
    if (albumData.length === 0) {
      return res.status(404).send("Album not found");
    }
    res.render("albumid", {
      title: albumData[0].title,
      album: albumData,
      regExpFunction,
    });
  } catch (error) {
    console.error("Error fetching album:", error);
    res.status(500).send("Error fetching album");
  }
}

async function createAlbumGet(req, res) {
  const id = req.query.artistId;
  const genreId = req.query.genreId;

  if (id) {
    const data = await db.getArtist(id);

    res.render("albumpost", {
      title: "Create Album",
      artistName: data.artistName || data[0].name,
      genreName: null,
    });
  } else if (genreId) {
    const data = await db.getGenre(genreId);

    res.render("albumpost", {
      title: "Create Album",
      genreName: data.genreName,
      artistName: null,
    });
  } else {
    res.render("albumpost", {
      title: "Create Album",
      artistName: null,
      genreName: null,
    });
  }
}

async function createAlbumPost(req, res) {
  const { artist, album, genre, date } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await db.insertAlbum(artist, album, genre, date);
    res.redirect("/albums");
  } catch (error) {
    console.log("Error creating album", error);
    res.status(500).send("Error creating album");
  }
}

async function getAlbumUpdate(req, res) {
  const album = await db.getAlbum(req.params.id);
  // console.log(`get album update: album`, album);

  res.render("albumUpdate", {
    title: "Update Album",
    album: album,
    regExpFunction,
  });
}

async function getLatestAlbums(req, res) {
  const albums = await db.getLatestAlbums();
  const randomAlbums = await db.getRandomAlbums();

  res.render("index", {
    title: "GG Music Database",
    albums: albums,
    randomAlbums: randomAlbums,
  });
}

async function postAlbumUpdate(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // console.log(`postAlbumUpdate req.body: `, req.body);

    const { id, albums, artist, genre, date } = req.body;

    // console.log(
    //   `Updating album with ID: ${id}, Title: ${albums}, Artist: ${artist}, Genre: ${genre}, Date: ${date}`
    // );

    await db.updateAlbum(artist, albums, genre, date, id);

    res.redirect(`/albums/${id}`);
  } catch (error) {
    console.error("Error updating album:", error);
    res.status(500).send("Failed to update album");
  }
}

async function deleteAlbum(req, res) {
  try {
    const albumId = req.params.id;
    await db.deleteAlbum(albumId);
    res.redirect("/albums");
  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).send("Failed to delete album");
  }
}

module.exports = {
  getAllAlbums,
  getAlbum,
  getLatestAlbums,
  createAlbumGet,
  createAlbumPost,
  getAlbumUpdate,
  validateAndSanitizeAlbumUpdate,
  validateAndSanitizeAlbumPost,
  postAlbumUpdate,
  deleteAlbum,
};
