const { Router } = require('express')
const route = Router()
const {DataTypes} = require('sequelize')
const sequelize = require('../configs/database.connection')
const User = require('../models/user')(sequelize, DataTypes)
const bcrypt = require('bcryptjs')
const jose = require('jose')

route.post('/', async (req, res, next) => {
    const user = await User.findOne({
        where: {
            username: req.body.username
        }
    })
    if(!user) return next('router')
    if(!bcrypt.compareSync(req.body.password, user.password)){
        return res.status(401).json({message: 'Unauthorized'})
    }

    const data = {
        userId: user.userId,
        username: user.username,
        terminalId: user.terminalId,
        role: user.role
    }
    const token = await new jose.SignJWT(data).setProtectedHeader({
        alg: 'HS256'
    }).sign(new TextEncoder().encode(process.env.SECRET_KEY))

    res.cookie('token', token, {
        signed: true,
        maxAge: 24 * 60* 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: true,
        path: '/',
    }).json({message: 'Success'})
})

module.exports = route