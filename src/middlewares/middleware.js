const express = require("express");
const bodyParser = require("body-parser");

/**
 *
 * @param {express.Router} router
 */
module.exports = function (router) {
  router.use(bodyParser.json(), (err, req, res, next) => {
    if (
      err instanceof SyntaxError &&
      err.statusCode === 400 &&
      err.type === "entity.parse.failed"
    ) {
      return res.status(400).json({
        error: "bad json",
      });
    }
  });
};
