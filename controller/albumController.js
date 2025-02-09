const db = require("../db/queries");
const { getArtist } = require("./artistController");
const { regExpFunction } = require("./regExp");

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
  // console.log("AlbumId from controller:", albumId);
  try {
    const albumData = await db.getAlbum(albumId);
    // console.log("controller result:", albumData);
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
  if (!req.query) {
    res.render("albumpost", { title: "Create Album" });
  } else {
    const data = await db.getArtist(id);
    res.render("albumpost", {
      title: "Create Album",
      artistName: data.artistName,
    });
  }
}

async function createAlbumPost(req, res) {
  const { artist, album, genre, date } = req.body;

  try {
    if (!album) {
      return res.status(400).send("Album name is required");
    } else if (!artist) {
      return res.status(400).send("Artist name is required");
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

async function postAlbumUpdate(req, res) {
  try {
    console.log(`postAlbumUpdate req.body: `, req.body);

    const { id, albums, artist, genre, date } = req.body;

    console.log(
      `Updating album with ID: ${id}, Title: ${albums}, Artist: ${artist}, Genre: ${genre}, Date: ${date}`
    );

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
    console.log(`albumid from deleteAlbum controller`);

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
  createAlbumGet,
  createAlbumPost,
  getAlbumUpdate,
  postAlbumUpdate,
  deleteAlbum,
};
