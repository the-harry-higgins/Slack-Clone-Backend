'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChannelType = sequelize.define('ChannelType', {
    type: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  }, {});
  ChannelType.associate = function(models) {
    ChannelType.hasMany(models.Channel, { foreignKey: 'channelTypeId' });
  };
  return ChannelType;
};