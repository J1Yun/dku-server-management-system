const models = require('../../../models');
module.exports = async () => {
    const query = `select r.id, s.id as serverId, u.department as userDepartment, u.name as userName, DATE_FORMAT(r.createdAt, '%Y-%c-%e') as createdAt, r.start, r.end, r.applyOk, IF(ret.id, ret.applyOk, 3) as returnOk from reservations r join servers s on r.serverId = s.id join users u on r.userId = u.userId left join returns ret on r.id = ret.reservationId;`;
    return await models.sequelize.query(query).spread(
        (result) => JSON.parse(JSON.stringify(result)),
        (error) => error,
    );
};
