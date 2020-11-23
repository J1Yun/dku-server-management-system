const models = require('../../../models');
module.exports = async ({ id }, { userId }) => {
    const clientQuery = `select r.id, u.name as userName, u.department as userDepartment, DATE_FORMAT(r.createdAt, '%Y-%c-%e') as createdAt, r.start, r.end, s.name as serverName, s.id as serverId, s.os, s.cpu, s.ram, r.purpose from reservations r join users u on u.userId = r.userId join servers s on s.id = r.serverId where r.id=:id and r.userId=:userId and r.applyOk = 1`;

    const adminQuery = `select r.id, u.name as userName, u.department as userDepartment, DATE_FORMAT(r.createdAt, '%Y-%c-%e') as createdAt, r.start, r.end, s.name as serverName, s.id as serverId, s.os, s.cpu, s.ram, r.purpose from reservations r join users u on u.userId = r.userId join servers s on s.id = r.serverId where r.id=:id and r.applyOk = 1`;

    const userType = await models.user
        .findOne({
            attributes: ['type'],
            where: { userId },
            raw: true,
        })
        .then((result) => parseInt(result))
        .catch((error) => error);

    if (userType === 0) {
        return await models.sequelize.query(clientQuery, { replacements: { id, userId } }).spread(
            (results) => JSON.parse(JSON.stringify(results)),
            (error) => error,
        );
    } else {
        return await models.sequelize.query(adminQuery, { replacements: { id } }).spread(
            (results) => JSON.parse(JSON.stringify(results)),
            (error) => error,
        );
    }
};
