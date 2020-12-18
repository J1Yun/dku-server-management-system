// type ServerClient {
//     id
//     name
//     os
//     cpu
//     ram
// }

// type Query {
//     getServersFromClient: [ServerClient]
// }

const models = require('../../../models');
module.exports = async () => {
    return await models.server
        .findAll({
            attributes: ['id', 'name', 'os', 'cpu', 'ram', 'isPhysical'],
            raw: true,
        })
        .then((result) => result)
        .catch((err) => err);
};
