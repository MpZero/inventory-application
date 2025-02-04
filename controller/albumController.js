const db = require("../db/queries");
const { regExpFunction } = require("./regExp");
async function getAllAlbums(req, res) {
  try {
    const albums = await db.getAllAlbums(req.query.sort, req.query.direction);
    // console.log(`controller`, albums);

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
  // console.log("Route parameters:", req.params);

  const album = req.params;
  // console.log("Album from route:", album);

  try {
    const albumData = await db.getAlbum(album.album);
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

function createAlbumGet(req, res) {
  res.render("albumpost", { title: "Create Album" });
}
async function createAlbumPost(req, res) {
  console.log(res.body);
  const { artist, album, genre, date } = req.body;

  try {
    // const artist = res.body.artist;
    // const album = res.body.name;
    // const genre = res.body.genre;
    // const date = res.body.date;
    // const data = { artists: artist, albums: album, genre: genre, date: date };
    // const data = { artist, album, genre, date };
    // console.log("Data:", data);

    if (!album) {
      return res.status(400).send("Album name is required");
    } else if (!artist) {
      return res.status(400).send("Artist name is required");
    }

    // await db.insertAlbum(data);
    await db.insertAlbum(artist, album, genre, date);
    res.redirect("/albums");
  } catch (error) {
    console.log("Error creating album", error);
    res.status(500).send("Error creating album");
  }
}

async function getAlbumUpdate(req, res) {
  // console.log(`controller getalbumupdate req params`, req.params);

  const album = await db.getAlbum(req.params.album);
  // console.log(`get album update: album`, album);

  res.render("updateAlbum", {
    title: "Update Album",
    album: album,
    regExpFunction,
  });
}

async function postAlbumUpdate(req, res) {
  try {
    const { albums, artist, genre, date } = req.body;
    const albumId = req.params.album;

    await db.updateAlbum(artist, albums, genre, date, albumId);

    res.redirect("/");
  } catch (error) {
    console.error("Error updating album:", error);
    res.status(500).send("Failed to update album");
  }
}

async function deleteAlbum(req, res) {
  try {
    const albumId = req.params.album;
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
