const jwt = require("jsonwebtoken")
const tokenSeviece = require("../services/tokenServices")

const generateTokens = async(user) => {
    user_token = { id: user.id, email: user.email }
    const access_token = jwt.sign(user_token, process.env.ACCESS_TOKEN_SECRET, {expiresIn:process.env.ACCESS_TOKEN_EXPIRES})

    const refresh_token = jwt.sign(user_token, process.env.REFRESH_TOKEN_SECRET, {expiresIn:process.env.REFRESH_TOKEN_EXPIRES})

    const insertToken = await tokenSeviece.insert(user.id, refresh_token)

    return {access_token, refresh_token}
}

module.exports = { generateTokens }