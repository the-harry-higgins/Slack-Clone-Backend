'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChannelUser = sequelize.define('ChannelUser', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Users' }
    },
    channelId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Channels' }
    },
  }, {});
  ChannelUser.associate = function(models) {
    ChannelUser.belongsTo(models.User, { foreignKey: 'userId' });
    ChannelUser.belongsTo(models.Channel, { foreignKey: 'channelId' });
  };
  return ChannelUser;
};