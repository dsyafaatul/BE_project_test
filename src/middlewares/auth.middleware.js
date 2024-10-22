const jose = require('jose')

module.exports = async (req, res, next) => {
    const token = req.signedCookies?.token || ''
    jose.jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY))
    .then(({payload}) => {
        req.user = payload
        next()
    })
    .catch(e => {
        res.status(401).json({
            message: 'Unauthorized'
        })
    })
    
}