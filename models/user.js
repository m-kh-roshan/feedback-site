
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
        is_superuser: {type: DataTypes.BOOLEAN, defaultValue:false, allowNull:false}
    },
    {
        tableName: "users",
        timestamps: true
    });

    return User;
}