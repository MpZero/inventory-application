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
    console.log("Query result on controller:", genreData);
    // console.log("Query result on controller:", genreData[0].name);

    // if (genreData.length === 0) {
    //   return res.status(404).send("genre not found");
    // }

    const hasAlbums = Array.isArray(genreData) && genreData.length > 0;
    const genreName = hasAlbums ? genreData[0].name : genreData.genreName;

    const genreId = hasAlbums ? genreData[0].genres_id : genreData.genreId;

    console.log("genrename:", genreName);
    console.log("genreId:", genreId);

    // const artistId = hasAlbums ? genreData[0].id : genreData.artistId;

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
