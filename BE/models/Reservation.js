const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    const Reservation = sequelize.define('reservation', {
        userId: { type: DataTypes.STRING, allowNull: false },
        serverId: { type: DataTypes.INTEGER, allowNull: false },
        start: { type: DataTypes.DATEONLY, allowNull: false },
        end: { type: DataTypes.DATEONLY, allowNull: false },
        purpose: { type: DataTypes.TEXT, allowNull: false },
        applyOk: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    });

    Reservation.prototype.dateFormat = (date) => moment(date).format('YYYY-MM-DD');

    Reservation.associate = (models) => {
        Reservation.belongsTo(models.user, {
            foreignKey: 'userId',
            targetKey: 'userId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });

        Reservation.belongsTo(models.server, {
            foreignKey: 'serverId',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });

        Reservation.hasOne(models.return, {
            foreignKey: 'reservationId',
        });
    };

    return Reservation;
};
