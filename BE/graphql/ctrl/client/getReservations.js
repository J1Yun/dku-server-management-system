// type ReservationWithServerInfo {
//     id: ID!
//     serverId: ID!
//     start: Date
//     end: Date
//     serverOS: String
//     serverName: String
// }

// getReservations: [ReservationWithServerInfo]

// 이후 반납된(return에 들어간) 건은 제외하는 조인 추가

const models = require('../../../models');
module.exports = async ({}, { userId }) => {
    const query =
        'select r.id, r.serverId, r.start, r.end, name as serverName, os as serverOS from servers s join reservations r on s.id = r.serverId where r.userId=:userId  and r.applyOk=1 and not exists ( select ret.reservationId from returns ret where r.id=ret.reservationId )';
    return await models.sequelize.query(query, { replacements: { userId } }).spread(
        (results) => JSON.parse(JSON.stringify(results)),
        (error) => error,
    );
};
