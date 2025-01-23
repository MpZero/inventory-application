const db = require("../db/queries");
const { regExpFunction } = require("./regExp");
async function getAllGenres(req, res) {
  try {
    const genres = await db.getGenres();
    // console.log("Genres: ", genres);
    let newString = "";
    genres.map((genre) => {
      const word = genre.genres;
      // const newString = genre.slice(0, 1);
      newString = word.slice(0, 1).toUpperCase() + word.slice(1);
      return newString;
    });

    res.render("genres", { title: "Genres", genres, regExpFunction });
  } catch (error) {
    console.error("Error fetching genres: ", error);
    res.status(500).send("Error fetching genres");
  }
}

module.exports = { getAllGenres };
