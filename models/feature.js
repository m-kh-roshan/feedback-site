
module.exports = (sequelize, DataTypes) => {
    const Feature = sequelize.define('Feature', {
        id: {type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
        title: {type: DataTypes.STRING, allowNull: false},
        user_id: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false},
        status: {type: DataTypes.ENUM('none', 'under_review', 'planned', 'in_progress', 'complete', 'closed'),
            allowNull: false,
            defaultValue: 'none'
        },
        image: {type: DataTypes.STRING, allowNull: true},
        category: {type: DataTypes.STRING, allowNull: true},
        body: {type: DataTypes.TEXT, allowNull:true}
    },
    {
        tableName: "features",
        timestamps: true
    });

    return Feature
}