const { User, RefreshToken, Op } = require("../models");


const insertUser  = async (email, password) => {
    const user = await User.create({email: email, password: password})
    return user;
}

const findbyEmail = async (email) => {
    const user = await User.findOne({where: { email: email }})

    return user
}

const findByTokens = async (token) => {
    const user = await User.findOne({
        where: {
            [Op.or]: [
                {
                    email_token: token, 
                    email_token_expire: { [Op.gt]: Date.now() }
                },
                {
                    reset_password_token: token,
                    reset_password_token_expire: { [Op.gt]: Date.now() }
                },

            ]
        }
    })

    return user
}

const update = async (id, data) => {
    const updateResult = await User.update(
        data,
        {
            where: { id: id }
        }
    ) 

    return updateResult
}

module.exports = {insertUser, findbyEmail, update, findByTokens}
