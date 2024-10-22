require('dotenv/config')
const sequelize = require('./configs/database.connection')
const express = require('express')
const app = express()

app.listen(process.env.PORT)