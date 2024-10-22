'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert('terminals', [
      {
          "terminalId": 1,
          "terminalCode": "T001",
          "terminalName": "INTERNASIONAL",
          "createdAt": "2024-10-22 08:51:11",
          "updatedAt": "2024-10-22 08:51:11"
      },
      {
          "terminalId": 2,
          "terminalCode": "T002",
          "terminalName": "DOMESTIK",
          "createdAt": "2024-10-22 08:51:21",
          "updatedAt": "2024-10-22 08:51:21"
      },
      {
          "terminalId": 3,
          "terminalCode": "T003",
          "terminalName": "BELAWAN",
          "createdAt": "2024-10-22 08:51:30",
          "updatedAt": "2024-10-22 08:51:30"
      },
      {
          "terminalId": 4,
          "terminalCode": "T004",
          "terminalName": "MAKASSAR",
          "createdAt": "2024-10-22 08:51:36",
          "updatedAt": "2024-10-22 08:51:36"
      },
      {
          "terminalId": 5,
          "terminalCode": "T005",
          "terminalName": "PONTIANAK",
          "createdAt": "2024-10-22 08:54:42",
          "updatedAt": "2024-10-22 08:54:42"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('terminals', null)
  }
};
