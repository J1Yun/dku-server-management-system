// type ServerClient {
//     id: ID!
//     name: String!
//     os: String!
//     cpu: Int!
//     ram: Int!
// }
// getReservableServers(start: Date!, end: Date!): [ServerClient]

const models = require('../../../models');
module.exports = async ({ start, end }) => {
    const query =
        'select id, name, os, cpu, ram from servers s where s.id not in (select r.serverId from reservations r where r.applyOk!=2 and :start<=r.start or :end<=r.end);';
    return await models.sequelize.query(query, { replacements: { start, end } }).spread(
        (results) => JSON.parse(JSON.stringify(results)),
        (error) => error,
    );
};
