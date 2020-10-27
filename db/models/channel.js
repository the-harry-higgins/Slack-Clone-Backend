'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    topic: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    channelTypeId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'Channels' }
    },
  }, {});
  Channel.associate = function(models) {
    Channel.belongsTo(models.ChannelType, { foreignKey: 'channelTypeId' });
    Channel.hasMany(models.Message, { foreignKey: 'channelId' });
    Channel.hasMany(models.ThreadMessage, { foreignKey: 'channelId' });
    Channel.hasMany(models.ChannelUser, { foreignKey: 'channelId' });
    Channel.belongsToMany(models.User, { 
      through: 'ChannelUser',
      otherKey: 'userId',
      foreignKey: 'channelId'
    });
  };
  return Channel;
};