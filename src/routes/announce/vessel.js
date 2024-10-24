const {Router} = require('express')
const route = Router()
const auth = require('../../middlewares/auth.middleware')
const {DataTypes, Op} = require('sequelize')
const sequelize = require('../../configs/database.connection')
const safe = require('../../utils/safe.util')
const AnnounceVessel = require('../../models/announcevessel')(sequelize, DataTypes)
const Terminal = require('../../models/terminal')(sequelize, DataTypes)
const Excel = require('exceljs')

route.get('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => AnnounceVessel.findAll({
        attributes: {
            include: [
                [sequelize.col('terminalCode'), 'terminalCode'],
                [sequelize.col('terminalName'), 'terminalName']
            ]
        },
        where: {
            [Op.or]: [
                {
                    announceCode: {
                        [Op.substring]: req.query.q || ''
                    },
                },
                {
                    announceVessel: {
                        [Op.substring]: req.query.q || ''
                    },
                },
                {
                    voyage: {
                        [Op.substring]: req.query.q || ''
                    },
                },
                {
                    '$terminalName$': {
                        [Op.substring]: req.query.q || ''
                    },
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
    const [error, data] = await safe(() => AnnounceVessel.create({
        announceCode: req.body.announceCode,
        announceVessel: req.body.announceVessel,
        voyage: req.body.voyage,
        terminalId: req.body.terminalId,
    }))
    if(error) return next(error)
    res.status(200).json({message: 'Success'})
})

route.put('/', auth, async (req, res, next) => {
    const [error, data] = await safe(() => AnnounceVessel.update({
        announceCode: req.body.announceCode,
        announceVessel: req.body.announceVessel,
        voyage: req.body.voyage,
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
            header: 'Announce Code',
            key: 'announceCode',
            width: 20
        },
        {
            header: 'Announce Vessel',
            key: 'announceVessel',
            width: 20
        },
        {
            header: 'Voyage',
            key: 'voyage',
            width: 20
        },
        {
            header: 'Terminal Name',
            key: 'terminal.terminalName',
            width: 20
        }
    ]
    try{
        const data = await AnnounceVessel.findAll({
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
    res.setHeader('Content-Disposition', `attachment; filename=AnnounceVessel-${new Date().getTime()}.xlsx`);

    await workbook.xlsx.write(res)
    res.end()
})

module.exports = route