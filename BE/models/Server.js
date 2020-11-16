const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    const Server = sequelize.define('server', {
        name: { type: DataTypes.STRING, allowNull: false },
        os: { type: DataTypes.STRING, allowNull: false },
        cpu: { type: DataTypes.INTEGER, allowNull: false },
        ram: { type: DataTypes.INTEGER, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
    });

    Server.prototype.dateFormat = (date) => moment(date).format('YYYY-MM-DD');

    Server.associate = (models) => {
        Server.hasMany(models.reservation, {
            foreignKey: 'serverId',
        });
    };

    return Server;
};
