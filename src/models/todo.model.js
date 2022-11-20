const sequelize = require("sequelize");

/**
 *
 * @param {sequelize.Sequelize} db
 */
module.exports = function (db) {
  db.define(
    "Todo",
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
      description: {
        type: sequelize.DataTypes.STRING(256),
        allowNull: false,
      },
      completed: {
        type: sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: sequelize.DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "CASCADE",
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
    {
      tableName: "todo",
      paranoid: true,
    }
  );
};
