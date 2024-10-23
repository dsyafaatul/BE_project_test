require('dotenv/config')
const sequelize = require('./configs/database.connection')
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const auth = require('./routes/auth')
const user = require('./routes/user')
const terminal = require('./routes/terminal')
const announceVessel = require('./routes/announce/vessel')
const cors = require('cors')

app.use(cors({
    origin: [
        'http://localhost:5173'
    ]
}))
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
    if(error.name === 'SequelizeForeignKeyConstraintError'){
        return res.status(400).json({message: 'Input tidak valid'})
    }else if(error.errors){
        return res.status(400).json({message: error.errors?.[0]?.message})
    }
    if(process.env.NODE_ENV === 'development') console.log(error)
    res.status(500).json({message: 'Internal Server Error'})
})

app.listen(process.env.PORT)