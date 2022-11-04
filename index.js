require("dotenv").config();
require("./workers/checkAlerts");
const express = require("express");
const routes = require("./routes/router");
const path = require("path");
const app = express();
const connect = require("./database/connection");
const {sendErrorResponse} = require('./helpers/sendResponse')

const PORT = process.env.PORT 
const static_path = path.join(__dirname, "public");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.use("/api", routes);

app.use((req, res) => {
  return sendErrorResponse(res, 404, "route dose not exist")
});

(async () => {
  try {
    await connect();
    console.log('database connected.')
    app.listen(PORT, () => console.log(`Server started listening at ${PORT}`));
  } catch (error) {
    console.log(error.message);
  }
})();
