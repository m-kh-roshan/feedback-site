const Joi = require("joi");
const featureService = require("../services/featureServices");
const userService = require("../services/userServices");
const commentService = require("../services/commentServices");

const create = async (req, res, next) => {
    const schema = Joi.object({
            content: Joi.string().required(),
            comment_id: Joi.number()
        })
    const validateResult = schema.validate(req.body)
    if(validateResult.error) 
        return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: validateResult.error.details[0].message,
    });

    const featue = await featureService.getFeature(req.params.id)
    if (!featue)
        return res.status(404).json({
            code: "NOT_FOUND",
            message: "feature not found"
        })

    try {
        await commentService.insertComment(req.user.id, req.params.id, req.body.comment_id, req.body.body)
        return res.status(201).json({
        code: "COMMENT_CREATED",
        message: "Your comment has been created successfully.",
      })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
        code: "COMMENT_CREATION_FAILED",
        message: "Failed to create comment due to an unknown error.",
      });
        
    }
}

const update = async (req, res, next) => {
    const schema = Joi.object({
            content: Joi.string().required()
        })
    const validateResult = schema.validate(req.body)
    if(validateResult.error) 
        return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: validateResult.error.details[0].message,
    });

    const featue = await featureService.getFeature(req.params.id)
    if (!featue)
        return res.status(404).json({
            code: "NOT_FOUND",
            message: "feature not found"
        })

    const comment = await commentService.getComment(req.params.commentId)
    if (!comment)
        return res.status(404).json({
            code: "NOT_FOUND",
            message: "comment not found"
        })

    try {
        if(comment.user_id === req.user.id) {

            await commentService.updateComment(req.params.commentId, req.body.body)
            return res.status(200).json({
                code: "COMMENT_UPDATED",
                message: "Your comment has been updated successfully.",
            })

        } else {
            return res.status(403).json({
                code: "PERMISSOIN_DENIED",
                message: "permission denied.",
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
        code: "COMMENT_UPDATING_FAILED",
        message: "Failed to updateing comment due to an unknown error.",
      });
        
    }
}

const deleteComment = async (req, res, next) => {
    
        const comment = await commentService.getComment(req.params.commentId)
        if (!comment)
            return res.status(404).json({
                code: "NOT_FOUND",
                message: "comment not found"
            })

        const featue = await featureService.getFeature(req.params.id)
        if (!featue)
            return res.status(404).json({
                code: "NOT_FOUND",
                message: "feature not found"
            })
    try {
        if(comment.user_id == req.user.id){
            if (comment.feature_id == req.params.id) {
                
                await commentService.destroyComment(req.params.commentId)
                return res.status(200).json({
                    code: "COMMENT_DELETED",
                    message: "Your comment has been deleted successfully.",
                })
            } else {
                return res.status(400).json({
                    code: "COMMENT_FEATURE_MISMATCH",
                    message: "The comment does not belong to the specified feature.",
                });
            }

        } else {
            return res.status(403).json({
                code: "PERMISSOIN_DENIED",
                message: "permission denied.",
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
        code: "COMMENT_DELETING_FAILED",
        message: "Failed to deleting comment due to an unknown error.",
      });
    }
}

const like = async (req, res, next) => {
    const feature = req.params.id
    const comment = req.params.commentId
    const user = req.user.id

    try {
        const featureExists = await featureService.getFeature(feature);
        if (!featureExists) {
            return res.status(404).json({
                code: "NOT_FOUND",
                message: "Feature not found",
            });
        }
        const commentExists = await commentService(comment);
        if (!commentExists) {
            return res.status(404).json({
                code: "NOT_FOUND",
                message: "comment not found",
            });
        }

        if (feature == commentExists.feature_id) {
            const status = await commentService.likeComment(comment, user)

            return res.status(200).json({
                code: `FEATURE_${status.status.toUpperCase()}`,
                message: `Feature ${status.status} successfully`,
                data: status,
            });
            
        } else {
            return res.status(400).json({
                code: "COMMENT_FEATURE_MISMATCH",
                message: "The comment does not belong to the specified feature.",
            });
        }
            
        
    } catch (error) {
        console.error(error);
            return res.status(500).json({
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred",
        });
    }    
}

module.exports = {create, update, deleteComment, like}