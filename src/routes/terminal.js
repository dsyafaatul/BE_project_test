const {Router} = require('express')
const route = Router()
const auth = require('../middlewares/auth.middleware')
const {DataTypes, Op} = require('sequelize')
const sequelize = require('../configs/database.connection')
const safe = require('../utils/safe.util')
const Terminal = require('../models/terminal')(sequelize, DataTypes)

route.get('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => Terminal.findAll())
    if(error) return next(error)
    res.status(200).json(data)
})

route.post('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => Terminal.create({
        terminalCode: req.body.terminalCode,
        terminalName: req.body.terminalName,
    }))
    if(error) return next(error)
    res.status(200).json({message: 'Success'})
})

route.put('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => Terminal.update({
        terminalCode: req.body.terminalCode,
        terminalName: req.body.terminalName,
    }, {
        where: {
            terminalId: req.body.terminalId || '',
        }
    }))
    if(error) return next(error)
    res.status(200).json({message: 'Success'})
})

route.delete('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => Terminal.destroy({
        where: {
            terminalId: req.body.terminalId || '',
        }
    }))
    if(error) return next(error)
    res.status(200).json({message: 'Success'})
})

module.exports = route