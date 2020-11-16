const moment = require("moment");

module.exports = function (sequelize, DataTypes) {
  const Postpone = sequelize.define("postpone", {
    reservationId: {type: DataTypes.INTEGER, allowNull: false },
    end: { type: DataTypes.DATEONLY, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    applyOk: { type: DataTypes.INTEGER, allowNull: false , defaultValue: 0 }
  });

  Postpone.prototype.dateFormat = (date) => moment(date).format("YYYY-MM-DD");

  Postpone.associate = (models) => {
    Postpone.belongsTo(models.reservation, {
        foreignKey: 'reservationId',
        onDelete: 'cascade',
        onUpdate: 'cascade'
    });
  };

  return Postpone;
};
