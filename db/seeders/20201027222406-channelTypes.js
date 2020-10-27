'use strict';

function r(o) {
  o.createdAt = new Date();
  o.updatedAt = new Date();
  return o;
}

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
