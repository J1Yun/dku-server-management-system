const models = require('../../../models');
module.exports = async () => {
    const query =
        'select s.id as id, name, os, cpu, ram, isPhysical, IF ( EXISTS (select id from reservations r where applyOk=1 and serverId=s.id and start<=date(now()) and end>=date(now()) and NOT EXISTS (select reservationId from returns where r.id=reservationId and applyOk=1)) , 1, 0) as isUsing from servers s';
    return await models.sequelize.query(query).spread(
        (results) => JSON.parse(JSON.stringify(results)),
        (error) => error,
    );
};
