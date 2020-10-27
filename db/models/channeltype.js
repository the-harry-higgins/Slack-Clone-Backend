'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChannelType = sequelize.define('ChannelType', {
    type: DataTypes.STRING
  }, {});
  ChannelType.associate = function(models) {
    // associations can be defined here
  };
  return ChannelType;
};