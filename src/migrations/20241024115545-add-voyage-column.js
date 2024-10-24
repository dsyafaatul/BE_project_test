'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('announceVessels', 'voyage', {
      type: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('announceVessels', 'voyage')
  }
};
