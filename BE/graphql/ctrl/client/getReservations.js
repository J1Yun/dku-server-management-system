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
    return await models.reservation
        .findAll({
            include: [
                {
                    model: models.server,
                    attributes: [
                        ['os', 'serverOS'],
                        ['name', 'serverName'],
                    ],
                },
            ],
            attributes: ['id', 'serverId', 'start', 'end'],
            where: { userId },
            raw: true,
        })
        .then((result) =>
            result.map((r) => {
                return {
                    id: r.id,
                    serverId: r.serverId,
                    start: r.start,
                    end: r.end,
                    serverOS: r['server.serverOS'],
                    serverName: r['server.serverName'],
                };
            }),
        )
        .catch((err) => log(err));
};
