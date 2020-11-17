const models = require('../../../models');

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

module.exports = async () => {
    return await models.server
        .findAll({
            attributes: ['id', 'name', 'os', 'cpu', 'ram'],
            raw: true,
        })
        .then((result) => result)
        .catch((err) => err);
};
