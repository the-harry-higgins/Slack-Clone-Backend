'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Themes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      primaryColor: {
        allowNull: false,
        type: Sequelize.STRING
      },
      secondaryColor: {
        allowNull: false,
        type: Sequelize.STRING
      },
      textColor: {
        allowNull: false,
        type: Sequelize.STRING
      },
      highlightColor: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Themes');
  }
};