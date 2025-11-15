

const { RefreshToken } = require("../models");

const insert = async(user_id, token) => {
    const tokenInserted = await RefreshToken.create({user_id, token})
    return tokenInserted
}

const destroyByToken = async(token) => {
    const deletedToken = await RefreshToken.destroy({where: { token: token }})
    return deletedToken
}


const findTokenByToken = async(token) => {
    const tokens = await RefreshToken.findOne({ where : { token: token } })
    return tokens
}

module.exports = {insert, destroyByToken, findTokenByToken}

