const { GoogleSpreadsheet } = require("google-spreadsheet");
// require("dotenv").config();

const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
const init = async (slug) => {
  let sheet;
  try {
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    });
    await doc.loadInfo();
    if (await doc.sheetsById[0]) {
      sheet = await doc.sheetsById[0];
      await sheet.setHeaderRow(["slug", "target"]);
    } else {
      sheet = await doc.addSheet({
        sheetId: 0,
        title: "created_table",
        headerValues: ["slug", "target"],
      });
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
    console.log(rows[indexNumber].target);
    return rows[indexNumber].target;
  } catch (err) {
    console.log(err);
    return null;
  }
};
module.exports = init;
