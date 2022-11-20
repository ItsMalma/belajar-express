const sequelize = require("sequelize");
const todoModel = require("./todo.model");
const userModel = require("./user.model");

/**
 *
 * @param {sequelize.Sequelize} db
 */
module.exports = function (db) {
  userModel(db);
  todoModel(db);
};
