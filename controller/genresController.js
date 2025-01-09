const db = require("../db/queries");
const { regExpFunction } = require("./regExp");
async function getAllGenres(req, res) {
  try {
    const genres = await db.getGenres();
    // console.log("Genres: ", genres);
    res.render("genres", { title: "Genres", genres, regExpFunction });
  } catch (error) {
    console.error("Error fetching genres: ", error);
    res.status(500).send("Error fetching genres");
  }
}

module.exports = { getAllGenres };
