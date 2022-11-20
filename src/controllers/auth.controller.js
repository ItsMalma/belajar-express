const bcrypt = require("bcrypt");
const helperError = require("../helper/error");
const express = require("express");
const expressValidator = require("express-validator");
const jsonWebToken = require("jsonwebtoken");
const sequelize = require("sequelize");

/**
 *
 * @param {express.Router} router
 * @param {sequelize.Sequelize} db
 * @param {string} jwtKey
 */
module.exports = function (router, db, jwtKey) {
  const userModel = db.models.User;

  router.post(
    "/signup",
    expressValidator
      .body("name")
      .exists()
      .withMessage("required field name")
      .isString()
      .withMessage("field name must be a string")
      .isLength({ min: 1, max: 128 })
      .withMessage("field name minimum length is 1 and maximum length is 128"),
    expressValidator
      .body("email")
      .exists()
      .withMessage("required field email")
      .isString()
      .withMessage("field email must be a string")
      .isLength({ min: 1, max: 256 })
      .withMessage("field email minimum length is 1 and maximum length is 256")
      .isEmail()
      .withMessage("field email must be an email"),
    expressValidator
      .body("password")
      .exists()
      .withMessage("required field password")
      .isString()
      .withMessage("field password must be a string")
      .isLength({ min: 8 })
      .withMessage("field password minimum length is 8"),
    async function (req, res) {
      const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: helperError.convertValidatorErrors(errors.array()) });
      }
      const reqBody = req.body;

      const hashedPassword = bcrypt.hashSync(reqBody.password, 10);
      try {
        const user = await userModel.create({
          name: reqBody.name,
          email: reqBody.email,
          password: hashedPassword,
        });

        return res.status(201).json({
          data: {
            id: parseInt(user.id),
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        });
      } catch (err) {
        if (err instanceof sequelize.ValidationError) {
          switch (err.name) {
            case "SequelizeUniqueConstraintError":
              return res.status(409).json({ error: "user already exist" });
          }
        }
        return res.status(500).json({ error: "something wrong" });
      }
    }
  );

  router.post(
    "/signin",
    expressValidator
      .body("email")
      .exists()
      .withMessage("required field email")
      .isString()
      .withMessage("field email must be a string")
      .isLength({ min: 1, max: 256 })
      .withMessage("field email minimum length is 1 and maximum length is 256")
      .isEmail()
      .withMessage("field email must be an email"),
    expressValidator
      .body("password")
      .exists()
      .withMessage("required field password")
      .isString()
      .withMessage("field password must be a string")
      .isLength({ min: 8 })
      .withMessage("field password minimum length is 8"),
    async function (req, res) {
      const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: helperError.convertValidatorErrors(errors.array()) });
      }
      const reqBody = req.body;

      const user = await userModel.findOne({ where: { email: reqBody.email } });
      if (user === null) {
        return res
          .status(404)
          .json({ error: `user with email ${reqBody.email} not exist` });
      }
      if (!bcrypt.compareSync(reqBody.password, user.password)) {
        return res.status(401).json({ error: "wrong password" });
      }

      const accessToken = jsonWebToken.sign({ email: user.email }, jwtKey, {
        algorithm: "HS256",
        expiresIn: 60 * 15,
        issuer: "malma",
        jwtid: "access",
      });
      const refreshToken = jsonWebToken.sign({ email: user.email }, jwtKey, {
        algorithm: "HS256",
        expiresIn: 3600 * 24 * 30,
        issuer: "malma",
        jwtid: "refresh",
      });

      return res.status(200).json({
        data: {
          accessToken,
          refreshToken,
        },
      });
    }
  );

  router.patch(
    "/refresh",
    expressValidator
      .body("refreshToken")
      .exists()
      .withMessage("required field refreshToken")
      .isString()
      .withMessage("field refreshToken must be a string")
      .notEmpty()
      .withMessage("field refreshToken must be not empty"),
    async function (req, res) {
      const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: helperError.convertValidatorErrors(errors.array()) });
      }
      const reqBody = req.body;

      try {
        const token = jsonWebToken.verify(reqBody.refreshToken, jwtKey, {
          algorithm: "HS256",
          issuer: "malma",
          jwtid: "refresh",
        });

        const user = await userModel.findOne({
          where: { email: token.email },
        });
        if (user === null) {
          return res
            .status(404)
            .json({ error: `user with email ${reqBody.email} not exist` });
        }

        const accessToken = jsonWebToken.sign({ email: user.email }, jwtKey, {
          algorithm: "HS256",
          expiresIn: 60 * 15,
          issuer: "malma",
          jwtid: "access",
        });

        return res.status(200).json({
          data: {
            accessToken,
            refreshToken: reqBody.refreshToken,
          },
        });
      } catch (err) {
        if (err instanceof jsonWebToken.TokenExpiredError) {
          return res.status(400).json({
            errors: {
              refreshToken: "expired token",
            },
          });
        } else if (err instanceof jsonWebToken.JsonWebTokenError) {
          return res.status(400).json({
            errors: {
              refreshToken: "invalid token",
            },
          });
        }
        return res.status(500).json({ error: "something wrong" });
      }
    }
  );
};
