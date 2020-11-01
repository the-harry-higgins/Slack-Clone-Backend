const { User, Theme, Channel, ChannelType } = require('../db/models');

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

const getUserThemeAndChannels = async (req, id, email) => {
  return id ? 
    await User.findByPk(id, {
      include: [
        Theme,
        {
          model: Channel,
          include: ChannelType
        }
      ]
    }) : 
    await User.findOne({
      where: { email },
      include: [
        Theme,
        {
          model: Channel,
          include: ChannelType
        }
      ]
    });
}

module.exports = {
  asyncHandler,
  getUserThemeAndChannels
}