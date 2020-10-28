'use strict';

const { r } = require('../seeder-utils');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ChannelTypes', [
      r({ type: 'public' }),
      r({ type: 'private' }),
      r({ type: 'directmessage' }),
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ChannelTypes', null, {});
  }
};
