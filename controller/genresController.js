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

async function getGenre(req, res) {
  console.log("Route parameters:", req.params);

  const genre = req.params.id;
  console.log("genre from route:", genre);

  try {
    const genreData = await db.getGenre(genre);
    console.log("Query result:", genreData);

    if (genreData.length === 0) {
      return res.status(404).send("genre not found");
    }

    console.log(`genres data bro`, genreData);

    res.render("genresid", {
      title: genreData[0].genre,
      genre: genreData,
      name: genreData[0].genre,
      regExpFunction,
    });
  } catch (error) {
    console.error("Error fetching genre:", error);
    res.status(500).send("Error fetching genre");
  }
}

module.exports = { getAllGenres, getGenre };
