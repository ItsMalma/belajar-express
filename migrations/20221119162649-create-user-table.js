"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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
        unique: true,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
