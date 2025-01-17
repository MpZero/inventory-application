const db = require("../db/queries");
const { regExpFunction } = require("./regExp");
async function getAllAlbums(req, res) {
  try {
    const albums = await db.getAlbums();
    const dates = await db.getDate();
    const artists = await db.getArtists();
    const all = await db.getAll(req.query.sort, req.query.direction);
    console.log(req.query.sort);

    const data = { albums, dates, artists };
    const rows = data.albums.map((_, index) => ({
      album: data.albums[index].albums,
      date: data.dates[index].date,
      artist: data.artists[index].artists,
    }));

    // console.log("Albums: ", albums);
    // console.log("Date: ", date);
    res.render("albums", {
      title: "Albums",
      albums,
      all,
      rows,
      regExpFunction,
    });
  } catch (error) {
    console.error("Error fetching albums: ", error);
    res.status(500).send("Error fetching albums");
  }
}

module.exports = { getAllAlbums };
