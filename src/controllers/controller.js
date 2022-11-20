const express = require("express");
const sequelize = require("sequelize");
const authController = require("./auth.controller");
const userController = require("./user.controller");

/**
 *
 * @param {express.Router} router
 * @param {sequelize.Sequelize} db
 * @param {string} jwtKey
 */
module.exports = function (router, db, jwtKey) {
  const authRouter = express.Router();
  authController(authRouter, db, jwtKey);
  router.use("/auth", authRouter);

  const usersRouter = express.Router();
  userController(usersRouter, db, jwtKey);
  router.use("/users", usersRouter);
};
