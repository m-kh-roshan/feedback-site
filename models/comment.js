
module.exports = (sequelize, DataTypes) =>{
    const Comment = sequelize.define('Comment', {
        id: {type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
        feature_id: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false},
        user_id: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false},
        comment_id: {type: DataTypes.INTEGER.UNSIGNED, allowNull:true},
        body: {type: DataTypes.TEXT, allowNull: false}
    },
    {
        tableName: "comments",
        timestamps: true
    });

    return Comment;
}