"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        autoIncrement: true,
        autoIncrementIdentity: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false,
      },
      password: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: null,
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: null,
        allowNull: true,
      },
    });
    await queryInterface.addIndex("user", ["email"], {
      name: "user_email_unique",
      unique: true,
      where: {
        deletedAt: {
          [Sequelize.Op.is]: null,
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
