const { GoogleSpreadsheet } = require("google-spreadsheet");
// require("dotenv").config();

const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
const init = async (slug) => {
  let sheet;
  const private_key = JSON.parse(`"${process.env.GOOGLE_PRIVATE_KEY}"`);
  try {
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key,
    });
    await doc.loadInfo();
    if (doc.sheetsById[0]) {
      sheet = doc.sheetsById[0];
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
  } catch (err) {
    console.log(err);
  }
  try {
    const rows = await sheet.getRows();
    let indexNumber;
    rows.every((row, index) => {
      if (row.slug == slug) {
        indexNumber = index;
        return false;
      }
      return true;
    });
    return indexNumber ? rows[indexNumber].target : null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
module.exports = init;
