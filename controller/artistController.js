const db = require("../db/queries");
const { regExpFunction } = require("./regExp");
async function getAllArtists(req, res) {
  try {
    const artists = await db.getArtists();
    // console.log("Artists: ", artists);
    res.render("artists", { title: "Artists", artists, regExpFunction });
  } catch (error) {
    console.error("Error fetching artists: ", error);
    res.status(500).send("Error fetching artists");
  }
}

module.exports = { getAllArtists };
