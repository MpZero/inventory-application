const db = require("../db/queries");
const { regExpFunction } = require("./regExp");
async function getAllArtists(req, res) {
  try {
    const artists = await db.getArtists();
    console.log("Controller Artists: ", artists);
    res.render("artists", { title: "Artists", artists, regExpFunction });
  } catch (error) {
    console.error("Error fetching artists: ", error);
    res.status(500).send("Error fetching artists");
  }
}

async function getArtist(req, res) {
  const reqArtistId = req.params.id;

  try {
    const artistData = await db.getArtist(reqArtistId);
    console.log("Query result:", artistData);

    const hasAlbums = Array.isArray(artistData) && artistData.length > 0;
    const artistName = hasAlbums ? artistData[0].name : artistData.artistName;
    const artistId = hasAlbums ? artistData[0].id : artistData.artistId;

    res.render("artistsid", {
      title: artistName,
      artist: artistData,
      name: artistName,
      hasAlbums,
      artistId,
      regExpFunction,
    });
  } catch (error) {
    console.error("Error fetching artist:", error);
    res.status(500).send("Error fetching artist");
  }
}

async function createArtistGet(req, res) {
  res.render("artistspost");
}
async function createArtistPost(req, res) {
  console.log(req.body);
  const artist = req.body.artist;

  try {
    if (!artist) {
      return res.status(400).send("Artist name is required");
    }
    await db.insertArtist(artist);
    res.redirect("/artists");
  } catch (error) {
    console.log("Error creating artist", error);
    res.status(500).send("Error creating artist");
  }
}

module.exports = {
  getAllArtists,
  getArtist,
  createArtistGet,
  createArtistPost,
};
