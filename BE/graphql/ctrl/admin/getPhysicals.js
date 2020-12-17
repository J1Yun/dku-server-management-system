const models = require('../../../models');
module.exports = async () =>
    await models.server
        .findAll({
            attributes: ['id', 'name', 'os', 'cpu', 'ram', 'host', 'port', 'password', 'location'],
            where: { isPhysical: 1 },
            raw: true,
        })
        .then((result) => result)
        .catch((error) => error);
