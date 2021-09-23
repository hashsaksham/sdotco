const express = require("express");
const axios = require("axios").default;
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

// Github Repos
if (process.env.GITHUB_USERNAME !== "false" && process.env.GITHUB_USERNAME) {
  app.get("/gh/:repo", async (req, res) => {
    try {
      const { repo } = req.params;
      const { GITHUB_USERNAME: username } = process.env;
      const { status } = await axios.get(
        `https://api.github.com/repos/${username}/${repo}`
      );
      if (status === 200) {
        return res.redirect(302, `https://github.com/${username}/${repo}`);
      }
    } catch (err) {
      return res.status(404).render("404", { url: req.url });
    }
  });
}

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
