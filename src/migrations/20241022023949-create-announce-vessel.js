'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('announceVessels', {
      announceId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      announceCode: {
        type: Sequelize.STRING,
        unique: true
      },
      announceVessel: {
        type: Sequelize.STRING
      },
      terminalId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'terminals',
          key: 'terminalId'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('announceVessels');
  }
};