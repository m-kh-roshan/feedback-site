
const featureService = require("../services/featureServices");
const userService = require("../services/userServices");
const commentService = require("../services/commentServices");
const AppError = require("../utilities/appError")

const create = async (req, res, next) => {
    try {
        const {comment_id, body} = req.body
        const feature_id = req.params.id
        const feature = await featureService.getFeature(feature_id)
        if (!feature) return next(new AppError('feature not found', 404, 'NOT_FOUND'))    
        
        await commentService.insertComment(req.user.id, feature_id, comment_id, body)
        return res.status(201).json({
        code: "COMMENT_CREATED",
        message: "Your comment has been created successfully.",
      })
    } catch (error) {
        return next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const {id, commentId} = req.params
        const { body } = req.body
        const feature = await featureService.getFeature(id)
        if (!feature) return next(new AppError('feature not found', 404, 'NOT_FOUND'))   
    
        const comment = await commentService.getComment(commentId)
        if (!comment) return next(new AppError('Comment not found', 404, 'NOT_FOUND'))

        const ownerField = comment.user_id
        if(ownerField !== req.user.id) {
            return next(new AppError('Permission denied' ,403 ,'PERMISSOIN_DENIED'))
        }

        const feaureField = comment.feature_id
        if(feaureField != id) {
            return next(new AppError('The comment does not belong to the specified feature.' ,403 ,'COMMENT_FEATURE_MISMATCH'))
        }

        await commentService.updateComment(commentId, body)
        return res.status(200).json({
            code: "COMMENT_UPDATED",
            message: "Your comment has been updated successfully.",
        })

    } catch (error) {
        return next(error)
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const {id, commentId} = req.params
        const comment = await commentService.getComment(commentId)
        if (!comment) return next(new AppError('Comment not found', 404, 'NOT_FOUND'))

        const feature = await featureService.getFeature(id)
        if (!feature) return next(new AppError('feature not found', 404, 'NOT_FOUND'))
        
        const ownerField = comment.user_id
        if(ownerField != req.user.id) {
            return next(new AppError('Permission denied' ,403 ,'PERMISSOIN_DENIED'))
        }

        const feaureField = comment.feature_id
        if(feaureField != id) {
            return next(new AppError('The comment does not belong to the specified feature.' ,403 ,'COMMENT_FEATURE_MISMATCH'))
        }

        await commentService.destroyComment(commentId)
        return res.status(200).json({
            code: "COMMENT_DELETED",
            message: "Your comment has been deleted successfully.",
        })
        
    } catch (error) {
        return next(error)
    }
}

const like = async (req, res, next) => {
    const feature = req.params.id
    const comment = req.params.commentId
    const user = req.user.id

    try {
        const featureExists = await featureService.getFeature(feature);
        if (!featureExists) return next(new AppError('feature not found', 404, 'NOT_FOUND'))

        const commentExists = await commentService(comment);
        if (!commentExists) return next(new AppError('Comment not found', 404, 'NOT_FOUND'))

        const feaureField = commentExists.feature_id
        if(feaureField != feature) {
            return next(new AppError('The comment does not belong to the specified feature.' ,403 ,'COMMENT_FEATURE_MISMATCH'))
        }

        const status = await commentService.likeComment(comment, user)
        return res.status(200).json({
            code: `COMMENT_${status.status.toUpperCase()}`,
            message: `Comment ${status.status} successfully`,
            data: status,
        });
    } catch (error) {
        return next(error)
    }    
}

module.exports = {create, update, deleteComment, like}