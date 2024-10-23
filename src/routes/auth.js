const { Router } = require('express')
const route = Router()
const {DataTypes} = require('sequelize')
const sequelize = require('../configs/database.connection')
const User = require('../models/user')(sequelize, DataTypes)
const bcrypt = require('bcryptjs')
const jose = require('jose')
const safe = require('../utils/safe.util')

route.post('/login', async (req, res, next) => {
    const [error, user] = await safe(() => User.findOne({
        where: {
            username: req.body.username
        }
    }))
    if(error) next(error)
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

module.exports = route