const sequelize = require("sequelize");
const userModel = require("./user.model");

/**
 *
 * @param {sequelize.Sequelize} db
 */
module.exports = function (db) {
  userModel(db);
};
