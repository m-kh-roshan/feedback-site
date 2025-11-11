

const { RefreshToken } = require("../models");

const insert = async(user_id, token) => {
    const tokenInserted = RefreshToken.create({user_id, token})
    return tokenInserted
}

const destroy = async(token) => {
    const deletedToken = RefreshToken.destroy({where: { token: token }})
    return deletedToken
}


const findTokenByToken = async(token) => {
    const tokens = await RefreshToken.findOne
}

module.exports = {insert, destroy}

