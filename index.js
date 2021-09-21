const express = require("express");
const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();

// server and doc setup
const app = express();
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
const init = async (slug) => {
  try {
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    });
    await doc.loadInfo();
    let sheet;
    if (await doc.sheetsById[0]) {
      sheet = await doc.sheetsById[0];
      await sheet.setHeaderRow(["slug", "target"]);
      console.log(sheet.title);
    } else {
      sheet = await doc.addSheet({
        sheetId: 0,
        title: "created_table",
        headerValues: ["slug", "target"],
      });
      console.log(sheet.title);
    }
    // } catch (err) {
    //   console.log(err);
    //   return null;
    // }
    // try {
    const rows = await sheet.getRows();
    let indexNumber;
    rows.every((row, index) => {
      if (row.slug == slug) {
        indexNumber = index;
        return false;
      }
      return true;
    });
    console.log(rows[indexNumber].target);
    return rows[indexNumber].target;
  } catch (err) {
    console.log(`${slug} not added`);
    return null;
  }
};

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
    console.log(target);
    if (target) res.redirect(302, target);
  } catch (err) {
    res.send("failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  console.log(`app running on port ${PORT}`);
  if (err) console.log(err);
});
