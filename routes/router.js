const { Router } = require("express");
const router = Router();
const { getAllAlbums } = require("../controller/albumController");

//homepage
router.get("/", (req, res) => res.render("index.ejs"));

//about
router.get("/about", (req, res) => res.render("about.ejs"));

//contact
router.get("/contact", (req, res) => res.render("contact.ejs"));

//// albums ////
// router.get("/albums", (req, res) => res.render("albums.ejs"));
router.get("/albums", getAllAlbums);

router.get("/albums/new", (req, res) => res.render("albumpost.ejs"));
router.post("/albums/new", (req, res) => res.render("albumpost.ejs"));
router.get("/albums/:id", (req, res) => res.render("albumid.ejs"));

//// artists ////
router.get("/artists", (req, res) => res.render("artists.ejs"));

router.get("/artists/new", (req, res) => res.render("artistspost.ejs"));
router.get("/artists/:id", (req, res) => res.render("artistid.ejs"));

router.post("/artists/new", (req, res) => res.render("artistpost.ejs"));

//// genres ////
router.get("/genres", (req, res) => res.render("genres.ejs"));

router.get("/genres/:id", (req, res) => res.render("genresid.ejs"));

module.exports = router;
