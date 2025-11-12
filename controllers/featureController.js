
const featureService = require("../services/featureServices");
const userService = require("../services/userServices");
const commentService = require("../services/commentServices");
const AppError = require('../utilities/appError')


const create = async (req, res, next) => {
    const {title, document, category, body} = req.body
    const user_id = req.user && req.user.id
    try {
        await featureService.insert(title, document, user_id, category, body)
        
        return res.status(201).json({
        code: "FEATURE_CREATED",
        message: "Your feature has been created successfully.",
      })
    } catch (error) {
        if (!(error instanceof AppError)) {
        return next(new AppError('Failed to create feature', 500, 'FEATURE_CREATION_FAILED'));
        }
        return next(error);
    }
}

const get = async (req, res, next) => {
    try {
        const feature_id = req.params.id
        const feature = await featureService.getFeature(feature_id)
        if (!feature) return next(new AppError('Feature not found', 404, 'NOT_FOUND'))
        const comments = await commentService.getFeatureComments(feature_id)

        const voters = await featureService.getVoters(feature_id)

        res.json({
            code: 'FEATURE_FETCHED',
            data: {  feature, comments, voters}
        })
    } catch (error) {
        next(error)
    }

}

const getAll = async (req, res, next) => {
    try {
        const { search, filter, status, sort, category} = req.query
        let user_id = null
        if (filter == "my")
            if (req.user) user_id = req.user.id
            else return next(new AppError('Forbidden', 403, 'FORBIDDEN'))

        const features = await featureService.getFeatures(search, status, sort, category, user_id)
        return res.json({
            code: 'FEATURES_LIST',
            data: features
        })
    } catch (error) {
        return next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const {title, status, document, category, body} = req.body
        const feature_id = req.params.id
        const feature = await featureService.getFeature(feature_id)

        if (!feature) return next(new AppError('feature not found', 404, 'NOT_FOUND'))
        
        const user = await userService.findbyEmail(req.user.email)
        const ownerField = feature.user_id
        if(ownerField !== req.user.id || (ownerField === req.user.id && user.is_superuser)) {
            return next(new AppError('Permission denied' ,403 ,'PERMISSOIN_DENIED'))
        } 

        await featureService.update(feature_id, title, status, document, category, body)
        return res.status(200).json({
            code: "FEATURE_UPDATED",
            message: "Your feature has been updated successfully.",
        })
    
    } catch (error) {
        return next(error)
    }
}

const destroy = async (req, res, next) => {
    try {
        const feature_id = req.params.id
        const feature = await featureService.getFeature(feature_id)

        if (!feature) return next(new AppError('feature not found', 404, 'NOT_FOUND'))

        const user = await userService.findbyEmail(req.user.email)
        const ownerField = feature.user_id

       if(ownerField !== req.user.id || (ownerField === req.user.id && user.is_superuser)) {
            return next(new AppError('Permission denied' ,403 ,'PERMISSOIN_DENIED'))
        } 

        const result = await featureService.destroy(feature_id)
        return res.status(200).json({
            code: "FEATURE_DELETED",
            message: "Your feature has been deleted successfully.",
        })

    } catch (error) {
        return next(error)
    }
}

const vote = async (req, res) => {
    const feature_id = req.params.id
    const user_id = req.user.id

    try {
        const feature = await featureService.getFeature(feature_id);
        if (!feature) return next(new AppError('feature not found', 404, 'NOT_FOUND'))

        const status = await featureService.voteFeature(user_id, feature_id)

        return res.status(200).json({
                code: `FEATURE_${status.status.toUpperCase()}`,
                message: `Feature ${status.status} successfully`,
                data: status,
            });


    } catch (error) {
        return next(error)
    }
}

module.exports = {create, get, getAll, update, destroy, vote}