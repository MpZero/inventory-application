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
  const genre = req.params.id;

  try {
    const genreData = await db.getGenre(genre);
    console.log("Query result on controller:", genreData);

    const hasAlbums = Array.isArray(genreData) && genreData.length > 0;
    const genreName = hasAlbums ? genreData[0].name : genreData.genreName;

    const genreId = hasAlbums ? genreData[0].genres_id : genreData.genreId;

    res.render("genresid", {
      hasAlbums,
      title: genreName,
      genre: genreData,
      name: genreName,
      id: genreId,
      regExpFunction,
    });
  } catch (error) {
    console.error("Error fetching genre:", error);
    res.status(500).send("Error fetching genre");
  }
}

module.exports = { getAllGenres, getGenre };
