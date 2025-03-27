require('dotenv').config();
const jwt = require('jsonwebtoken');

class JwtTokens {

    generateAccessToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            name:user.name,
            phone: user.phoneNumber,
        };

        return jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '10m',
        })
    }

    generateRefreshToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            name:user.name,
            phone: user.phoneNumber,
        };
        return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
            expiresIn: '1h'
        })
    }

}

module.exports = {JwtTokens}