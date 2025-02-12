const { Router } = require("express");
const router = Router();
const {
  getAllAlbums,
  getAlbum,
  createAlbumPost,
  createAlbumGet,
  getAlbumUpdate,
  postAlbumUpdate,
  deleteAlbum,
  getLatestAlbums,
} = require("../controller/albumController");
const {
  getAllArtists,
  getArtist,
  createArtistGet,
  createArtistPost,
} = require("../controller/artistController");
const { getAllGenres, getGenre } = require("../controller/genresController");

//homepage
router.get("/", getLatestAlbums);

//about
router.get("/about", (req, res) =>
  res.render("about.ejs", { title: "About | GG Music Database" })
);

//contact
router.get("/contact", (req, res) => res.render("contact.ejs"));

//////////// albums ////////////
router.get("/albums", getAllAlbums);
router.get("/albums/new", createAlbumGet);
router.post("/albums/new", createAlbumPost);
router.get("/albums/:id", getAlbum);
router.get("/albums/:id/update", getAlbumUpdate);
router.post("/albums/:id/update", postAlbumUpdate);
router.post("/albums/:id/delete", deleteAlbum);
////////////////////////////////

//////////// artists ////////////
router.get("/artists", getAllArtists);
router.get("/artists/new", createArtistGet);
router.post("/artists/new", createArtistPost);
router.get("/artists/:id", getArtist);
/////////////////////////////////

//////////// genres ////////////
router.get("/genres", getAllGenres);

router.get("/genres/:id", getGenre);
// router.get("/genres/:id", (req, res) => res.render("genresid.ejs"));
////////////////////////////////

module.exports = router;
