'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: DataTypes.STRING,
    displayName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    timeZone: DataTypes.STRING,
    profileImage: DataTypes.STRING,
    themeId: DataTypes.INTEGER,
    lightMode: DataTypes.BOOLEAN,
    hashedPassword: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};