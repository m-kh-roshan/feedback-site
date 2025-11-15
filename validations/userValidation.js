const Joi = require("joi");

const createUser = Joi.object({
    password : Joi.string().min(8).max(30).required(),
    confirm_password : Joi.string().min(8).max(30).required(),
    email: Joi.string().email().required()
})

const resendEmail = Joi.object({
    email: Joi.string().email().required()
})

const resetPassword = Joi.object({
    token : Joi.string().required(),
    password : Joi.string().min(8).max(30).required(),
    confirm_password : Joi.string().min(8).max(30).required(),
})

module.exports = {
    createUser,
    resendEmail,
    resetPassword
}