'use strict';

function r(o) {
  o.createdAt = new Date();
  o.updatedAt = new Date();
  return o;
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Themes', [
      r({ primaryColor: '#613659', secondaryColor: '#211522', textColor: '#D3B1C2', highlightColor: '#C197D2' }),
      r({ primaryColor: '#004369', secondaryColor: '#01949A', textColor: '#E5DDC8', highlightColor: '#DB1F48' }),
      r({ primaryColor: '#2D2D34', secondaryColor: '#B97375', textColor: '#CEB1BE', highlightColor: '#E2DCDE' }),
      r({ primaryColor: '#6B7D7D', secondaryColor: '#8EAF9D', textColor: '#A6D8D4', highlightColor: '#D7DAE5' }),
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Themes', null, {});
  }
};
