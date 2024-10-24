const { Router } = require('express')
const route = Router()
const {DataTypes, Op} = require('sequelize')
const sequelize = require('../configs/database.connection')
const User = require('../models/user')(sequelize, DataTypes)
const bcrypt = require('bcryptjs')
const jose = require('jose')
const safe = require('../utils/safe.util')
const auth = require('../middlewares/auth.middleware')
const Terminal = require('../models/terminal')(sequelize, DataTypes)

route.post('/login', async (req, res, next) => {
    const [errorCekUser, cekUser] = await safe(() => User.findOne({
        where: {
            username: req.body.username || '',
        },
        include: Terminal
    }))
    if(!cekUser) return res.status(401).json({message: 'Username or Password is wrong'})
    const [error, user] = await safe(() => User.findOne({
        where: {
            username: req.body.username || '',
            terminalId: req.body.terminalId
        },
        include: Terminal
    }))
    if(error) next(error)
    if(!user) return res.status(401).json({message: 'Terminal anda salah'})
    if(!bcrypt.compareSync(req.body.password, user.password)){
        return res.status(401).json({message: 'Username or Password is wrong'})
    }

    const data = {
        userId: user.userId,
        username: user.username,
        terminalId: user.terminalId,
        terminalName: user.terminal.terminalName,
        role: user.role,
    }
    const [errorJWT, token] = await safe(() => new jose.SignJWT(data).setProtectedHeader({
        alg: 'HS256'
    }).sign(new TextEncoder().encode(process.env.SECRET_KEY)))
    if(errorJWT) next(errorJWT)

    res.cookie('token', token, {
        signed: true,
        maxAge: 24 * 60* 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: true,
        path: '/',
    }).json({message: 'Success'})
})

route.get('/', auth, (req, res) => {
    res.status(200).json({message: 'Success', data: req.user})
})

route.delete('/logout', (req, res) => {
    res.clearCookie('token')
    res.status(200).json({message: 'Success'})
})

route.get('/terminal', async (req, res, next) => {
    const [error, data] = await safe(() => Terminal.findAll({
        where: {
            [Op.or]: [
                {
                    terminalCode: {
                        [Op.substring]: req.query.q || ''
                    },
                },
                {
                    terminalName: {
                        [Op.substring]: req.query.q || ''
                    },
                }
            ]
        }
    }))
    if(error) return next(error)
    res.status(200).json(data)
})

module.exports = route