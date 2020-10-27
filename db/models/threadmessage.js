'use strict';
module.exports = (sequelize, DataTypes) => {
  const ThreadMessage = sequelize.define('ThreadMessage', {
    userId: DataTypes.INTEGER,
    channelId: DataTypes.INTEGER,
    messageId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {});
  ThreadMessage.associate = function(models) {
    // associations can be defined here
  };
  return ThreadMessage;
};