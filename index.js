const express = require("express");
require("dotenv").config();
const init = require("./lib/sheets");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

// MAIN DOMAIN
app.get("/", async (req, res) => {
  try {
    return res.redirect(302, process.env.MAIN_DOMAIN);
  } catch (err) {
    console.log(err);
  }
});

// routing short links
app.get("/*", async (req, res) => {
  try {
    const target = await init(req.url.substring(1));
    if (req.path === "/reserved_redirect") {
      return res.redirect(302, req.query.new_url);
    }
    if (target) return res.redirect(302, target);
    res.status(404).render("404", { url: req.url });
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  console.log(`app running on port ${PORT}`);
  if (err) console.log(err);
});
