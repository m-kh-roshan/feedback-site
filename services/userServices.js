const { User, RefreshToken } = require("../models");


const insertUser  = async (email, password) => {
    const user = User.create({email: email, password: password})
    return user;
}

const findbyEmail = async (email) => {
    const user = User.findOne({where: { email: email }})

    return user
}
const getFeatures = async (search, filter, sort, category, user_id) => {

}


module.exports = {insertUser, findbyEmail}
