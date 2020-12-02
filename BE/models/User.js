const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
        userId: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        salt: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        tel: { type: DataTypes.STRING, allowNull: false },
        department: { type: DataTypes.STRING, allowNull: false },
        penalty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    });

    User.prototype.dateFormat = (date) => moment(date).format('YYYY-MM-DD');

    User.associate = (models) => {
        User.hasMany(models.reservation, {
            foreignKey: 'userId',
        });
    };
    return User;
};
