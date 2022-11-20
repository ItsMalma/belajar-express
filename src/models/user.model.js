const sequelize = require("sequelize");

/**
 *
 * @param {sequelize.Sequelize} db
 */
module.exports = function (db) {
  db.define(
    "User",
    {
      id: {
        type: sequelize.DataTypes.BIGINT,
        autoIncrement: true,
        autoIncrementIdentity: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: sequelize.DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: sequelize.DataTypes.STRING(256),
        allowNull: false,
        unique: true,
      },
      password: {
        type: sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: sequelize.DataTypes.DATE,
        defaultValue: sequelize.DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: sequelize.DataTypes.DATE,
        defaultValue: null,
        allowNull: true,
      },
      deletedAt: {
        type: sequelize.DataTypes.DATE,
        defaultValue: null,
        allowNull: true,
      },
    },
    { tableName: "user", paranoid: true }
  );
};
