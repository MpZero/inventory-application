const db = require("../db/queries");
const { regExpFunction } = require("./regExp");
async function getAllGenres(req, res) {
  try {
    const genres = await db.getGenres();
    res.render("genres", {
      title: "Genres",
      genres: genres,
      regExpFunction,
    });
  } catch (error) {
    console.error("Error fetching genres: ", error);
    res.status(500).send("Error fetching genres");
  }
}

async function getGenre(req, res) {
  // console.log("Route parameters:", req.params);

  const genre = req.params.id;
  // console.log("genre from route:", genre);

  try {
    const genreData = await db.getGenre(genre);
    // console.log("Query result:", genreData);

    if (genreData.length === 0) {
      return res.status(404).send("genre not found");
    }

    res.render("genresid", {
      title: genreData[0].name,
      genre: genreData,
      name: genreData[0].name,
      regExpFunction,
    });
  } catch (error) {
    console.error("Error fetching genre:", error);
    res.status(500).send("Error fetching genre");
  }
}

module.exports = { getAllGenres, getGenre };
