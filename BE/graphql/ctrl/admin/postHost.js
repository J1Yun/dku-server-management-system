// type Host{
//     id: ID!
//     host: String!
//     port: Int!
//     name: String!
//     password: String!
//     location: String!
//     cpu: Int!
//     ram: Int!
//     createdAt: Date!
//     updatedAt: Date!
// }
// input AddHost {
//     id: ID!
//     host: String!
//     port: Int!
//     name: String!
//     password: String!
//     location: String!
//     cpu: Int!
//     ram: Int!
// }

const models = require('../../../models');
const momnet = require('moment');

module.exports = async ({ host }) => {
    return await models.hostserver
        .create({ ...host })
        .then((result) => {
            const data = result.get({ plain: true });
            return {
                id: host.id,
                host: host.host,
                port: host.port,
                name: host.name,
                password: host.password,
                location: host.location,
                cpu: host.cpu,
                ram: host.ram,
            };
        })
        .catch((error) => error);
};
