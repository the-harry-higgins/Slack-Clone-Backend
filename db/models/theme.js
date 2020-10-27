'use strict';
module.exports = (sequelize, DataTypes) => {
  const Theme = sequelize.define('Theme', {
    primaryColor: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    secondaryColor: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    textColor: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    highlightColor: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {});
  Theme.associate = function(models) {
    Theme.hasMany(models.User, { foreignKey: 'themeId' });
  };
  return Theme;
};