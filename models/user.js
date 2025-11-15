
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
        username: {type: DataTypes.STRING, allowNull:false},
        email: {
            type: DataTypes.STRING, 
            allowNull:false, 
            unique:true,
            validate: {
                isEmail: true
            },
            set(value) {
                this.setDataValue('email', value)

                if (!this.username) {
                    const usernamePart = value.split('@')[0]
                    this.setDataValue('username', usernamePart)
                }
            }
        },
        
        password: {
            type: DataTypes.STRING, 
            allowNull:false,
            validate: { len: [8, 255] }
        },
        is_superuser: {type: DataTypes.BOOLEAN, defaultValue:false, allowNull:false},
        email_verified: {type: DataTypes.BOOLEAN, defaultValue:false, allowNull:false},
        email_token: {type: DataTypes.STRING, allowNull: true},
        email_token_expire: {type: DataTypes.DATE, allowNull: true},
        reset_password_token: {type: DataTypes.STRING, allowNull: true},
        reset_password_token_expire: {type: DataTypes.DATE, allowNull: true}
    },
    {
        tableName: "users",
        timestamps: true
    });

    return User;
}