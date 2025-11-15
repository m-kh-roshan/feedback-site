const { User, RefreshToken } = require("../models");


const insertUser  = async (email, password) => {
    const user = User.create({email: email, password: password})
    return user;
}

const findbyEmail = async (email) => {
    const user = User.findOne({where: { email: email }})

    return user
}

const findbyId = async (id) => {
    const user = User.findByPk(id)

    return user
}

const update = async (id, data) => {
    const updateResult = User.update(
        data,
        {
            where: { id: id }
        }
    ) 

    return updateResult
}

module.exports = {insertUser, findbyEmail, update}
