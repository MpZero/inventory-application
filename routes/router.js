const { Router } = require("express");
const router = Router();
const {
  getAllAlbums,
  createAlbumPost,
  createAlbumGet,
} = require("../controller/albumController");
const { getAllArtists } = require("../controller/artistController");
const { getAllGenres } = require("../controller/genresController");

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
router.get("/albums/:id", (req, res) => res.render("albumid.ejs"));

//// artists ////
router.get("/artists", getAllArtists);

router.get("/artists/new", (req, res) => res.render("artistspost.ejs"));
router.get("/artists/:id", (req, res) => res.render("artistsid.ejs"));

router.post("/artists/new", (req, res) => res.render("artistpost.ejs"));

//// genres ////
router.get("/genres", getAllGenres);

router.get("/genres/:id", (req, res) => res.render("genresid.ejs"));

module.exports = router;
