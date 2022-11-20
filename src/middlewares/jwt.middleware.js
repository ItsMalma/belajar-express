const express = require("express");
const jsonWebToken = require("jsonwebtoken");
const sequelize = require("sequelize");
const stringHelper = require("../helper/string");

/**
 *
 * @param {string} jwtKey
 * @param {sequelize.ModelStatic} userModel
 * @returns
 */
module.exports = function (jwtKey, userModel) {
  /**
   *
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  return async function (req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "missing authorization token" });
    }
    if (!req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "invalid authorization token" });
    }
    const authorizationToken = stringHelper.removePrefix(
      req.headers.authorization,
      "Bearer "
    );
    try {
      const token = jsonWebToken.verify(authorizationToken, jwtKey, {
        algorithm: "HS256",
        issuer: "malma",
        jwtid: "access",
      });
      const user = await userModel.findOne({ where: { email: token.email } });
      if (user === null)
        return res
          .status(404)
          .json({ error: `user with email ${reqBody.email} not exist` });
      req.user = user;
      next();
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
  };
};
