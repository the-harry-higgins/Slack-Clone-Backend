'use strict';
module.exports = (sequelize, DataTypes) => {
  const Theme = sequelize.define('Theme', {
    primaryColor: DataTypes.STRING,
    secondaryColor: DataTypes.STRING,
    textColor: DataTypes.STRING,
    highlightColor: DataTypes.STRING
  }, {});
  Theme.associate = function(models) {
    // associations can be defined here
  };
  return Theme;
};