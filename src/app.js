require('dotenv/config')
const sequelize = require('./configs/database.connection')
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const auth = require('./routes/auth')
const user = require('./routes/user')
const terminal = require('./routes/terminal')
const announceVessel = require('./routes/announce/vessel')

app.use(express.json())
app.use(cookieParser(process.env.SECRET_KEY))

app.use('/auth', auth)
app.use('/user', user)
app.use('/terminal', terminal)
app.use('/announce/vessel', announceVessel)

app.use((req, res) => {
    res.status(404).json({message: 'Not Found'})
})
app.use((error, req, res, next) => {
    res.status(500).json({message: 'Internal Server Error'})
})

app.listen(process.env.PORT)