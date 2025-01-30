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
} = require("../controller/albumController");
const { getAllArtists, getArtist } = require("../controller/artistController");
const { getAllGenres, getGenre } = require("../controller/genresController");

//homepage
router.get("/", (req, res) =>
  res.render("index.ejs", { title: "GG Music Database" })
);

//about
router.get("/about", (req, res) =>
  res.render("about.ejs", { title: "About | GG Music Database" })
);

//contact
router.get("/contact", (req, res) => res.render("contact.ejs"));

//// albums ////
// router.get("/albums", (req, res) => res.render("albums.ejs"));
router.get("/albums", getAllAlbums);
router.get("/albums/new", createAlbumGet);
router.post("/new", createAlbumPost);
router.get("/albums/:album", getAlbum);
router.get("/albums/:album/update", getAlbumUpdate);
router.post("/albums/:album/update", postAlbumUpdate);
router.post("/albums/:album/delete", deleteAlbum);

//// artists ////
router.get("/artists", getAllArtists);

router.get("/artists/new", (req, res) => res.render("artistspost.ejs"));
router.get("/artists/:artist", getArtist);

router.post("/artists/new", (req, res) => res.render("artistpost.ejs"));

//// genres ////
router.get("/genres", getAllGenres);

router.get("/genres/:id", getGenre);
// router.get("/genres/:id", (req, res) => res.render("genresid.ejs"));

module.exports = router;
