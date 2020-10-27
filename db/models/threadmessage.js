'use strict';
module.exports = (sequelize, DataTypes) => {
  const ThreadMessage = sequelize.define('ThreadMessage', {
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
    messageId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Messages' }
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  }, {});
  ThreadMessage.associate = function(models) {
    ThreadMessage.belongsTo(models.User, { foreignKey: 'userId' });
    ThreadMessage.belongsTo(models.Channel, { foreignKey: 'channelId' });
    ThreadMessage.belongsTo(models.Message, { foreignKey: 'messageId' });
  };
  return ThreadMessage;
};