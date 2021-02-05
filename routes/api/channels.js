const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../utils');
const { authenticated } = require('./auth-utils');
const { Message, User, Channel, ChannelUser, ChannelType } = require('../../db/models');


// Get all channels
router.get('/', authenticated, asyncHandler(async (req, res, next) => {
  const channels = await Channel.findAll({
    where: {
      channelTypeId: [1, 2],
    },
    include: [User, ChannelType],
    order: ['name']
  });
  
  const response = {
    channels: channels.map(channel =>  {
      const json = channel.toJSON();
      json['members'] = channel.Users.length;
      return json;
    })
  }
  
  res.json(response);
}));


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


// Create a channel
router.post('/', authenticated, asyncHandler(async (req, res) => {
  
  const { name } = req.body;
  
  const channel = await Channel.build({
    name,
    topic: null,
    channelTypeId: 1,
  });
  
  await channel.save();
  
  const channelUser = ChannelUser.build({
    userId: req.user.id,
    channelId: channel.id
  });
  
  await channelUser.save();
  
  res.json({
    channel: channel.toJSON(),
    channelUser
  });
  
}));


// Delete a channel
router.delete('/:id/', authenticated, asyncHandler(async (req, res) => {
  
  await Channel.destroy({
    where: {
      id: req.params.id
    }
  });
  
  res.sendStatus(200);
}));


// Join a channel
router.post('/:id/', authenticated, asyncHandler(async (req, res, next) => {

  const channelUser = ChannelUser.build({
    userId: req.user.id,
    channelId: req.params.id
  });

  await channelUser.save();

  res.json(channelUser);
}));


// Leave a channel
router.delete('/:id/leave/', authenticated, asyncHandler(async (req, res, next) => {

  await ChannelUser.destroy({
    where: {
      channelId: req.params.id,
      userId: req.user.id
    }
  });

  res.sendStatus(200);
}));

module.exports = router;
