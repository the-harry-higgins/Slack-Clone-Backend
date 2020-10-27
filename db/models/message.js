'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
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
    content: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    pinned: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.User, { foreignKey: 'userId' });
    Message.belongsTo(models.Channel, { foreignKey: 'channelId' });
    Message.hasMany(models.ThreadMessage, { foreignKey: 'messageId' });
  };
  return Message;
};