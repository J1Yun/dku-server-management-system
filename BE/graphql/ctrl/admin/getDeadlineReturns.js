const models = require('../../../models');
const moment = require('moment');
module.exports = async ({ dDay }) => {
    const query = `select r.id, u.department as userDepartment, u.name as userName, u.tel as userTel, r.start, r.end, s.id as serverId, s.name as serverName, IF( end<:today, 1, 0 ) as late from reservations r join servers s on s.id = r.serverId join users u on r.userId = u.userId where r.applyOk=1 and end<=DATE_ADD(:today, INTERVAL :dDay DAY) and NOT EXISTS(select reservationId from returns where reservationId=r.id and r.applyOk!=2)`;

    return await models.sequelize
        .query(query, {
            replacements: {
                today: moment().format('YYYY-MM-DD'),
                dDay: parseInt(dDay),
            },
        })
        .spread(
            (result) => JSON.parse(JSON.stringify(result)),
            (error) => error,
        );
};
