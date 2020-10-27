'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    fullName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    displayName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    phoneNumber: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    profileImage: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    themeId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: { model: 'Themes' }
    },
    lightMode: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING.BINARY,
    }
  }, {});
  User.associate = function (models) {
    User.belongsTo(models.Theme, { foreignKey: 'themeId' });
    User.hasMany(models.Message, { foreignKey: 'userId' });
    User.hasMany(models.ThreadMessage, { foreignKey: 'userId' });
    User.hasMany(models.ChannelUser, { foreignKey: 'userId' });
    User.belongsToMany(models.Channel, {
      through: 'ChannelUser',
      otherKey: 'channelId',
      foreignKey: 'userId'
    });
  };
  return User;
};