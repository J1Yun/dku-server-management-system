const models = require('../../../models');
module.exports = async ({}, { userId }) => {
    const query = `select r.id, DATE_FORMAT(r.createdAt, '%Y-%c-%e') as createdAt, r.start, r.end, s.os, r.applyOk, IF(ret.id, ret.applyOk, 3) as returnOk from reservations r join servers s on r.serverId = s.id left join returns ret on r.id = ret.reservationId where r.userId=:userId`;
    return await models.sequelize.query(query, { replacements: { userId } }).spread(
        (results) => JSON.parse(JSON.stringify(results)),
        (error) => error,
    );
};
