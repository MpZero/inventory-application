const db = require("../db/queries");
// const { regExpFunction } = require("./regExp");
async function getAllAlbums(req, res) {
  try {
    // const albums = await db.getAlbums();
    // const dates = await db.getDate();
    // const artists = await db.getArtists();
    const all = await db.getAll(req.query.sort, req.query.direction);
    // console.log(req.query.sort);
    // console.log("All: ", all);

    // const data = { albums, dates, artists };
    // const rows = data.albums.map((_, index) => ({
    //   album: data.albums[index].albums,
    //   date: data.dates[index].date,
    //   artist: data.artists[index].artists,
    // }));

    // console.log("Albums: ", albums);
    res.render("albums", {
      title: "Albums",
      // albums,
      all,
      // rows,
      // regExpFunction,
    });
  } catch (error) {
    console.error("Error fetching albums: ", error);
    res.status(500).send("Error fetching albums");
  }
}

async function getAlbum(req, res) {
  const album = await db.getAlbum(req.params.id);
  console.log("controller", album);

  res.render("albumid", {
    title: "Album",
    album: album,
  });
}
function createAlbumGet(req, res) {
  res.render("albumpost", { title: "Create Album" });
}
async function createAlbumPost(req, res) {
  console.log(res.body);
  const { artist, album, genre, date } = req.body;

  try {
    // const artist = res.body.artist;
    // const album = res.body.name;
    // const genre = res.body.genre;
    // const date = res.body.date;
    // const data = { artists: artist, albums: album, genre: genre, date: date };
    // const data = { artist, album, genre, date };
    // console.log("Data:", data);

    if (!album) {
      return res.status(400).send("Album name is required");
    } else if (!artist) {
      return res.status(400).send("Artist name is required");
    }

    // await db.insertAlbum(data);
    await db.insertAlbum(artist, album, genre, date);
    res.redirect("/albums");
  } catch (error) {
    console.log("Error creating album", error);
    res.status(500).send("Error creating album");
  }
}

module.exports = { getAllAlbums, getAlbum, createAlbumGet, createAlbumPost };
