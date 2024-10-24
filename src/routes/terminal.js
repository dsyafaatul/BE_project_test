const {Router} = require('express')
const route = Router()
const auth = require('../middlewares/auth.middleware')
const {DataTypes, Op} = require('sequelize')
const sequelize = require('../configs/database.connection')
const safe = require('../utils/safe.util')
const Terminal = require('../models/terminal')(sequelize, DataTypes)
const Excel = require('exceljs')

route.get('/', auth, async (req, res, next) => {
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
            header: 'Terminal Code',
            key: 'terminalCode',
            width: 20
        },
        {
            header: 'Terminal Name',
            key: 'terminalName',
            width: 20
        }
    ]
    try{
        const data = await Terminal.findAll({
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
    res.setHeader('Content-Disposition', `attachment; filename=Terminal-${new Date().getTime()}.xlsx`);

    await workbook.xlsx.write(res)
    res.end()
})

module.exports = route