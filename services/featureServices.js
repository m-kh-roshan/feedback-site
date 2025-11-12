const { User, Feature, Op, sequelize} = require("../models");

const insert = async(title, document, user_id, category, body) => {
    const insertResult = await Feature.create({ title:title, document:document, user_id:user_id, category:category, body:body })
    const user = await User.findByPk(user_id)

    await user.addVotedFeature(insertResult)

    return insertResult
}

const update = async (id, title, status, document, category, body) => {
    const updateResult = Feature.update(
        {title: title, status:status , document:document, category:category, body:body},
        {
            where: { id: id }
        }
    ) 

    return updateResult
}

const getFeature = async (id) => {
    const feature = Feature.findByPk(id)
    return feature
}

const getFeatures = async (search, status, sort, category, user_id) => {

    let sort_word = ""
        if (sort == "top") 
            sort_word = "vote_count"
        else 
            sort_word = "createdAt"
    const features = await Feature.findAll({
        where: {
      ...(search && {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { body: { [Op.like]: `%${search}%` } },
        ],
      }),
      ...(category && { category }),
      ...(status && { status }),
      ...(user_id && { user_id }),
    },
    include: [
      { model: User, as: 'user', attributes: ['username'] },
      {
        model: User,
        as: 'voters',
        attributes: [],
        through: { attributes: [] },
        required: false
      },
    ],
    attributes: {
      include: [
        [sequelize.fn('COUNT', sequelize.col('voters.id')), 'vote_count'],
      ],
    },
    group: ['Feature.id', 'user.id'],
    order: sort === "top" 
        ? [[sequelize.literal('vote_count'), 'DESC']] 
        : [['createdAt', 'DESC']],
    })

    return features
}

const destroy = async (id) => {
    const destroyResult = Feature.destroy({
        where: { id: id }
    })

    return destroyResult
}

const voteFeature = async (user_id, feature_id) => {
    let status = "voted"
    const user = await User.findByPk(user_id)
    const feature = await Feature.findByPk(feature_id)

    const is_voted = await user.hasVotedFeature(feature)
    if (is_voted) {
        await user.removeVotedFeature(feature)
        status = "unvoted"
    } else {
        await user.addVotedFeature(feature)
    }

    const total = await feature.countVoters()

    const result = {
        status: status,
        totalVotes: total
    }

    return result
}

const getVoters = async (id) => {
    const feature = await Feature.findByPk(id)

    const voters = await feature.getVoters({
        attributes: ['id', 'username']
    })

    return voters
}


module.exports = {insert, getFeature, getFeatures, update, destroy, voteFeature, getVoters}