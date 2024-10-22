const {Router} = require('express')
const route = Router()
const auth = require('../../middlewares/auth.middleware')
const {DataTypes, Op} = require('sequelize')
const sequelize = require('../../configs/database.connection')
const AnnounceVessel = require('../../models/announcevessel')(sequelize, DataTypes)
const Terminal = require('../../models/terminal')(sequelize, DataTypes)

route.get('/', auth, async (req, res) => {
    res.status(200).json(await AnnounceVessel.findAll({
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
})

route.post('/', auth, async (req, res) => {
    try{
        await AnnounceVessel.create({
            announceCode: req.body.announceCode,
            announceVessel: req.body.announceVessel,
            terminalId: req.body.terminalId,
        })
    }catch(e){
        return res.status(400).json({message: e.name === 'SequelizeForeignKeyConstraintError' ? 'Input tidak valid' : e.errors?.[0]?.message})
    }
    res.status(200).json({message: 'Success'})
})

route.put('/', auth, async (req, res) => {
    try{
        await AnnounceVessel.update({
            announceCode: req.body.announceCode,
            announceVessel: req.body.announceVessel,
            terminalId: req.body.terminalId,
        }, {
            where: {
                announceId: req.body.announceId,
            }
        })
    }catch(e){
        return res.status(400).json({message: e.name === 'SequelizeForeignKeyConstraintError' ? 'Input tidak valid' : e.errors?.[0]?.message})
    }
    res.status(200).json({message: 'Success'})
})

route.delete('/', auth, async (req, res) => {
    await AnnounceVessel.destroy({
        where: {
            announceId: req.body.announceId,
        }
    })
    res.status(200).json({message: 'Success'})
})

module.exports = route