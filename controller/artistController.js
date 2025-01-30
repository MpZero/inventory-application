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

async function getArtist(req, res) {
  // console.log("Route parameters:", req.params);

  const artist = req.params.artist;
  // console.log("artist from route:", artist);

  try {
    const artistData = await db.getArtist(artist);
    // console.log("Query result:", artistData);

    if (artistData.length === 0) {
      return res.status(404).send("artist not found");
    }

    // console.log(`artis data bro`, artistData);

    res.render("artistsid", {
      title: artistData[0].artists,
      artist: artistData,
      name: artistData[0].artists,
      regExpFunction,
    });
  } catch (error) {
    console.error("Error fetching artist:", error);
    res.status(500).send("Error fetching artist");
  }
}

module.exports = { getAllArtists, getArtist };
