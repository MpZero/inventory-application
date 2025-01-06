const express = require("express");
const app = express();
const path = require("node:path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => {
  res.render("index.ejs");
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Listening on ${port}`));
