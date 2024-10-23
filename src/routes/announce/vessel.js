const {Router} = require('express')
const route = Router()
const auth = require('../../middlewares/auth.middleware')
const {DataTypes, Op} = require('sequelize')
const sequelize = require('../../configs/database.connection')
const safe = require('../../utils/safe.util')
const AnnounceVessel = require('../../models/announcevessel')(sequelize, DataTypes)
const Terminal = require('../../models/terminal')(sequelize, DataTypes)

route.get('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => AnnounceVessel.findAll({
        attributes: {
            include: [
                [sequelize.col('terminalCode'), 'terminalCode'],
                [sequelize.col('terminalName'), 'terminalName']
            ]
        },
        include: [
            {
                model: Terminal,
                attributes: [],
            }
        ],
    }))
    if(error) return next(error)
    res.status(200).json(data)
})

route.post('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => AnnounceVessel.create({
        announceCode: req.body.announceCode,
        announceVessel: req.body.announceVessel,
        terminalId: req.body.terminalId,
    }))
    if(error) return next(error)
    res.status(200).json({message: 'Success'})
})

route.put('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => AnnounceVessel.update({
        announceCode: req.body.announceCode,
        announceVessel: req.body.announceVessel,
        terminalId: req.body.terminalId,
    }, {
        where: {
            announceId: req.body.announceId || '',
        }
    }))
    if(error) return next(error)
    res.status(200).json({message: 'Success'})
})

route.delete('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => AnnounceVessel.destroy({
        where: {
            announceId: req.body.announceId || '',
        }
    }))
    if(error) return next(error)
    res.status(200).json({message: 'Success'})
})

module.exports = route