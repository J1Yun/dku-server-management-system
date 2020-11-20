const models = require('../../../models');
module.exports = async () => {
    const query =
        'select r.id, r.start, r.end, r.serverId, u.name, u.department, IF (r.id in (select reservationId from returns where applyOk=1), 1, 0) as returnOK from users u join reservations r on u.userId = r.userId where r.applyOk=1';

    return await models.sequelize.query(query).spread(
        (results) => JSON.parse(JSON.stringify(results)),
        (error) => error,
    );
};
