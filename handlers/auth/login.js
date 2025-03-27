const passportConfig = require('../../config/auth/passport.config')
const {JwtTokens} = require("../../utils/jwtTokens");

const Login = async (req,res,next) => {
    try {
        passportConfig.authorize('local', async (err, user, info) => {
            if (err) return next(err)
            if (!user) return res.status(404).json({
                success: false,
                message: info.message
            })



            const tokens = new JwtTokens()

            const data = {
                id: user.id,
                name: user.firstName + ' ' + user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
            }

            const authToken = tokens.generateAccessToken(data)
            const refreshToken = tokens.generateRefreshToken(data)

            const authorization = {
                authToken,
                refreshToken,
            }

            // Set cookies

            res.cookie('sessionCookie', req.sessionID, {
                httpOnly: true,
                secure: req.secure,
                sameSite: 'strict',
            });

            res.cookie('authToken', authToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 3600000, // 1 hour
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 3600000, // 1 hour
            });

            const responseData = {
                ...data,
                authToken,
                refreshToken,
            }



            return res.status(200).json({
                success: true,
                message: 'Login successful',
                responseData,
                authorization,
            });

        })(req, res,next);

    }catch(err){
        return next(err)
    }
}

module.exports = {Login};