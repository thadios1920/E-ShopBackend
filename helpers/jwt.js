const  expressJWT  = require('express-jwt')

// J'ai rencentrer des problemes ici "TypeError: expressJwt is not a function" 
// pour la reparer il fallait installer une old version 
// npm uninstall express-jwt 
// npm I express-jwt@5.3.1

function authJWT() {
    const secret = process.env.SECRET_KEY
    const api = process.env.API_URL
    return expressJWT({
        secret,
        algorithms : ['HS256'],
        isRevoked : isRevoked
    }).unless({
        path:[
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/product(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    })
}
async function isRevoked(req,payload,done) {
    if (!payload.isAdmin) {
        done(null,true)
    }
    done()
}
module.exports = authJWT