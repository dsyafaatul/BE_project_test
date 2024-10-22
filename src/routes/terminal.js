const {Router} = require('express')
const route = Router()
const auth = require('../middlewares/auth.middleware')
const {DataTypes, Op} = require('sequelize')
const sequelize = require('../configs/database.connection')
const Terminal = require('../models/terminal')(sequelize, DataTypes)

route.get('/', auth, async (req, res) => {
    res.status(200).json(await Terminal.findAll())
})

route.post('/', auth, async (req, res) => {
    await Terminal.create({
        terminalCode: req.body.terminalCode,
        terminalName: req.body.terminalName,
    })
    res.status(200).json({message: 'Success'})
})

route.put('/', auth, async (req, res) => {
    await Terminal.update({
        terminalCode: req.body.terminalCode,
        terminalName: req.body.terminalName,
    }, {
        where: {
            terminalId: req.body.terminalId,
        }
    })
    res.status(200).json({message: 'Success'})
})

route.delete('/', auth, async (req, res) => {
    await Terminal.destroy({
        where: {
            terminalId: req.body.terminalId,
        }
    })
    res.status(200).json({message: 'Success'})
})

module.exports = route