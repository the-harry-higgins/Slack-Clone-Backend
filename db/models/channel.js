'use strict';
const { Op } = require('sequelize');

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
      references: { model: 'ChannelTypes' }
    },
  }, {});
  Channel.associate = function (models) {
    Channel.belongsTo(models.ChannelType, { foreignKey: 'channelTypeId' });
    Channel.hasMany(models.Message, {
      foreignKey: 'channelId',
      onDelete: 'CASCADE'
    });
    Channel.hasMany(models.ThreadMessage, { foreignKey: 'channelId' });
    Channel.hasMany(models.ChannelUser, { foreignKey: 'channelId' });
    Channel.belongsToMany(models.User, {
      through: 'ChannelUser',
      otherKey: 'userId',
      foreignKey: 'channelId'
    });
  };

  Channel.prototype.toJSON = function () {
    return {
      id: this.id,
      name: this.name,
      topic: this.topic,
      type: this.ChannelType.type,
      notification: false,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  Channel.prototype.toDirectMessage = async function (userId, otherUser) {

    if (!otherUser) {
      const otherChannelUser = await sequelize.models.ChannelUser.findOne({
        where: {
          channelId: this.id,
          userId: {
            [Op.ne]: userId
          }
        },
        include: sequelize.models.User
      });

      otherUser = otherChannelUser.User.toSafeObject();
    }

    return {
      id: this.id,
      type: this.ChannelType.type,
      notification: false,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      otherUser,
    };
  }

  Channel.prototype.toDirectMessagePreview = async function (userId, otherUser) {

    if (!otherUser) {
      const otherChannelUser = await sequelize.models.ChannelUser.findOne({
        where: {
          channelId: this.id,
          userId: {
            [Op.ne]: userId
          }
        },
        include: sequelize.models.User
      });

      otherUser = otherChannelUser.User.toSafeObject();
    }

    const lastMessage = await sequelize.models.Message.findOne({
      where: {
        channelId: this.id
      },
      include: [sequelize.models.User],
      order: [['createdAt', 'DESC']],
      limit: 1
    });

    if (lastMessage) {
      lastMessage.User = lastMessage.User.toSafeObject();
    }

    return {
      id: this.id,
      type: this.ChannelType.type,
      notification: false,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      otherUser,
      lastMessage,
    };

  }

  return Channel;
};