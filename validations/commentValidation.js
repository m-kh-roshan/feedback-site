const Joi = require("joi");

const createComment = Joi.object({
    body: Joi.string().required(),
    comment_id: Joi.number()
})

const updateComment = Joi.object({
    content: Joi.string().required()
})

module.exports = {createComment, updateComment}