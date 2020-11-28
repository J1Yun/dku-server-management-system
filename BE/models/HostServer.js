const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    const HostServer = sequelize.define('hostserver', {
        host: { type: DataTypes.STRING, allowNull: false },
        port: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        cpu: { type: DataTypes.INTEGER, allowNull: false },
        ram: { type: DataTypes.INTEGER, allowNull: false },
    });
    HostServer.prototype.dateFormat = (date) => moment(date).format('YYYY-MM-DD');

    HostServer.associate = (models) => {
        HostServer.hasMany(models.server, {
            foreignKey: 'hostId',
        });
    };

    return HostServer;
};
