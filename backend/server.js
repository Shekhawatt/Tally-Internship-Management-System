const app = require("./app.js");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
