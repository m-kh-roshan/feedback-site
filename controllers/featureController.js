const Joi = require("joi");
const featureService = require("../services/featureServices");
const userService = require("../services/userServices");

const create = async (req, res, next) => {
    const schema = Joi.object({
            title : Joi.string().min(3).required(),
            document : Joi.string(),
            category: Joi.string(),
            body: Joi.string()
        })
    const validateResult = schema.validate(req.body)
    if(validateResult.error) 
        return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: validateResult.error.details[0].message,
    });

    try {
        await featureService.insert(req.body.title, req.body.document, req.user.id, req.body.category, req.body.body)
        
        return res.status(201).json({
        code: "FEATURE_CREATED",
        message: "Your feature has been created successfully.",
      })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
        code: "FEATURE_CREATION_FAILED",
        message: `Failed to create feature due to ${error}`,
      });
    }
}

const getAll = async (req, res) => {
    const { search, filter, status, sort, category} = req.query
    let user_id = null
    if (filter == "my")
        if (req.user) {
            user_id = req.user.id
        }
        else {
            return res.status(403).json({
                message: "Forbidden"
            })
        }
    const features = await featureService.getFeatures(search, status, sort, category, user_id)
    return res.json(features)
}

const update = async (req, res) => {
    const schema = Joi.object({
        title : Joi.string().min(3).required(),
        document : Joi.string(),
        category: Joi.string(),
        body: Joi.string(),
        status: Joi.string()
    })
    const validateResult = schema.validate(req.body)
    if(validateResult.error)
        return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: validateResult.error.details[0].message,
    });
    
    const feature = await featureService.getFeature(req.params.id)

    if (!feature) {
        return res.status(404).json({
            code: "NOT_FOUND",
            message: "feature not found"
        })
    }
    const user = await userService.findbyEmail(req.user.email)

    try {
        if(feature.user_id === req.user.id || user.is_superuser) {

            await featureService.update(req.params.id, req.body.title, req.body.status, req.body.document, req.body.category, req.body.body)
            return res.status(200).json({
                code: "FEATURE_UPDATED",
                message: "Your feature has been updated successfully.",
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
        code: "FEATURE_CREATION_FAILED",
        message: "Failed to create feature due to an unknown error.",
      });
    }
}

const destroy = async (req, res) => {
    try {
        const feature = await featureService.getFeature(req.params.id)
        if (!feature) {
            return res.status(404).json({
                code: "NOT_FOUND",
                message: "feature not found"
            })
        }
        const user = await userService.findbyEmail(req.user.email)

        if(feature.user_id === req.user.id || user.is_superuser){
            const result = await featureService.destroy(req.params.id)
            return res.status(200).json({
                code: "FEATURE_DELETED",
                message: "Your feature has been deleted successfully.",
            })

        } else {
            return res.status(403).json({
                code: "PERMISSOIN_DENIED",
                message: "permission denied.",
            });
        }
    } catch (error) {
        
    }
}

const vote = async (req, res) => {
    const feature_id = req.params.id
    const user_id = req.user.id

    try {
        const feature = await featureService.getFeature(feature_id);
        if (!feature) {
            return res.status(404).json({
                code: "NOT_FOUND",
                message: "Feature not found",
            });
        }

        const status = await featureService.voteFeature(user_id, feature_id)

        return res.status(200).json({
                code: `FEATURE_${status.status.toUpperCase()}`,
                message: `Feature ${status.status} successfully`,
                data: status,
            });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred",
        });
    }
}

module.exports = {create, getAll, update, destroy, vote}