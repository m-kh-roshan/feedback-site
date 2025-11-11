const {DataTypes, Op, Sequelize} = require('sequelize')

const sequelize = new Sequelize('feedbackSite', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})

// models
const User = require("./user")(sequelize, DataTypes)
const RefreshToken = require("./token")(sequelize, DataTypes)
const Feature = require("./feature")(sequelize, DataTypes)
const Comment = require("./comment")(sequelize, DataTypes)

// === Associations ===
// tokens
RefreshToken.belongsTo(User, {foreignKey: 'user_id', as: 'user'})
User.hasMany(RefreshToken ,{foreignKey: 'user_id', as: 'tokens'})

// features
Feature.belongsTo(User, {foreignKey: 'user_id', as: 'user'})
User.hasMany(Feature, {foreignKey: 'user_id', as: 'features'})

// vote (users <-> features)
Feature.belongsToMany(User, {through: 'votes', as: 'voters', foreignKey: 'feature_id', otherKey: 'user_id'})
User.belongsToMany(Feature, {through: 'votes', as: 'votedFeatures', foreignKey: 'user_id', otherKey: 'feature_id'})

//comments
Comment.belongsTo(User, {foreignKey: 'user_id', as: 'user'})
User.hasMany(Comment, {foreignKey: 'user_id', as: 'comments'})

Comment.belongsTo(Feature, {foreignKey: 'feature_id', as: 'feature'})
Feature.hasMany(Comment, {foreignKey: 'feature_id', as: 'comments'})

Comment.belongsTo(Comment, {foreignKey: 'comment_id', as: 'parent'})
Comment.hasMany(Comment, {foreignKey: 'comment_id', as: 'replies'})

// like (users <-> comments)
Comment.belongsToMany(User, {through: 'likes', as: 'likers', foreignKey: 'comment_id', otherKey: 'user_id'})
User.belongsToMany(Comment, {through: 'likes', as: 'likedComments', foreignKey: 'user_id', otherKey: 'comment_id'})

module.exports = { sequelize, Sequelize, Op, User, Feature, RefreshToken, Comment}



