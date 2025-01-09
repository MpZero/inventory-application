const db = require("../db/queries");
const { regExpFunction } = require("./regExp");
async function getAllAlbums(req, res) {
  try {
    const albums = await db.getAlbums();
    const date = await db.getAlbums();
    // console.log("Albums: ", albums);
    // console.log("Date: ", date);
    res.render("albums", { title: "Albums", albums, date, regExpFunction });
  } catch (error) {
    console.error("Error fetching albums: ", error);
    res.status(500).send("Error fetching albums");
  }
}

module.exports = { getAllAlbums };
