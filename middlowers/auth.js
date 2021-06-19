const expressJWT = require('express-jwt');

exports.requireSignIn = expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms: ['sha1', 'RS256', 'HS256'],
    userProperty: 'auth'
});