const models = require('../../../models');
module.exports = async () => {
    const query = `SELECT ret.id, DATE_FORMAT(ret.createdAt, '%Y-%c-%e') as createdAt, u.department AS userDepartment, u.name as userName, r.start, r.end , s.id as serverId, s.name as serverName from returns ret join reservations r on r.id = ret.reservationId join users u  on u.userId = r.userId join servers s on s.id = r.serverId where ret.applyOk=0 order by ret.id desc`;

    return await models.sequelize.query(query).spread(
        (results) => JSON.parse(JSON.stringify(results)),
        (error) => error,
    );
};
