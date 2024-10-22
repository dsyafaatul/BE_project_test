'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert('users', [
      {
          "userId": 1,
          "username": "IKT001",
          "password": "$2a$10$9Oqs9qF3otyb3l5SYGuBzezpxGl7soWvJlQJ2lJsJs.GnHa8jXL.6",
          "terminalId": 1,
          "createdAt": "2024-10-22 07:47:57",
          "updatedAt": "2024-10-22 07:47:57"
      },
      {
          "userId": 2,
          "username": "IKT002",
          "password": "$2a$10$BnQj/HsytW4s9GFIcqSPbuoLmZ2ZS.kvylX6saK4YRdyNHhO7pzK6",
          "terminalId": 1,
          "createdAt": "2024-10-22 07:54:13",
          "updatedAt": "2024-10-22 07:54:13"
      },
      {
          "userId": 3,
          "username": "IKT003",
          "password": "$2a$10$lc.dD3.1g4FEltgB.AYBSeXaMY7Gkt5IOnS34FyRJZ9U3Kcy8WUQG",
          "terminalId": 2,
          "createdAt": "2024-10-22 07:55:07",
          "updatedAt": "2024-10-22 07:55:07"
      },
      {
          "userId": 4,
          "username": "IKT004",
          "password": "$2a$10$sjJIeNO8NNbwM8KvPcVipO0Z76ii.mZIDM6Knqrg5CstnkhhJGRTO",
          "terminalId": 2,
          "createdAt": "2024-10-22 07:55:16",
          "updatedAt": "2024-10-22 07:55:16"
      },
      {
          "userId": 5,
          "username": "IKT005",
          "password": "$2a$10$SvVmeQ2vtDM/B3/idA.IuePLlx1nT4fHpmtLg7e0isjcxZ3svygjy",
          "terminalId": 3,
          "createdAt": "2024-10-22 08:24:35",
          "updatedAt": "2024-10-22 08:24:35"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('users', null)
  }
};
