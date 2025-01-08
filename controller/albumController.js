const db = require("../db/queries");
async function getAllAlbums(req, res) {
  try {
    const albums = await db.getAlbums();
    // console.log("Albums: ", albums);
    res.render("albums", { title: "Albums", albums });
  } catch (error) {
    console.error("Error fetching albums: ", error);
    res.status(500).send("Error fetching albums");
  }
}

module.exports = { getAllAlbums };
