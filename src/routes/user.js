const {Router} = require('express')
const route = Router()
const auth = require('../middlewares/auth.middleware')
const {DataTypes, Op} = require('sequelize')
const sequelize = require('../configs/database.connection')
const User = require('../models/user')(sequelize, DataTypes)
const bcrypt = require('bcryptjs')
const safe = require('../utils/safe.util')
const Terminal = require('../models/terminal')(sequelize, DataTypes)
const Excel = require('exceljs')

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
        ...(req.body.password ? {password: bcrypt.hashSync(req.body.password)}  : {}),
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

route.get('/excel', async (req, res, next) => {
    const workbook = new Excel.Workbook()
    const sheet = workbook.addWorksheet('Sheet1')

    sheet.columns = [
        {
            header: 'No',
            key: 'number',
            width: 5
        },
        {
            header: 'Username',
            key: 'username',
            width: 20
        },
        {
            header: 'Terminal Name',
            key: 'terminal.terminalName',
            width: 20
        }
    ]
    try{
        const data = await User.findAll({
            attributes: {
                exclude: 'password'
            },
            include: Terminal,
            raw: true
        })
        sheet.addRows(data.map((row, index) => {
            row.number = index+1
            return row
        }))
    }catch(error){
        next(error)
    }

    const borderThin = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    }
    sheet.eachRow((row, number) => {
        row.eachCell(cell => {
            cell.border = borderThin
        })
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=User-${new Date().getTime()}.xlsx`);

    await workbook.xlsx.write(res)
    res.end()
})

module.exports = route