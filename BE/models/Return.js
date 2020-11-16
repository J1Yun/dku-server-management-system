const moment = require("moment");

module.exports = function (sequelize, DataTypes) {
    const Return = sequelize.define("return", {
        reservationId: {type: DataTypes.INTEGER, allowNull: false },
        end: { type: DataTypes.DATEONLY, allowNull: false },
        uses: { type: DataTypes.TEXT, allowNull: false },
        rating: { type: DataTypes.INTEGER, allowNull: true },
        review: { type: DataTypes.TEXT, allowNull: true },
        applyOk: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    });

    Return.prototype.dateFormat = (date) => moment(date).format("YYYY-MM-DD");
    Return.associate = (models) => {
        Return.belongsTo(models.reservation, {
            foreignKey: 'reservationId',
            onDelete: 'cascade',
            onUpdate: 'cascade'
        });
      };
    return Return;
};

