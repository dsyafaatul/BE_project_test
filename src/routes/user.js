const {Router} = require('express')
const route = Router()
const auth = require('../middlewares/auth.middleware')
const {DataTypes, Op} = require('sequelize')
const sequelize = require('../configs/database.connection')
const User = require('../models/user')(sequelize, DataTypes)
const bcrypt = require('bcryptjs')
const safe = require('../utils/safe.util')
const Terminal = require('../models/terminal')(sequelize, DataTypes)

route.get('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => User.findAll({
        attributes: {
            exclude: ['password'],
            include: [
                [sequelize.col('terminalCode'), 'terminalCode'],
                [sequelize.col('terminalName'), 'terminalName']
            ]
        },
        where: {
            userId: {
                [Op.ne]: req.user.userId || ''
            },
            [Op.or]: [
                {
                    username: {
                        [Op.substring]: req.query.q || ''
                    },
                },
                {
                    '$terminalName$': {
                        [Op.substring]: req.query.q || ''
                    }
                }
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
    const [error, data] = await safe(() => User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        terminalId: req.body.terminalId,
    }))
    if(error) return next(error)
    res.status(200).json({message: 'Success'})
})

route.put('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => User.update({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        terminalId: req.body.terminalId,
    }, {
        where: {
            userId: req.body.userId || '',
        }
    }))
    if(error) return next(error)
    res.status(200).json({message: 'Success'})
})

route.delete('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => User.destroy({
        where: {
            [Op.and]: [
                {
                    userId: req.body.userId || '',
                },
                {
                    userId: {
                        [Op.ne]: req.user.userId || ''
                    }
                }
            ]
        }
    }))
    if(error) return next(error)
    res.status(200).json({message: 'Success'})
})

module.exports = route