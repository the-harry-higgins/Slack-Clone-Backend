'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    userId: DataTypes.INTEGER,
    channelId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    pinned: DataTypes.BOOLEAN
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};