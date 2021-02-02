const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../utils');
const { authenticated } = require('./auth-utils');
const { Message, User, Channel, ChannelUser } = require('../../db/models');

// Get direct messages and last message for each
router.get('/all/users/:userId/', authenticated, asyncHandler(async (req, res, next) => {
  const channels = await Channel.findAll({
    where: {
      channelTypeId: [3],
    },
    include: [User, {
      model: ChannelUser,
      where: {
        userId: req.params.userId
      }
    }],
    order: [['updatedAt', 'DESC']]
  });

  console.log(channels);

  // const messages = await Message.findAll({
  //   where: {
  //     channelId: req.params.id
  //   },
  //   include: [User],
  //   order: [['createdAt', 'DESC']],
  //   limit: 50
  // });

  // const response = {
  //   channels: channels.map(channel => {
  //     return {
  //       id: channel.id,
  //       name: channel.name,
  //       topic: channel.topic,
  //       channelTypeId: channel.channelTypeId,
  //       members: channel.Users.length,
  //     }
  //   })
  // }

  const dummy = [
    {
      id: 1,
    }
  ]

  res.json(channels.length ? channels.toJSON() : dummy);
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


// Delete a channel
router.delete('/:id/', authenticated, asyncHandler(async (req, res) => {

  try {
    await Channel.destroy({
      where: {
        id: req.params.id
      }
    });
  } catch (e) {
    console.log(e);
  }

  res.sendStatus(200);
}));


// Create a channel
router.post('/', authenticated, asyncHandler(async (req, res) => {

  const { userId, name } = req.body;

  const channel = await Channel.build({
    name,
    topic: null,
    channelTypeId: 1,
  });

  await channel.save();

  const channelUser = ChannelUser.build({
    userId: userId,
    channelId: channel.id
  });

  await channelUser.save();

  res.json({
    channel: channel.toJSON(),
    channelUser: channelUser.toJSON()
  });

}))

module.exports = router;
