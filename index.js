const express = require("express");
require("dotenv").config();
const init = require("./lib/sheets");
// server and doc setup
const app = express();

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
    const target = await init(req.originalUrl.substring(1));
    if (target) return res.redirect(302, target);
    return res.send(`${req.url} not found`);
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  console.log(`app running on port ${PORT}`);
  if (err) console.log(err);
});
