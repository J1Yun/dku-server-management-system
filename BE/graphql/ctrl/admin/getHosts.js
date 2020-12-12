// type GetHost{
//     id: ID!
//     name: String!
//     host: String!
//     cpu: Int!
//     ram: Int!
//     location: String!
// }

const models = require('../../../models');
module.exports = async () =>
    await models.hostserver
        .findAll({
            attributes: ['id', 'name', 'password', 'host', 'cpu', 'ram', 'location'],
            raw: true,
        })
        .then((result) => result)
        .catch((err) => err);
;
