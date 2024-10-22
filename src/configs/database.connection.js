require('dotenv/config')
const {Sequelize, DataTypes} = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('./database.config')[env]

const sequelize = new Sequelize({...config})

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
});

module.exports = sequelize