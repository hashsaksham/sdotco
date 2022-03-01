const express = require("express");
const axios = require("axios").default;
require("dotenv").config();
const init = require("./lib/sheets");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.static(path.join(__dirname + "/public")));

// MAIN DOMAIN
app.get("/", async (req, res) => {
  try {
    console.log(process.env.MAIN_DOMAIN);
    return res.redirect(302, process.env.MAIN_DOMAIN);
  } catch (err) {
    console.log(err);
    console.log(process.env.MAIN_DOMAIN);
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
      return;
    } catch (err) {
      let page = fs.readFileSync(__dirname + "/public/404.html", "utf8");
      page = page.replace("change_address", req.url);
      page = page.replace("TBD", "404 | NOT FOUND");
      return res.status(err.response.status).send(page);
    }
  });
}

// routing short links
app.get("/*", async (req, res) => {
  try {
    const target = await init(req.url.substring(1));
    if (req.path === "/reserved_redirect" && req.query.new_url !== "") {
      return res.redirect(302, req.query.new_url);
    }
    if (target) return res.redirect(302, target);
    let page = fs.readFileSync(__dirname + "/public/404.html", "utf8");
    page = page.replace("change_address", req.url);
    page = page.replace("TBD", "404 | URL NOT FOUND");
    return res.status(404).send(page);
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, err => {
  console.log(`app running on port ${PORT}`);
  if (err) console.log(err);
});
