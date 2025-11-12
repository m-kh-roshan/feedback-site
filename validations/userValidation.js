const Joi = require("joi");

const createUser = Joi.object({
    password : Joi.string().min(8).max(30).required(),
    confirm_password : Joi.string().min(8).max(30).required(),
    email: Joi.string().email().required()
})

module.exports = {
    createUser
}