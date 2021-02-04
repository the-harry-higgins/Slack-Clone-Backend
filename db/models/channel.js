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

  Channel.prototype.toDirectMessage = async function (userId) {
    try {
      const otherChannelUser = await sequelize.models.ChannelUser.findOne({
        where: {
          channelId: this.id,
          userId: {
            [Op.ne]: userId
          }
        },
        include: sequelize.models.User
      });

      return {
        id: this.id,
        channelTypeId: this.channelTypeId,
        otherUser: otherChannelUser.User.toSafeObject(),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };

    } catch (e) {
      console.log(e);
    }
  }

  return Channel;
};