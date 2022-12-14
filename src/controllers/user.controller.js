const bcrypt = require("bcrypt");
const helperError = require("../helper/error");
const express = require("express");
const expressValidator = require("express-validator");
const jsonWebToken = require("jsonwebtoken");
const jwtMiddleware = require("../middlewares/jwt.middleware");
const sequelize = require("sequelize");

/**
 *
 * @param {express.Router} router
 * @param {sequelize.Sequelize} db
 * @param {string} jwtKey
 */
module.exports = function (router, db, jwtKey) {
  const userModel = db.models.User;

  router.get("", async function (req, res) {
    const users = await userModel.findAll();
    const usersData = [];
    users.forEach(function (user) {
      usersData.push({
        id: parseInt(user.id),
        name: user.name,
      });
    });
    return res.json({
      data: usersData,
    });
  });

  router.get(
    "/me",
    jwtMiddleware(jwtKey, userModel),
    async function (req, res) {
      const user = req.user;
      if (!user) {
        return res.status(500).json({ error: "something wrong" });
      }
      const userData = {
        id: parseInt(user.id),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      return res.json({
        data: userData,
      });
    }
  );

  router.get(
    "/:id",
    expressValidator
      .param("id")
      .exists()
      .withMessage("parameter id is required")
      .isInt()
      .withMessage("parameter id must be a number (integer)")
      .toInt(),
    async function (req, res) {
      const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: helperError.convertValidatorErrors(errors.array()) });
      }
      const userId = req.params.id;
      if (isNaN(userId))
        return res.status(200).json({
          error: `bad parameter id`,
        });

      const user = await userModel.findOne({ where: { id: userId } });
      if (user === null)
        return res.status(404).json({
          error: `user with id ${userId} is not exist`,
        });
      const userData = {
        id: parseInt(user.id),
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      return res.json({
        data: userData,
      });
    }
  );

  router.patch(
    "/me",
    jwtMiddleware(jwtKey, userModel),
    expressValidator
      .body("name")
      .optional()
      .isString()
      .withMessage("field name must be a string")
      .isLength({ min: 1, max: 128 })
      .withMessage("field name minimum length is 1 and maximum length is 128"),
    async function (req, res) {
      const user = req.user;
      if (!user) {
        return res.status(500).json({ error: "something wrong" });
      }

      const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: helperError.convertValidatorErrors(errors.array()) });
      }
      const reqBody = req.body;

      const updated = {};
      if (reqBody.name) user.name = reqBody.name;
      await user.save();

      const userData = {
        id: parseInt(user.id),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      return res.json({
        data: userData,
      });
    }
  );

  router.delete(
    "/me",
    jwtMiddleware(jwtKey, userModel),
    async function (req, res) {
      const user = req.user;
      if (!user) {
        return res.status(500).json({ error: "something wrong" });
      }
      await userModel.destroy({
        where: { id: user.id },
      });
      const userData = {
        id: parseInt(user.id),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      return res.json({
        data: userData,
      });
    }
  );
};
