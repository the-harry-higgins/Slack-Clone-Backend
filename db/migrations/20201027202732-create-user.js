'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      fullName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      displayName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phoneNumber: {
        allowNull: true,
        type: Sequelize.STRING
      },
      profileImage: {
        allowNull: true,
        type: Sequelize.STRING
      },
      themeId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Themes',
          key: 'id'
        }
      },
      lightMode: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      hashedPassword: {
        allowNull: false,
        type: Sequelize.STRING.BINARY
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
    return queryInterface.dropTable('Users');
  }
};