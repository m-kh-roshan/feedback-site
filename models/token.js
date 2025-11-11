
module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define('RefreshToken', {
        id: {type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
        user_id: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false},
        token: {type: DataTypes.STRING(500), allowNull: false},
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }   
    },
    {
        tableName: 'refresh_tokens',
        timestamps: true
    });

    return RefreshToken;
}