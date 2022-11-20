const dotenv = require("dotenv");
const express = require("express");
const controller = require("./controllers/controller");
const middleware = require("./middlewares/middleware");
const sequelize = require("sequelize");
const model = require("./models/model");

dotenv.config();

const db = new sequelize.Sequelize({
  dialect: "postgres",
  username: "malma",
  password: "password",
  host: "127.0.0.1",
  port: 5432,
  database: "belajar_express",
});

db.authenticate()
  .then(() => {
    console.log("success to connect to the database!");
  })
  .catch((err) => {
    console.log(`failed to connect to the database: ${err}!`);
    process.exit(1);
  });
model(db);

const jwtKey = process.env.JWT_KEY;
if (!jwtKey) {
  throw new Error("undefined jwt key");
}

const app = express();
middleware(app);
controller(app, db, jwtKey);

const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`listening on port ${port}`);
});

process.on("exit", async function () {
  console.log("closing the connection to the database!");
  await db.close();
});

process.on("SIGINT", function () {
  process.exit(0);
});
