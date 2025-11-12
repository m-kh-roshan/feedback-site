const Joi = require("joi");

const createFeature = Joi.object({
    title : Joi.string().min(3).required(),
    document : Joi.string(),
    category: Joi.string(),
    body: Joi.string()
})

const updateFeature = Joi.object({
    title : Joi.string().min(3).required(),
    document : Joi.string(),
    category: Joi.string(),
    body: Joi.string(),
    status: Joi.string()
})

module.exports = { createFeature, updateFeature }