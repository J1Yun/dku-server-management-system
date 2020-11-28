// type GetHost{
//     id: ID!
//     name: String!
//     host: String!
//     cpu: Int!
//     ram: Int!
//     location: String!
// }

const models = require('../../../models');
module.exports = async () => {
    return await models.hostserver
        .findAll({
            attributes: ['id', 'name', 'host', 'cpu', 'ram', 'location'],
            raw: true,
        })
        .then((result) => result)
        .catch((err) => err);
};
