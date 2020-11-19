// type ConfirmReservation{
//     id: ID!
//     serverId: ID!
//     userId: String!
//     createdAt: Date!
//     start: Date!
//     end: Date!
//     os: String!
//     applyOk: String!
// }

const models = require('../../../models');
module.exports = async ({}, { userId }) => {
    return await models.reservation
        .findAll({
            include: [
                {
                    model: models.server,
                    attributes: [['os', 'serverOS']],
                },
            ],
            attributes: ['start', 'end', 'applyOk', 'createdAt'],
            where: { userId },
            order: [['id', 'DESC']],
            raw: true,
        })
        .then((result) =>
            result.map((r) => {
                return {
                    start: r.start,
                    end: r.end,
                    applyOk: parseInt(r.applyOk),
                    createdAt: r.createdAt,
                    os: r['server.serverOS'],
                };
            }),
        )
        .catch((err) => err);
};
