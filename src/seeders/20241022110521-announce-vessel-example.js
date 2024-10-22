'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert('announceVessels', [
      {
          "announceId": 1,
          "announceCode": "V001",
          "announceVessel": "OSTINA",
          "terminalId": 1,
          "createdAt": "2024-10-22 09:34:53",
          "updatedAt": "2024-10-22 09:34:53",
      },
      {
          "announceId": 2,
          "announceCode": "V002",
          "announceVessel": "SERASI",
          "terminalId": 2,
          "createdAt": "2024-10-22 09:35:14",
          "updatedAt": "2024-10-22 09:35:14",
      },
      {
          "announceId": 3,
          "announceCode": "V003",
          "announceVessel": "LEADER",
          "terminalId": 3,
          "createdAt": "2024-10-22 09:35:22",
          "updatedAt": "2024-10-22 09:35:22",
      },
      {
          "announceId": 4,
          "announceCode": "V004",
          "announceVessel": "UMAR",
          "terminalId": 4,
          "createdAt": "2024-10-22 09:35:32",
          "updatedAt": "2024-10-22 09:35:32",
      },
      {
          "announceId": 5,
          "announceCode": "V005",
          "announceVessel": "LARAS MB",
          "terminalId": 5,
          "createdAt": "2024-10-22 09:36:17",
          "updatedAt": "2024-10-22 09:38:17",
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('announceVessels', null)
  }
};
