const { User, Comment, Op, sequelize, Feature} = require("../models");

const insertComment = async (user_id, featur_id, comment_id, body) => {
    const insertResult = await Comment.create({ user_id: user_id, featur_id: featur_id, comment_id: comment_id, body: body })
    return insertResult
}

const updateComment = async (id, body) => {
    const updateResult = await Comment.update(
        { body: body },
        { where:
            { id: id }
        }
    )
}

const getComment = async (id) => {
    const comment = await Comment.findByPk(id)
    return comment
}

const getFeatureComments = async (feature_id) => {
    const feature = await Feature.findByPk(feature_id)

    const comments = await feature.getComments()

    return comments
}

const destroyComment = async (id) => {
    const destroyResult = await Comment.destroy({
        where : { id : id }
    })

    return destroyResult
}

const likeComment = async (comment_id, user_id) => {
    let status = "liked"
    const user = await User.findByPk(user_id)
    const comment = await Comment.findByPk(comment_id)

    const is_liked = await user.hasLikedComment(comment)
    if (is_liked) {
        await user.removeLikedComment(comment)
        status = "unliked"
    } else {
        await user.addlikedComment(comment)
    }

    const total = await comment.countlikers()

    const result = {
        status: status,
        totalVotes: total
    }

    return result
}

module.exports = {insertComment, updateComment, getComment, getFeatureComments, destroyComment, likeComment}