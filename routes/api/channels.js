const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../utils');
const { authenticated } = require('./auth-utils');
const { Message, User, Channel, ChannelUser } = require('../../db/models');
const channeluser = require('../../db/models/channeluser');

// Get all messages for a channel
router.get('/:id/messages', authenticated, asyncHandler(async (req, res, next) => {
  const messages = await Message.findAll({
    where: {
      channelId: req.params.id
    },
    include: [User],
    order: [['createdAt', 'DESC']],
    limit: 50
  });
  const response = {
    messages: messages.map(message => {
      return {
        id: message.id,
        channelId: message.channelId,
        content: message.content,
        pinned: message.pinned,
        createdAt: message.createdAt,
        userId: message.userId,
        displayName: message.User.displayName,
        profileImage: message.User.profileImage
      }
    }).reverse()
  }
  res.json(response);
}));

// Get all channels
router.get('/', authenticated, asyncHandler(async (req, res, next) => {
  const channels = await Channel.findAll({
    where: {
      channelTypeId: [1, 2],
    },
    include: [User],
    order: ['name']
  });

  const response = {
    channels: channels.map(channel => {
      return {
        id: channel.id,
        name: channel.name,
        topic: channel.topic,
        channelTypeId: channel.channelTypeId,
        members: channel.Users.length,
      }
    })
  }

  res.json(response);
}));


// Join a channel
router.post('/:id/', authenticated, asyncHandler(async (req, res, next) => {
  
  const { userId } = req.body;

  const channelUser = ChannelUser.build({
    userId: userId,
    channelId: req.params.id
  });

  await channelUser.save();

  res.json(channelUser.toJSON());
}));


// Leave a channel
router.delete('/:channelId/users/:userId/', authenticated, asyncHandler(async (req, res, next) => {

  await ChannelUser.destroy({
    where: {
      channelId: req.params.channelId,
      userId: req.params.userId
    }
  });

  res.sendStatus(200);
}));

module.exports = router;
