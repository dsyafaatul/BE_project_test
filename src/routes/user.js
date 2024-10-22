const {Router} = require('express')
const route = Router()
const auth = require('../middlewares/auth.middleware')
const {DataTypes, Op} = require('sequelize')
const sequelize = require('../configs/database.connection')
const User = require('../models/user')(sequelize, DataTypes)
const bcrypt = require('bcryptjs')

route.get('/', auth, async (req, res) => {
    res.status(200).json(await User.findAll({
        where: {
            userId: {
                [Op.ne]: req.user.userId
            }
        }
    }))
})

route.post('/', auth, async (req, res) => {
    await User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        terminalId: req.body.terminalId,
    })
    res.status(200).json({message: 'Success'})
})

route.put('/', auth, async (req, res) => {
    await User.update({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        terminalId: req.body.terminalId,
    }, {
        where: {
            userId: req.body.userId,
        }
    })
    res.status(200).json({message: 'Success'})
})

route.delete('/', auth, async (req, res) => {
    await User.destroy({
        where: {
            [Op.and]: [
                {
                    userId: req.body.userId,
                },
                {
                    userId: {
                        [Op.ne]: req.user.userId
                    }
                }
            ]
        }
    })
    res.status(200).json({message: 'Success'})
})

module.exports = route